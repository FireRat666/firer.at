import { html } from "./scripts/lighterhtml.js";
import settings from "../settings.json";
import { SVGs } from "./social-svgs";

function renderSocial(platform) {
  // Check that this platform exists
  if (settings.social[platform.name]) {
    return html`
      <a
        aria-label="${settings.name} on ${platform.name}"
        href="${settings.social[platform.name]}"
        tabindex="-1"
        rel=${platform.rel}
        >${SVGs[platform.name]}</a
      >
    `;
  }
}

function renderEmail() {
  if (settings.social.email) {
    return html`
      <a
        aria-label="${settings.name} on email"
        href="mailto:${settings.social.email}"
        tabindex="-1"
        >${SVGs.email}</a
      >
    `;
  }
}

const socials = [
  { name: "youtube", altText: "YouTube" },
  { name: "glitch", altText: "Glitch" },
  { name: "arena", altText: "Arena" },
  { name: "bandcamp", altText: "Bandcamp" },
  { name: "cohost", altText: "Cohost" },
  { name: "devTo", altText: "DevTo" },
  { name: "facebook", altText: "Facebook" },
  { name: "github", altText: "GitHub" },
  { name: "gitlab", altText: "GitLab" },
  { name: "hasnode", altText: "Hasnode" },
  { name: "instagram", altText: "Instagram" },
  { name: "keybase", altText: "Keybase" },
  { name: "paypal", altText: "PayPal" }, 
  { name: "kofi", altText: "Ko-fi" },
  { name: "letterboxd", altText: "Letterboxd" },
  { name: "linkedin", altText: "LinkedIn" },
  { name: "mastodon", altText: "Mastodon", rel: "me" },
  { name: "medium", altText: "Medium" },
  { name: "patreon", altText: "Patreon" },
  { name: "pinboard", altText: "Pinboard" },
  { name: "pinterest", altText: "Pinterest" },
  { name: "podcast", altText: "Podcast" },
  { name: "onlyfans", altText: "OnlyFans" },
  { name: "spotify", altText: "Spotify" },
  { name: "soundcloud", altText: "SoundCloud" },
  { name: "stackOverflow", altText: "Stack Overflow" },
  { name: "substack", altText: "Substack" },
  { name: "tiktok", altText: "TikTok" },
  { name: "twitch", altText: "Twitch" },
  { name: "twitter", altText: "Twitter" },
  { name: "tumblr", altText: "Tumblr" }
];

export const renderSocialIcons = html.node`
    <div class="social-icons">
      ${socials.map((platform) => {
        return html.node`${renderSocial(platform)}`;
      })}
      ${renderEmail()}
    </div>
  `;
