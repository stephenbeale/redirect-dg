# Redirect DG

A Chrome extension (Manifest V3) that redirects users away from big-tech platforms to privacy-friendly alternatives. All rules are configurable — disable any you don't want, add your own, or tweak the defaults.

## Features

- **30 default redirect rules** covering search, video, email, maps, social media, messaging, and more
- **Two redirect modes**: instant redirect or interstitial warning page with "Continue anyway" option
- **Payment-safe**: billing, checkout, and payment pages are never redirected
- **Fully configurable**: add, edit, delete, and toggle rules from the options page
- **Quick toggle**: enable/disable all redirects from the toolbar popup
- **Path & query preservation**: search queries and URL paths carry over to alternatives
- **Session bypass**: clicking "Continue anyway" on an interstitial grants a one-time pass

## Default Redirect Rules

### Direct Redirects

| Category | From | To | Notes |
|----------|------|----|-------|
| Search | Major search engine (all country variants) | [DuckDuckGo](https://duckduckgo.com) | Preserves search query |
| Search | Bing | [DuckDuckGo](https://duckduckgo.com) | Preserves search query |
| Maps | Maps service | [OpenStreetMap](https://www.openstreetmap.org) | |
| Translation | Translation service | [DeepL](https://www.deepl.com/translator) | |
| News | News aggregator | [Ground News](https://ground.news) | |
| Video conferencing | Meet service | [Jitsi Meet](https://meet.jit.si) | |
| Social | Reddit (www) | [Old Reddit](https://old.reddit.com) | Preserves path |
| Articles | Medium | [Scribe](https://scribe.rip) | Preserves path |

### Interstitial Pages (warning + alternative suggestion)

| Category | From | Suggested Alternative |
|----------|------|-----------------------|
| Video | Video platform | [FreeTube](https://freetubeapp.io) / [Invidious](https://invidious.io) / [Piped](https://piped.video) |
| Email | Webmail service | [ProtonMail](https://protonmail.com) |
| Email | Outlook / Hotmail | [ProtonMail](https://protonmail.com) |
| Cloud Storage | Drive service | [Proton Drive](https://proton.me/drive) |
| Calendar | Calendar service | [Proton Calendar](https://calendar.proton.me) |
| Documents | Docs/Sheets suite | [CryptPad](https://cryptpad.fr) |
| Photos | Photo storage | [Ente](https://ente.io) |
| Notes | Notes app | [Standard Notes](https://standardnotes.com) |
| Social | Twitter / X | [Bluesky](https://bsky.app) |
| Messaging | WhatsApp Web | [Signal](https://signal.org) |

### Payment Exclusions (never redirected)

- Payment, wallet, and checkout subdomains
- Any URL path containing `/payment`, `/checkout`, `/billing`, `/purchase`, or `/order`

## Installation

### From source (developer mode)

1. Clone this repo or download as ZIP
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `redirect-dg` folder
6. The shield icon appears in your toolbar

### From Chrome Web Store

Coming soon.

## Usage

- **Toolbar popup**: Click the extension icon to toggle all redirects on/off
- **Options page**: Right-click the icon > Options, or go to `chrome://extensions` > Redirect DG > Details > Extension options
- **Add custom rules**: Use the options page to add your own from/to URL redirect pairs
- **Interstitials**: When shown a warning page, click the alternative link to try it, or "Continue anyway" to proceed to the original site (one-time bypass per session)

## Architecture

| File | Purpose |
|------|---------|
| `manifest.json` | Manifest V3 config, permissions, host permissions |
| `background.js` | Service worker — intercepts navigation, matches rules, performs redirects |
| `popup.html/js/css` | Toolbar popup — quick enable/disable toggle |
| `options.html/js/css` | Full settings page — rule management, payment exclusions display |
| `interstitial.html/js/css` | Privacy warning page shown for interstitial-type rules |
| `icons/` | Extension icons (16, 48, 128px) |

## Privacy

This extension:
- Stores settings in `chrome.storage.sync` (synced across your browsers if signed into Chrome)
- Does **not** collect, transmit, or log any browsing data
- Does **not** phone home or make any external network requests
- Runs entirely locally in your browser

## Licence

MIT
