"use client";

import React from "react";
import { Card, Button, Space, Drawer, Form, Select, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import { SupportRequestTable } from "./_components/SupportRequestTable";
import { SupportRequestForm } from "./_components/SupportRequestForm";
import { type SupportRequest, Status } from "./_components/types";
import type { QueryResponseInput } from "~/schema/admin-query-mutations";

export default function SupportRequestPage() {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [form] = Form.useForm<SupportRequest>();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [status, setStatus] = React.useState<Status | undefined>();

  const utils = api.useUtils();

  // Query for support requests
  const { data, isLoading } = api.adminQueryView.getSupportRequests.useQuery({
    page,
    limit: pageSize,
    status,
  });

  // Query for counts to update the status filter badges
  const { data: queryCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status,
  });

  // Mutation for updating support requests
  const updateMutation =
    api.adminQueryMutations.updateSupportRequest.useMutation({
      onSuccess: () => {
        message.success("Support request updated successfully");
        setDrawerVisible(false);
        form.resetFields();
        // Invalidate both queries to refresh the data
        void utils.adminQueryView.getSupportRequests.invalidate();
        void utils.adminQueryView.getQueryCounts.invalidate();
      },
      onError: (error) => {
        message.error(`Failed to update support request: ${error.message}`);
      },
    });

  const handleRespond = (record: SupportRequest) => {
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleSave = async (values: SupportRequest) => {
    const updatePayload: QueryResponseInput & { id: string } = {
      id: values.id,
      status: values.status,
      response: values.response,
    };

    updateMutation.mutate(updatePayload);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleStatusFilter = (value: Status | undefined) => {
    setStatus(value);
    setPage(1);
  };

  // Prepare status options with counts
  const statusOptions = [
    { label: `New (${queryCounts?.supportRequests ?? 0})`, value: Status.NEW },
    { label: "In Progress", value: Status.IN_PROGRESS },
    { label: "Resolved", value: Status.RESOLVED },
    { label: "Cancelled", value: Status.CANCELLED },
  ];

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
              options={statusOptions}
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
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={updateMutation.isPending}
            >
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
