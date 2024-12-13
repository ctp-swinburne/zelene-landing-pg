// src/theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    // Primary Colors
    colorPrimary: "#0bdc84", // Vibrant Green - Primary brand color
    colorBgContainer: "#ffffff", // White - Container backgrounds
    colorBgElevated: "#ffffff", // White - Elevated components

    // Color Variations
    colorPrimaryBg: "#d6e4e9", // Pale Blue-Gray - Subtle backgrounds
    colorPrimaryBgHover: "#89f0c3", // Light Mint - Hover states
    colorPrimaryBorder: "#88b2b8", // Muted Blue-Gray - Borders
    colorPrimaryBorderHover: "#89f0c3", // Light Mint - Border hover
    colorPrimaryHover: "#04bd6c", // Medium Green - Hover state
    colorPrimaryActive: "#039555", // Deep Green - Active state
    colorPrimaryTextHover: "#04bd6c", // Medium Green - Text hover
    colorPrimaryText: "#0bdc84", // Vibrant Green - Primary text
    colorPrimaryTextActive: "#039555", // Deep Green - Active text

    // Border Radius
    borderRadius: 6, // Slightly larger for modern feel

    // Link Colors
    colorLink: "#04bd6c", // Medium Green - Links
    colorLinkHover: "#0bdc84", // Vibrant Green - Link hover
    colorLinkActive: "#039555", // Deep Green - Link active

    // Success State Colors (complementing the green theme)
    colorSuccess: "#0bdc84", // Vibrant Green
    colorSuccessBg: "#89f0c3", // Light Mint
    colorSuccessBorder: "#04bd6c", // Medium Green

    // Other Colors
    colorText: "#2c3e50", // Dark gray for main text
    colorTextSecondary: "#88b2b8", // Muted Blue-Gray for secondary text
    colorBgLayout: "#d6e4e9", // Pale Blue-Gray for layout backgrounds
  },
  components: {
    Button: {
      colorPrimary: "#0bdc84",
      algorithm: true, // Enable algorithm for derived colors
    },
    Menu: {
      colorItemBgSelected: "#d6e4e9",
      colorItemTextSelected: "#04bd6c",
      colorItemBgHover: "#e8f0f2",
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorBorderSecondary: "#88b2b8",
    },
    Table: {
      colorBgContainer: "#ffffff",
      colorFillAlter: "#f7fafc",
      colorBorderSecondary: "#d6e4e9",
    },
    Layout: {
      colorBgHeader: "#ffffff",
      colorBgBody: "#d6e4e9",
      colorBgTrigger: "#88b2b8",
    },
    Input: {
      colorBorder: "#88b2b8",
      colorPrimaryHover: "#04bd6c",
    },
    Select: {
      colorBorder: "#88b2b8",
      colorPrimaryHover: "#04bd6c",
      colorBgContainer: "#ffffff",
    },
    Tabs: {
      colorBgContainer: "#ffffff",
      colorPrimary: "#04bd6c",
    },
  },
};

export default themeConfig;
