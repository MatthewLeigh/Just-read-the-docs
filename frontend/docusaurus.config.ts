import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "Just Read The Docs",
    tagline: "Because remembering things is overrated.",
    favicon: "img/favicon.ico",
    url: "https://matthewleigh.github.io",
    baseUrl: "/just-read-the-docs/",
    organizationName: "MatthewLeigh",
    projectName: "just-read-the-docs",

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                },

                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    onInlineTags: "warn",
                    onInlineAuthors: "warn",
                    onUntruncatedBlogPosts: "warn",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                }

            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: "img/docusaurus-social-card.jpg",

        navbar: {
            title: "Just Read The Docs",

            logo: {
                alt: "Just read the docs Logo",
                src: "img/logo.svg",
            },

            items: [
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Docs",
                },
                {
                    to: "/blog",
                    label: "Guides",
                    position: "left"
                },
                {
                    href: "https://github.com/MatthewLeigh/just-read-the-docs",
                    label: "GitHub",
                    position: "right",
                },
            ]
        },

        footer: {
            style: "dark",

            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Tutorial",
                            to: "/docs/intro",
                        }
                    ]
                },

                {
                    title: "Community"
                },

                {
                title: "More",
                    items: [
                        {
                            label: "Blog",
                            to: "/blog",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/facebook/docusaurus",
                        }
                    ]
                }
            ],

            copyright: `Copyright © ${new Date().getFullYear()} Matthew Cross. Built with Docusaurus.`,
        },

        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },

    } satisfies Preset.ThemeConfig,
};

export default config;
