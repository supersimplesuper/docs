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
    [
      "script",
      { type: "text/javascript" },
      `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});`,
    ],
    [
      "script",
      { type: "text/javascript" },
      `window.Beacon('init', 'd6bc29d3-697b-4a5a-bac2-a1f4f2dd9b94');`,
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
      {
        text: "API Spec (Swagger)",
        link: "https://api.superapi.com.au/swaggerui",
      },
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
