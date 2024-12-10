"use client";

import { App } from "antd";
import { type ReactNode } from "react";

export function AntMessageProvider({ children }: { children: ReactNode }) {
  return <App>{children}</App>;
}
