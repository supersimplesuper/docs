// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import "./custom.css";

// export default DefaultTheme;

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Custom app enhancements go here
  },
};
