"use client";

import { api } from "~/trpc/react";

export default function AdminPage() {
  const { data, error } = api.admin.getAdminData.useQuery();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>{data.message}</p>
      <p>Timestamp: {data.timestamp.toString()}</p>
    </div>
  );
} 