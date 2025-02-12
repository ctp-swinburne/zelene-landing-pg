// TagInput.tsx
import React, { useState, useRef } from 'react';
import { Input, Tag, Space, Dropdown, message } from 'antd';
import type { InputRef } from 'antd';
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { CrownOutlined } from '@ant-design/icons';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  className,
}) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
  
  const canCreateOfficialTags = session?.user.role === "ADMIN" || session?.user.role === "TENANT_ADMIN";

  const searchValue = inputValue.startsWith('#') ? inputValue.slice(1) : inputValue;
  const { data: searchResults } = api.tag.search.useQuery(
    { query: searchValue },
    { 
      enabled: searchValue.length >= 2,
      staleTime: 1000,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.startsWith('#') && newValue.length >= 3) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleAddTag = (tagName: string) => {
    const normalizedTag = tagName.replace(/^#/, '').toLowerCase().trim();
    
    if (!normalizedTag) return;
    
    if (!value.includes(normalizedTag)) {
      onChange?.([...value, normalizedTag]);
      message.success(`Added tag: ${normalizedTag}`);
    }
    
    setInputValue('');
    setDropdownVisible(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      
      const tagText = inputValue.replace(/^#/, '').trim();
      
      if (tagText.length < 2) {
        message.warning('Tag must be at least 2 characters');
        return;
      }

      const isOfficialTag = tagText.includes('official');
      if (isOfficialTag && !canCreateOfficialTags) {
        message.error('Only administrators can create official tags');
        return;
      }

      handleAddTag(tagText);
    }
  };

  const menuItems = searchResults?.map(tag => ({
    key: tag.id.toString(),
    label: (
      <Space>
        {tag.name}
        {tag.isOfficial && <CrownOutlined style={{ color: '#faad14' }} />}
      </Space>
    ),
    onClick: () => handleAddTag(tag.name),
  }));

  return (
    <div className={className}>
      <div className="mb-2 text-sm text-gray-500">
        {canCreateOfficialTags ? (
          <Space>
            <span>Type # to search existing tags or create new ones.</span>
            <span>Add &apos;official&apos; suffix for official tags.</span>
          </Space>
        ) : (
          <span>Type # to search existing tags or create new ones.</span>
        )}
      </div>
      
      <Space direction="vertical" className="w-full">
        <Dropdown
          menu={{ items: menuItems }}
          open={dropdownVisible && (menuItems?.length ?? 0) > 0}
          onOpenChange={setDropdownVisible}
        >
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type to add tags..."
            allowClear
          />
        </Dropdown>
        
        <Space size={[0, 8]} wrap>
          {value.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => {
                const newTags = value.filter(t => t !== tag);
                onChange?.(newTags);
              }}
              className={`mb-2 mr-2 ${
                tag.includes('official')
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                  : ''
              }`}
            >
              {tag.includes('official') && (
                <CrownOutlined className="mr-1" style={{ color: '#faad14' }} />
              )}
              #{tag}
            </Tag>
          ))}
        </Space>
      </Space>
    </div>
  );
};