import React, { useState } from 'react';
import { Card, Radio, Spin } from 'antd';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps 
} from 'recharts';
import { api } from "~/trpc/react";
import { format } from 'date-fns';

type ChartType = 'line' | 'bar' | 'area';

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  'Total Members': number;
  'Active Queries': number;
  'Total Posts': number;
  'Active Issues': number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-white p-4 border rounded shadow">
      <p className="font-medium">{label}</p>
      {payload.map((pld) => (
        <div key={pld.name} className="flex justify-between gap-4">
          <span style={{ color: pld.color }}>{pld.name}:</span>
          <span className="font-medium">{pld.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardCharts() {
  const [chartType, setChartType] = useState<ChartType>('line');
  
  const { data: dailyStats, isLoading } = api.adminStats.getDailyStats.useQuery({
    days: 7
  });

  const chartColors: Record<keyof Omit<ChartDataPoint, 'date' | 'formattedDate'>, string> = {
    'Total Members': '#8884d8',
    'Active Queries': '#82ca9d',
    'Total Posts': '#ffc658',
    'Active Issues': '#ff7300'
  };

  const chartData: ChartDataPoint[] = dailyStats?.map(stat => ({
    date: stat.date,
    formattedDate: format(new Date(stat.date), 'MMM dd'),
    'Total Members': stat.newMembers,
    'Active Queries': stat.openQueries,
    'Total Posts': stat.newPosts,
    'Active Issues': stat.technicalIssues
  })) ?? [];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(Object.entries(chartColors) as [keyof typeof chartColors, string][]).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(Object.entries(chartColors) as [keyof typeof chartColors, string][]).map(([key, color]) => (
              <Bar key={key} dataKey={key} fill={color} />
            ))}
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(Object.entries(chartColors) as [keyof typeof chartColors, string][]).map(([key, color]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                dot={false}
              />
            ))}
          </AreaChart>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8 mb-8 flex items-center justify-center h-96">
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <Card className="mt-8 mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Cumulative Trends</h2>
        <Radio.Group value={chartType} onChange={e => setChartType(e.target.value as ChartType)}>
          <Radio.Button value="line">Line</Radio.Button>
          <Radio.Button value="bar">Bar</Radio.Button>
          <Radio.Button value="area">Area</Radio.Button>
        </Radio.Group>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}