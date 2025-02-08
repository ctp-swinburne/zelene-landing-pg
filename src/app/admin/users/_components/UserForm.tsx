import React from 'react';
import { Form, Input, Select, Progress, Space, Alert, Divider } from 'antd';
import type { FormInstance } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, LockOutlined } from '@ant-design/icons';

interface UserFormData {
  username: string;
  email: string;
  name: string;
  role: "MEMBER" | "ADMIN";
  password?: string;
}

interface UserFormProps {
  form: FormInstance<UserFormData>;
  editingUser: {
    id: string;
    username: string | null;
    email: string | null;
    name: string | null;
    role: "MEMBER" | "ADMIN" | "TENANT_ADMIN";
  } | null;
  isTenantAdmin: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ form, editingUser, isTenantAdmin }) => {
  const [passwordStrength, setPasswordStrength] = React.useState(0);
  
  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.exec(password)) strength += 25;
    if (/[0-9]/.exec(password)) strength += 25;
    if (/[^A-Za-z0-9]/.exec(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return '#ff4d4f';
    if (strength <= 50) return '#faad14';
    if (strength <= 75) return '#52c41a';
    return '#1890ff';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  // Username validation handler
  const handleUsernameChange = (value: string): void => {
    if (form && typeof form.validateFields === 'function') {
      form.validateFields(['username']).catch(console.error);
    }
  };

  const roleOptions = [
    { 
      label: "Member", 
      value: "MEMBER" as const, 
      description: "Regular user with basic access" 
    },
    ...(isTenantAdmin ? [{
      label: "Admin",
      value: "ADMIN" as const,
      description: "Administrator with enhanced privileges"
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Form Header with Context */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {editingUser ? 'Edit User Details' : 'Create New User'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {editingUser 
            ? 'Update user information and permissions' 
            : 'Fill in the information below to create a new user account'}
        </p>
      </div>

      <Divider />

      {/* Basic Information Section */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-700">Basic Information</h4>
        
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please enter a username' },
            { min: 3, message: 'Username must be at least 3 characters' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Username"
            onChange={e => handleUsernameChange(e.target.value)}
            className="rounded-md"
          />
        </Form.Item>

        <Space className="w-full" direction="vertical" size="middle">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email address"
              type="email"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter full name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input 
              prefix={<IdcardOutlined className="text-gray-400" />}
              placeholder="Full name"
              className="rounded-md"
            />
          </Form.Item>
        </Space>
      </div>

      <Divider />

      {/* Access Control Section */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-700">Access Control</h4>
        
        {!editingUser && (
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-md"
              onChange={e => setPasswordStrength(calculatePasswordStrength(e.target.value))}
            />
          </Form.Item>
        )}

        {!editingUser && passwordStrength > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Password Strength:</span>
              <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
            <Progress 
              percent={passwordStrength} 
              strokeColor={getPasswordStrengthColor(passwordStrength)}
              showInfo={false}
              size="small"
            />
            <div className="mt-2">
              <Alert
                message="Password Requirements"
                description={
                  <ul className="list-disc pl-4 text-sm">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase letters</li>
                    <li>Contains numbers</li>
                    <li>Contains special characters</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </div>
          </div>
        )}

        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Please select a role' }]}
          className="w-full"
        >
          <Select
            placeholder="Select user role"
            optionLabelProp="label"
            className="w-full"
            dropdownStyle={{ padding: '8px' }}
            listHeight={200}
            options={roleOptions.map(role => ({
              label: role.label,
              value: role.value,
              children: (
                <div className="flex flex-col gap-1 py-2">
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
              )
            }))}
            optionRender={(option) => option.data.children}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default UserForm;