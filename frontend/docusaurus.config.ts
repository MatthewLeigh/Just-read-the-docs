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
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },

                blog: {
                    showReadingTime: true,
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
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

        colorMode: {
            defaultMode: 'dark',
            respectPrefersColorScheme: false
        },

        navbar: {
            title: "Just Read The Docs",

            logo: {
                alt: "Just read the docs Logo",
                src: "img/logo.svg",
            },

            items: [
                {
                    type: "docSidebar",
                    sidebarId: "languagesSidebar",
                    position: "left",
                    label: "Languages",
                },
                {
                    type: "docSidebar",
                    sidebarId: "toolsSidebar",
                    position: "left",
                    label: "Tools",
                },
                {
                    type: "docSidebar",
                    sidebarId: "conventionsSidebar",
                    position: "left",
                    label: "Conventions",
                },
                {
                    type: "docSidebar",
                    sidebarId: "conceptsSidebar",
                    position: "left",
                    label: "Concepts",
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
