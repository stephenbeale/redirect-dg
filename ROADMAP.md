# Roadmap

## Completed

- [x] Core redirect engine with wildcard URL pattern matching
- [x] 30 default redirect rules across search, video, email, maps, social, messaging, docs, and more
- [x] Two redirect modes: instant redirect and interstitial warning page
- [x] Payment/billing URL exclusions (never redirected)
- [x] Session bypass via "Continue anyway" on interstitial pages
- [x] Toolbar popup with global enable/disable toggle
- [x] Options page with full rule management (add, edit, delete, toggle per-rule)
- [x] Reset to defaults functionality
- [x] Search query preservation (e.g. `q` param carried to DuckDuckGo)
- [x] URL path preservation (Reddit, Medium paths carried to alternatives)
- [x] Dark-themed UI across popup, options, and interstitial pages

## v1.1 — Enhanced Interstitials

- [ ] Multiple alternative links per interstitial (e.g. FreeTube + Invidious + Piped as separate buttons)
- [ ] "Don't show again for this site" option on interstitials (persistent bypass per domain)
- [ ] Countdown timer option before "Continue anyway" becomes clickable
- [ ] Redirect counter badge on the extension icon showing how many redirects happened today

## v1.2 — Import / Export & Sync

- [ ] Export rules as JSON file
- [ ] Import rules from JSON file
- [ ] Share rule sets via URL (base64-encoded config)
- [ ] Community rule packs (curated sets users can one-click import)

## v1.3 — Smarter Matching

- [ ] Regex support for from-patterns (power users)
- [ ] Path-aware redirects for maps (carry lat/lng coordinates to OpenStreetMap)
- [ ] Search query translation between engines (e.g. Bing operators to DuckDuckGo syntax)
- [ ] Redirect chain detection and loop prevention
- [ ] Subdomain wildcard improvements (e.g. `*.medium.com` vs custom Medium domains)

## v1.4 — Statistics & Insights

- [ ] Dashboard showing redirect statistics (per rule, per day/week/month)
- [ ] Most-blocked domains chart
- [ ] Time saved estimate (tongue-in-cheek metric)
- [ ] Export stats as CSV

## v1.5 — Cross-Browser & Distribution

- [ ] Firefox add-on port (Manifest V2/V3 compatibility)
- [ ] Edge Add-ons store listing
- [ ] Chrome Web Store submission
- [ ] Safari Web Extension port (stretch goal)

## v2.0 — Advanced Features

- [ ] Scheduled rules (e.g. block social media during work hours)
- [ ] Allowlist mode (only redirect when on specific sites)
- [ ] Per-profile rules (different rule sets for work vs personal browsing)
- [ ] Keyboard shortcut to temporarily pause/resume redirects
- [ ] Context menu integration ("Open this link in privacy alternative")

## Ideas / Maybe Later

- [ ] Companion mobile app or Kiwi Browser support
- [ ] Auto-detect new big-tech acquisitions and suggest rules
- [ ] AI-powered alternative suggestions based on the page content
- [ ] Collaborative blocklist maintained by the community
- [ ] Integration with other privacy tools (uBlock Origin, Privacy Badger)

---

## Separate Product Idea — Ethical Browse (not part of Redirect DG)

A standalone extension (or companion product) focused on **ethical consumption** rather than just privacy. Where Redirect DG is about who tracks you, this would be about who deserves your attention and money.

**Core concept:** Flag websites and businesses with poor ethical reputations — tax avoidance, labour practices, environmental record, greenwashing, monopolistic behaviour — and surface better alternatives where they exist.

**Possible features:**
- Ethical rating badge injected onto product pages, search results, and brand websites
- Ratings sourced from third-party indices (e.g. Good On You, Ethical Consumer, B Corp, Open Secrets)
- "Better alternatives" suggestions for unethical brands (e.g. visit an independent retailer instead of a fast-fashion giant)
- User-contributed flags with sourced evidence
- Category filters: environment / labour / tax / data / political donations
- Works on shopping sites, news outlets, and company homepages

**Why separate:** Redirect DG's scope is privacy-focused redirects. Ethical ratings are a broader, more subjective domain requiring a different data model, moderation approach, and likely a backend service for ratings data.
