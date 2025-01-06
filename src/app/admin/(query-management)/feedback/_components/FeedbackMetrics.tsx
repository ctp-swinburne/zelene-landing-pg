//admin/feedback/_components/FeedbackMetrics.tsx
"use client";

import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import type { RouterOutputs } from "~/trpc/react";

type FeedbackData = RouterOutputs["adminQueryView"]["getFeedback"];
type FeedbackItem = FeedbackData["items"][0];

interface FeedbackMetricsProps {
  feedbackData: FeedbackItem[];
}

const FeedbackMetrics: React.FC<FeedbackMetricsProps> = ({ feedbackData }) => {
  // Calculate metrics
  const avgSatisfaction =
    feedbackData.length > 0
      ? feedbackData.reduce((acc, item) => acc + item.satisfaction, 0) /
        feedbackData.length
      : 0;

  const avgUsability =
    feedbackData.length > 0
      ? feedbackData.reduce((acc, item) => acc + item.usability, 0) /
        feedbackData.length
      : 0;

  const recommendationPercentage =
    feedbackData.length > 0
      ? (feedbackData.filter((item) => item.recommendation).length /
          feedbackData.length) *
        100
      : 0;

  const cardStyle = {
    border: "1px solid #d9d9d9",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  return (
    <Row gutter={16} className="mb-6">
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <Statistic
            title="Average Satisfaction"
            value={avgSatisfaction}
            precision={1}
            suffix="/5"
            valueStyle={{ fontSize: 28 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <Statistic
            title="Average Usability"
            value={avgUsability}
            precision={1}
            suffix="/5"
            valueStyle={{ fontSize: 28 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <Statistic
            title="Likely to Recommend"
            value={recommendationPercentage}
            precision={0}
            suffix="%"
            valueStyle={{ fontSize: 28 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default FeedbackMetrics;
