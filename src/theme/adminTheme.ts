import type { ThemeConfig } from "antd";

// Light theme remains the same
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#C15B3B",
    colorSuccess: "#4CAF50",
    colorWarning: "#FFA726",
    colorError: "#EF5350",
    colorInfo: "#A89682",
    colorTextBase: "#433422",
    colorBgBase: "#F5F2EE",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FAF9F7",
    colorBgLayout: "#F5F2EE",
    colorBorder: "#E5E0DA",
    colorBorderSecondary: "#F0EBE6",
    colorText: "#433422",
    colorTextSecondary: "#725F4B",
    colorTextTertiary: "#A89682",
    colorTextQuaternary: "#D1CBC4",
    colorLink: "#C15B3B",
    colorLinkHover: "#D47559",
    colorLinkActive: "#A44832",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    motionDurationMid: "0.2s",
    motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow:
      "0 1px 3px 0 rgba(67, 52, 34, 0.1), 0 1px 2px 0 rgba(67, 52, 34, 0.06)",
    boxShadowSecondary:
      "0 4px 6px -1px rgba(67, 52, 34, 0.1), 0 2px 4px -1px rgba(67, 52, 34, 0.06)",
  },
  components: {
    Button: {
      algorithm: true,
      borderRadius: 6,
      controlHeight: 36,
    },
    Input: {
      algorithm: true,
      borderRadius: 6,
      controlHeight: 36,
    },
    Select: {
      algorithm: true,
      borderRadius: 6,
      controlHeight: 36,
    },
    Card: {
      algorithm: true,
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 12,
    },
    Layout: {
      headerBg: "#FFFFFF",
      siderBg: "#F5F2EE",
    },
  },
};

// Dark theme (matching Claude's UI more closely)
export const darkTheme: ThemeConfig = {
  token: {
    ...lightTheme.token,
    colorPrimary: "#C15B3B",
    colorBgBase: "#1F1F1F", // Main background
    colorBgContainer: "#2D2D2D", // Card backgrounds (like in Claude's UI)
    colorBgElevated: "#383838", // Elevated elements
    colorBgLayout: "#1F1F1F",
    colorFillContent: "#2D2D2D", // Content area background
    colorFillContentHover: "#383838",
    colorFillAlter: "#2D2D2D", // Alternative background
    colorBorder: "#383838",
    colorBorderSecondary: "#404040",
    colorText: "#FFFFFF", // Primary text - pure white for better contrast
    colorTextBase: "#FFFFFF",
    colorTextSecondary: "#E0E0E0", // Secondary text - light gray
    colorTextTertiary: "#BDBDBD", // Tertiary text
    colorTextQuaternary: "#9E9E9E", // Quaternary text
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    boxShadowSecondary:
      "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
  },
  components: {
    ...lightTheme.components,
    Layout: {
      headerBg: "#1F1F1F",
      siderBg: "#1F1F1F",
    },
    Card: {
      colorBgContainer: "#2D2D2D",
    },
    Alert: {
      colorErrorBg: "#3A2A2A", // Darker red for error alerts
      colorWarningBg: "#3A3020", // Darker yellow for warning alerts
      colorInfoBg: "#2D2D2D", // Standard dark for info alerts
      colorSuccessBg: "#2A3A2A", // Darker green for success alerts
    },
  },
};
