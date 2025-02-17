import React from 'react';
import { Table, Tag, Button, Space, Popconfirm, message, Input, Select } from 'antd';
import type { TableProps } from 'antd';
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { SearchOutlined } from "@ant-design/icons";

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
  role: "MEMBER" | "ADMIN" | "TENANT_ADMIN";
  joined: Date;
}

interface UserTableProps {
  onEdit: (user: {
    id: string;
    username: string;
    email: string;
    name: string;
    role: "MEMBER" | "ADMIN" | "TENANT_ADMIN";
  }) => void;
}

export default function UserManagementTable({ onEdit }: UserTableProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string | undefined>();

  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";

  // Query users
  const { data, isLoading } = api.admin.listUsers.useQuery({
    page,
    limit: pageSize,
  });

  // Delete mutation
  const deleteMutation = api.admin.deleteUser.useMutation({
    onSuccess: async (_, variables) => {
      console.log(`User deleted successfully - ID: ${variables.userId}`);
      console.log('Checking for related data cleanup...');
      
      message.success('User deleted successfully');
      await utils.admin.listUsers.invalidate();
    },
    onError: (error, variables) => {
      console.error(`Failed to delete user - ID: ${variables.userId}`, error);
      message.error(error.message);
    },
  });

  const handleDelete = async (userId: string, userRole: string) => {
    if (!isTenantAdmin && userRole === "ADMIN") {
      message.error("You don't have permission to delete admin users");
      return;
    }

    if (userRole === "TENANT_ADMIN") {
      message.error("Cannot delete tenant admin users");
      return;
    }

    try {
      await deleteMutation.mutateAsync({ userId });
    } catch {
      // Error handling is done in mutation callbacks
    }
  };

  const handleEdit = (user: User) => {
    onEdit({
      id: user.id,
      username: user.username ?? '',
      email: user.email ?? '',
      name: user.name ?? '',
      role: user.role,
    });
  };

  // Filter data based on search text and role filter
  const filteredData = React.useMemo(() => {
    if (!data?.items) return [];
    
    return data.items.filter(user => {
      const matchesSearch = searchText.toLowerCase() === '' || (
        (user.username?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
        (user.email?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
        (user.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
      );

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [data?.items, searchText, roleFilter]);

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string | null, record: User) => (
        <div>
          <div className="font-medium">{text ?? 'N/A'}</div>
          <div className="text-sm text-gray-500">{record.name ?? 'N/A'}</div>
        </div>
      ),
      sorter: (a, b) => (a.username ?? '').localeCompare(b.username ?? ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string | null) => text ?? 'N/A',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors = {
          MEMBER: 'blue',
          ADMIN: 'purple',
          TENANT_ADMIN: 'gold',
        };
        return <Tag color={colors[role as keyof typeof colors]}>{role}</Tag>;
      },
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.joined).getTime() - new Date(b.joined).getTime(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const canModify = isTenantAdmin || record.role === "MEMBER";
        
        if (!canModify) return null;

        return (
          <Space size="middle">
            <Button type="link" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user? This action cannot be undone."
              onConfirm={() => handleDelete(record.id, record.role)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="link" 
                danger 
                loading={deleteMutation.isPending}
                disabled={record.role === "TENANT_ADMIN"}
                style={{ 
                  opacity: record.role === "TENANT_ADMIN" ? 0.5 : 1,
                  cursor: record.role === "TENANT_ADMIN" ? 'not-allowed' : 'pointer'
                }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          placeholder="Filter by role"
          style={{ width: 150 }}
          allowClear
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'MEMBER', label: 'Member' },
            { value: 'ADMIN', label: 'Admin' },
            { value: 'TENANT_ADMIN', label: 'Tenant Admin' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: (data?.totalPages ?? 0) * pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
}