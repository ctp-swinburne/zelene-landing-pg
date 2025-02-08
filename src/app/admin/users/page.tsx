"use client";

import React from "react";
import { Card, Button, Space, Modal, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import UserManagementTable from "./_components/UserManagementTable";
import UserForm from "./_components/UserForm";
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
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<Omit<User, 'joined'> | null>(null);
  const { data: session } = useSession();

  const utils = api.useUtils();
  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";

  // Create user mutation
  const createMutation = api.admin.createUser.useMutation({
    onSuccess: async () => {
      message.success("User created successfully");
      setModalVisible(false);
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
      setModalVisible(false);
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
          username: values.username,
          email: values.email,
          name: values.name,
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
          username: values.username,
          email: values.email,
          name: values.name,
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
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

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
              setModalVisible(true);
            }}
          >
            Add User
          </Button>
        </div>

        <UserManagementTable onEdit={handleEdit} />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {editingUser ? 'Edit User' : 'Add New User'}
            </span>
            {editingUser && (
              <span className="text-sm text-gray-500">
                #{editingUser.id}
              </span>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={handleClose}
        width={720}
        centered
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: "MEMBER" }}
          className="mt-4"
        >
          <UserForm 
            form={form}
            editingUser={editingUser}
            isTenantAdmin={isTenantAdmin}
          />
        </Form>
      </Modal>
    </div>
  );
}