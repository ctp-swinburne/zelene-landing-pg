"use client";

import { ConfigProvider } from "antd";
import { type ReactNode } from "react";
import themeConfig from "~/theme/themeConfig";

export function AntThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={themeConfig}>
      <div className="flex min-h-screen flex-col">{children}</div>
    </ConfigProvider>
  );
}
