
// (public)/(post)/new/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreatePostForm } from "./_components/CreatePostForm";

export default function CreatePostPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // or wherever you want to redirect
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return null; // or a loading state if you prefer
  }

  return <CreatePostForm />;
}
