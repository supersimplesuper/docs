import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
  appearance: "force-dark",
  title: "Docs",
  titleTemplate: "SuperAPI: The embedded future of super",
  description:
    "SuperAPI docs for HR software partners and super funds to begin working with embedded super.",
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    [
      "script",
      {
        defer: "",
        "data-domain": "docs.superapi.com.au",
        src: "https://plausible.io/js/script.js",
      },
    ],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-0VSQ045BFG",
      },
    ],
    [
      "script",
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-0VSQ045BFG');",
    ],
  ],
  themeConfig: {
    logo: {
      light: "/logo.svg",
      dark: "/logo-white-pink.svg",
      alt: "SuperAPI Logo",
    },
    footer: {
      message: "The future of super is embedded",
      copyright: "Copyright © 2024 SuperAPI Pty Ltd (ACN: 674 661 244)",
    },
    nav: [
      { text: "Hiring", link: "/hiring/index.html" },
      { text: "Software partners", link: "/software_partners/index.html" },
      { text: "Security", link: "/security/index.html" },
      { text: "API Spec (Swagger)", link: "https://api.superapi.com.au/swaggerui"}
    ],

    /*
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    */

    socialLinks: [
      { icon: "github", link: "https://github.com/supersimplesuper/" },
      { icon: "x", link: "https://twitter.com/superapidev" },
      {
        icon: "linkedin",
        link: "https://au.linkedin.com/company/superapi-com-au",
      },
    ],
  },
});
