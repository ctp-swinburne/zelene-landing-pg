// src/theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#EA0828",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    // Complementary shades of red
    colorPrimaryBg: "#FFF1F3",
    colorPrimaryBgHover: "#FFE4E7",
    colorPrimaryBorder: "#FFB2BB",
    colorPrimaryBorderHover: "#FF8A97",
    colorPrimaryHover: "#FF1F3E",
    colorPrimaryActive: "#D10722",
    colorPrimaryTextHover: "#FF1F3E",
    colorPrimaryText: "#EA0828",
    colorPrimaryTextActive: "#D10722",
    // Border radius
    borderRadius: 4,
    // Other customizations
    colorLink: "#EA0828",
    colorLinkHover: "#FF1F3E",
    colorLinkActive: "#D10722",
  },
  components: {
    Button: {
      colorPrimary: "#EA0828",
      algorithm: true, // Enable algorithm for derived colors
    },
    Menu: {
      colorItemBgSelected: "#FFF1F3",
      colorItemTextSelected: "#EA0828",
    },
  },
};

export default themeConfig;
