"use client";

import { ConfigProvider } from "antd";
import { type ReactNode } from "react";
import themeConfig from "~/theme/themeConfig";

export function AntThemeProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
