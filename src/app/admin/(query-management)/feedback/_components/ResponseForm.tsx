// admin/feedback/_components/ResponseForm.tsx
"use client";

import React from "react";
import { Form, Input, Select, Button, message } from "antd";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { QueryResponseSchema } from "~/schema/admin-query-mutations";
import type { z } from "zod";

type FeedbackData = RouterOutputs["adminQueryView"]["getFeedback"];
type FeedbackItem = FeedbackData["items"][0];
type FormValues = z.infer<typeof QueryResponseSchema>;

interface ResponseFormProps {
  feedback: FeedbackItem;
  onSuccess?: () => void;
}

const { TextArea } = Input;

export default function ResponseForm({
  feedback,
  onSuccess,
}: ResponseFormProps) {
  const [form] = Form.useForm<FormValues>();
  const utils = api.useUtils();

  const { mutate: updateFeedback, isPending } =
    api.adminQueryMutations.updateFeedback.useMutation({
      onSuccess: () => {
        message.success("Response updated successfully");
        void utils.adminQueryView.getFeedback.invalidate();
        void utils.adminQueryView.getQueryCounts.invalidate();
        onSuccess?.();
      },
      onError: (error) => {
        message.error(error.message);
      },
    });

  const handleSubmit = (values: FormValues) => {
    updateFeedback({
      id: feedback.id,
      ...values,
    });
  };

  React.useEffect(() => {
    form.setFieldsValue({
      response: feedback.response,
      status: feedback.status,
    });
  }, [feedback, form]);

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        response: feedback.response,
        status: feedback.status,
      }}
    >
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select>
          {(
            Object.keys(QueryResponseSchema.shape.status.enum) as Array<
              FormValues["status"]
            >
          ).map((status) => (
            <Select.Option key={status} value={status}>
              {status.replace("_", " ")}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="response"
        label="Response"
        rules={[{ required: true, message: "Please enter a response" }]}
      >
        <TextArea rows={4} placeholder="Enter your response..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Update Response
        </Button>
      </Form.Item>
    </Form>
  );
}
