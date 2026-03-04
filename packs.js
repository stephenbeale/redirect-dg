// Redirect DG — Community Rule Packs
// Curated sets of redirect rules users can one-click import.

const COMMUNITY_PACKS = [
  {
    id: 'privacy-essentials',
    name: 'Privacy Essentials',
    description: 'Core privacy redirects: search to DuckDuckGo, email to ProtonMail, and cloud storage to encrypted alternatives. A lightweight starting point for minimalists.',
    rules: [
      {
        id: 'search-main',
        label: 'Search (main)',
        fromPattern: '*://*.google.com/*',
        action: 'redirect',
        toUrl: 'https://duckduckgo.com/',
        preserveQuery: 'q',
        enabled: true
      },
      {
        id: 'search-uk',
        label: 'Search (.co.uk)',
        fromPattern: '*://*.google.co.uk/*',
        action: 'redirect',
        toUrl: 'https://duckduckgo.com/',
        preserveQuery: 'q',
        enabled: true
      },
      {
        id: 'search-bing',
        label: 'Search (Bing)',
        fromPattern: '*://*.bing.com/*',
        action: 'redirect',
        toUrl: 'https://duckduckgo.com/',
        preserveQuery: 'q',
        enabled: true
      },
      {
        id: 'email',
        label: 'Email',
        fromPattern: '*://mail.google.com/*',
        action: 'interstitial',
        message: 'This email service scans your messages for targeted advertising. Consider an encrypted alternative.',
        alternatives: [
          { name: 'ProtonMail', url: 'https://protonmail.com', desc: 'End-to-end encrypted, Swiss privacy' },
          { name: 'Tuta', url: 'https://tuta.com', desc: 'Encrypted email, based in Germany' }
        ],
        enabled: true
      },
      {
        id: 'cloud-storage',
        label: 'Cloud Storage',
        fromPattern: '*://drive.google.com/*',
        action: 'interstitial',
        message: 'This cloud storage service accesses your files for data profiling. Consider an encrypted alternative.',
        alternatives: [
          { name: 'Proton Drive', url: 'https://proton.me/drive', desc: 'Encrypted cloud storage by Proton' },
          { name: 'Filen', url: 'https://filen.io', desc: 'Zero-knowledge encrypted storage' }
        ],
        enabled: true
      },
      {
        id: 'translate',
        label: 'Translation',
        fromPattern: '*://translate.google.com/*',
        action: 'redirect',
        toUrl: 'https://www.deepl.com/translator',
        enabled: true
      }
    ]
  },
  {
    id: 'social-media-detox',
    name: 'Social Media Detox',
    description: 'Redirects for social media and messaging platforms: Twitter/X to Bluesky, Reddit to old.reddit, Medium to Scribe, and WhatsApp to Signal.',
    rules: [
      {
        id: 'social-twitter',
        label: 'Social (Twitter)',
        fromPattern: '*://*.twitter.com/*',
        action: 'interstitial',
        message: 'This platform heavily tracks your activity and manipulates your feed with algorithms. Consider a decentralized alternative.',
        alternatives: [
          { name: 'Bluesky', url: 'https://bsky.app', desc: 'Open, decentralized social network' },
          { name: 'Mastodon', url: 'https://joinmastodon.org', desc: 'Federated, community-owned social' }
        ],
        enabled: true
      },
      {
        id: 'social-x',
        label: 'Social (X)',
        fromPattern: '*://*.x.com/*',
        action: 'interstitial',
        message: 'This platform heavily tracks your activity and manipulates your feed with algorithms. Consider a decentralized alternative.',
        alternatives: [
          { name: 'Bluesky', url: 'https://bsky.app', desc: 'Open, decentralized social network' },
          { name: 'Mastodon', url: 'https://joinmastodon.org', desc: 'Federated, community-owned social' }
        ],
        enabled: true
      },
      {
        id: 'social-reddit',
        label: 'Social (Reddit)',
        fromPattern: '*://www.reddit.com/*',
        action: 'redirect',
        toUrl: 'https://old.reddit.com/',
        preservePath: true,
        enabled: true
      },
      {
        id: 'articles-medium',
        label: 'Articles (Medium)',
        fromPattern: '*://*.medium.com/*',
        action: 'redirect',
        toUrl: 'https://scribe.rip/',
        preservePath: true,
        enabled: true
      },
      {
        id: 'messaging-whatsapp',
        label: 'Messaging (WhatsApp)',
        fromPattern: '*://web.whatsapp.com/*',
        action: 'interstitial',
        message: 'This messaging service shares metadata with its parent company for advertising. Consider a truly private alternative.',
        alternatives: [
          { name: 'Signal', url: 'https://signal.org', desc: 'Truly private, encrypted messaging' },
          { name: 'Element', url: 'https://element.io', desc: 'Decentralized chat via Matrix protocol' }
        ],
        enabled: true
      }
    ]
  },
  {
    id: 'full-lockdown',
    name: 'Full Lockdown',
    description: 'Every default rule enabled: search, video, email, maps, translate, cloud storage, social media, messaging, docs, photos, notes, and more. Maximum privacy coverage.',
    rules: 'ALL_DEFAULTS'
  }
];
