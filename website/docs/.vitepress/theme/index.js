// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "viewerjs/dist/viewer.min.css";
import { useRoute } from "vitepress";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    // Register global components, if you don't want to use it, you don't need to add it
    ctx.app.component("vImageViewer", vImageViewer);
    // ...
  },
  setup() {
    // Get route
    const route = useRoute();
    // Using
    imageViewer(route);
  },
};
