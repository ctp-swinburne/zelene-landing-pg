"use client";

import React from "react";
import { Card, Button, Space, Drawer, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import UserManagementTable from "./_components/UserManagementTable";
import { useSession } from "next-auth/react";
import type { User } from "./_components/UserManagementTable";

interface FormData {
  username: string;
  email: string;
  name: string;
  role: "MEMBER" | "ADMIN";
  password?: string;
}

export default function UserManagementPage() {
  const [form] = Form.useForm<FormData>();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<Omit<User, 'joined'> | null>(null);
  const { data: session } = useSession();

  const utils = api.useUtils();
  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";

  // Create user mutation
  const createMutation = api.admin.createUser.useMutation({
    onSuccess: async () => {
      message.success("User created successfully");
      setDrawerVisible(false);
      form.resetFields();
      await utils.admin.listUsers.invalidate();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  // Update user mutation
  const updateMutation = api.admin.updateUser.useMutation({
    onSuccess: async () => {
      message.success("User updated successfully");
      setDrawerVisible(false);
      form.resetFields();
      await utils.admin.listUsers.invalidate();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleSubmit = async (values: FormData) => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData = {
          id: editingUser.id,
          username: values.username ?? '',
          email: values.email ?? '',
          name: values.name ?? '',
          role: values.role,
        };
        await updateMutation.mutateAsync(updateData);
      } else {
        // Create new user
        if (!values.password) {
          message.error('Password is required for new users');
          return;
        }
        await createMutation.mutateAsync({
          username: values.username ?? '',
          email: values.email ?? '',
          name: values.name ?? '',
          role: values.role,
          password: values.password,
        });
      }
    } catch {
      // Error handling is done in mutation callbacks
    }
  };

  const handleEdit = (user: Omit<User, 'joined'>) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username ?? '',
      email: user.email ?? '',
      name: user.name ?? '',
      role: user.role === 'TENANT_ADMIN' ? 'ADMIN' : user.role,
    });
    setDrawerVisible(true);
  };

  const roleOptions = [
    { label: "Member", value: "MEMBER" },
    ...(isTenantAdmin ? [{ label: "Admin", value: "ADMIN" }] : []),
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setDrawerVisible(true);
            }}
          >
            Add User
          </Button>
        </div>

        <UserManagementTable onEdit={handleEdit} />
      </Card>

      <Drawer
        title={editingUser ? "Edit User" : "Add New User"}
        width={520}
        onClose={() => {
          setDrawerVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: "MEMBER" }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}