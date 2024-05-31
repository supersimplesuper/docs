import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
  appearance: 'force-dark',
  title: "Docs",
  titleTemplate: "SuperAPI: The embedded future of super",
  description:
    "SuperAPI docs for HR software partners and super funds to begin working with embedded super.",
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    ["script", { defer: '', "data-domain": "docs.superapi.com.au", src: "https://plausible.io/js/script.js" }]
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
      { text: "Software partners", link: "/software_partners/index.html" }
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
      { icon: 'github', link: 'https://github.com/supersimplesuper/' },
      { icon: 'x', link: 'https://twitter.com/superapidev' },
      { icon: 'linkedin', link: 'https://au.linkedin.com/company/superapi-com-au' }
    ]
  },
});