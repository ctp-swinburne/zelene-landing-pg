"use client";

import React from "react";
import { Card, Button, Space, Drawer, Form, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import { SupportRequestTable } from "./_components/SupportRequestTable";
import { SupportRequestForm } from "./_components/SupportRequestForm";
import { type SupportRequest, Status } from "./_components/types";

export default function SupportRequestPage() {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [form] = Form.useForm<SupportRequest>();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [status, setStatus] = React.useState<Status | undefined>();

  const { data, isLoading } = api.adminQueryView.getSupportRequests.useQuery({
    page,
    limit: pageSize,
    status,
  });

  const handleRespond = (record: SupportRequest) => {
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleSave = async (values: SupportRequest) => {
    console.log("Update support request:", values);
    setDrawerVisible(false);
    form.resetFields();
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleStatusFilter = (value: Status | undefined) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Support Requests</h1>
            <p className="text-gray-500">
              Manage and respond to user support requests
            </p>
          </div>
          <Space>
            <Select
              placeholder="Filter by status"
              allowClear
              onChange={handleStatusFilter}
              value={status}
              style={{ width: 200 }}
              options={[
                { label: "New", value: Status.NEW },
                { label: "In Progress", value: Status.IN_PROGRESS },
                { label: "Resolved", value: Status.RESOLVED },
                { label: "Cancelled", value: Status.CANCELLED },
              ]}
              prefix={<FilterOutlined />}
            />
          </Space>
        </div>

        <SupportRequestTable
          data={data?.items ?? []}
          loading={isLoading}
          onEdit={handleRespond}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: (data?.totalPages ?? 1) * pageSize,
            onChange: handlePaginationChange,
          }}
        />
      </Card>

      <Drawer
        title="Respond to Support Request"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Update Request
            </Button>
          </Space>
        }
      >
        <SupportRequestForm form={form} onFinish={handleSave} />
      </Drawer>
    </div>
  );
}
