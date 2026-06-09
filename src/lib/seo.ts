import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE, APP_THEME_COLOR } from "./brand";

export function appTitle(page?: string) {
  return page ? `${page} | ${APP_NAME}` : APP_NAME;
}

export function appHead(page?: string) {
  const title = appTitle(page);

  return {
    meta: [
      { title },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: APP_DESCRIPTION },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: APP_THEME_COLOR },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: APP_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: APP_DESCRIPTION },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

export function pageHead(page: string) {
  const title = appTitle(page);
  return {
    meta: [
      { title },
      { property: "og:title", content: title },
      { name: "twitter:title", content: title },
    ],
  };
}

export { APP_NAME, APP_TAGLINE, APP_DESCRIPTION };
