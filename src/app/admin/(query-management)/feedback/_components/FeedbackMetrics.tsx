// FeedbackMetrics.tsx
import React from "react";
import { Card, Col, Row, Statistic } from "antd";

interface FeedbackMetricsProps {
  feedbackData: Array<{
    satisfaction: number;
    usability: number;
    recommendation: boolean;
  }>;
}

const FeedbackMetrics: React.FC<FeedbackMetricsProps> = ({ feedbackData }) => {
  // Calculate metrics
  const avgSatisfaction =
    feedbackData.reduce((acc, item) => acc + item.satisfaction, 0) /
    feedbackData.length;
  const avgUsability =
    feedbackData.reduce((acc, item) => acc + item.usability, 0) /
    feedbackData.length;
  const recommendationPercentage =
    (feedbackData.filter((item) => item.recommendation).length /
      feedbackData.length) *
    100;

  const cardStyle = {
    border: "1px solid #d9d9d9",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <Statistic
            title="Average Satisfaction"
            value={`${avgSatisfaction.toFixed(1)}/5`}
            valueStyle={{ fontSize: 28 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <Statistic
            title="Average Usability"
            value={`${avgUsability.toFixed(1)}/5`}
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
