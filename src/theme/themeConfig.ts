// src/theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#2E7D32",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    // Complementary shades of green
    colorPrimaryBg: "#E8F5E9",
    colorPrimaryBgHover: "#C8E6C9",
    colorPrimaryBorder: "#A5D6A7",
    colorPrimaryBorderHover: "#81C784",
    colorPrimaryHover: "#388E3C",
    colorPrimaryActive: "#1B5E20",
    colorPrimaryTextHover: "#388E3C",
    colorPrimaryText: "#2E7D32",
    colorPrimaryTextActive: "#1B5E20",
    // Border radius
    borderRadius: 4,
    // Other customizations
    colorLink: "#2E7D32",
    colorLinkHover: "#388E3C",
    colorLinkActive: "#1B5E20",
  },
  components: {
    Button: {
      colorPrimary: "#2E7D32",
      algorithm: true, // Enable algorithm for derived colors
    },
    Menu: {
      colorItemBgSelected: "#E8F5E9",
      colorItemTextSelected: "#2E7D32",
    },
  },
};

export default themeConfig;
