// app/(public)/(post)/posts/page.tsx
import { Suspense } from "react";
import BrowsePosts from "./_components/BrowsePosts";
import { Spin } from "antd";

export default function PostsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <BrowsePosts />
    </Suspense>
  );
}