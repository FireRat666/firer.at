import { html } from "../scripts/lighterhtml.js";
import settings from "../settings.json";

export const renderMeta = html.node`
  <title>${settings.metaTitle}</title>

  <!-- OpenGraph/Social sharing -->
  <meta name="description" content="${settings.metaDescription}" />
  <meta name="og:description" content="${settings.metaDescription}" />
  <meta property="og:image" content="${settings.avatarImage}" />
  <meta property="og:title" content="${settings.metaTitle}" />
  <meta name="twitter:card" content="summary" />
  <!-- Load our custom theme -->
  <link rel="stylesheet" type="text/css" href="/styles/themes/${settings.theme}.css" />
`;
