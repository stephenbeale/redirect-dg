// Redirect DG — Background Service Worker
// Intercepts navigation to big-tech platforms and redirects to privacy-friendly alternatives.

// ─── Default Redirect Rules ────────────────────────────────────────────────────

const DEFAULT_RULES = [
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
    id: 'search-de',
    label: 'Search (.de)',
    fromPattern: '*://*.google.de/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'search-fr',
    label: 'Search (.fr)',
    fromPattern: '*://*.google.fr/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'search-es',
    label: 'Search (.es)',
    fromPattern: '*://*.google.es/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'search-it',
    label: 'Search (.it)',
    fromPattern: '*://*.google.it/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'search-au',
    label: 'Search (.com.au)',
    fromPattern: '*://*.google.com.au/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'search-ca',
    label: 'Search (.ca)',
    fromPattern: '*://*.google.ca/*',
    action: 'redirect',
    toUrl: 'https://duckduckgo.com/',
    preserveQuery: 'q',
    enabled: true
  },
  {
    id: 'video',
    label: 'Video platform',
    fromPattern: '*://*.youtube.com/*',
    action: 'interstitial',
    message: 'This site tracks your activity extensively. Consider one of these privacy-friendly alternatives.',
    alternatives: [
      { name: 'FreeTube', url: 'https://freetubeapp.io', desc: 'Desktop app — no ads, no tracking' },
      { name: 'Invidious', url: 'https://invidious.io', desc: 'Web frontend — no account needed' },
      { name: 'Piped', url: 'https://piped.video', desc: 'Web frontend — lightweight and fast' }
    ],
    enabled: true
  },
  {
    id: 'maps',
    label: 'Maps',
    fromPattern: '*://maps.google.com/*',
    action: 'redirect',
    toUrl: 'https://www.openstreetmap.org/',
    enabled: true
  },
  {
    id: 'maps-path',
    label: 'Maps (path-based)',
    fromPattern: '*://*.google.com/maps*',
    action: 'redirect',
    toUrl: 'https://www.openstreetmap.org/',
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
    id: 'translate',
    label: 'Translation',
    fromPattern: '*://translate.google.com/*',
    action: 'redirect',
    toUrl: 'https://www.deepl.com/translator',
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
    id: 'news',
    label: 'News aggregator',
    fromPattern: '*://news.google.com/*',
    action: 'redirect',
    toUrl: 'https://ground.news/',
    enabled: true
  },
  {
    id: 'meet',
    label: 'Video conferencing',
    fromPattern: '*://meet.google.com/*',
    action: 'redirect',
    toUrl: 'https://meet.jit.si/',
    enabled: true
  },
  {
    id: 'calendar',
    label: 'Calendar',
    fromPattern: '*://calendar.google.com/*',
    action: 'interstitial',
    message: 'This calendar service links your schedule to a data profile. Consider a private alternative.',
    alternatives: [
      { name: 'Proton Calendar', url: 'https://calendar.proton.me', desc: 'Encrypted calendar by Proton' },
      { name: 'Tuta Calendar', url: 'https://tuta.com/calendar', desc: 'Built into Tuta encrypted email' }
    ],
    enabled: true
  },
  {
    id: 'docs',
    label: 'Documents',
    fromPattern: '*://docs.google.com/*',
    action: 'interstitial',
    message: 'This productivity suite scans your documents for profiling. Consider a private alternative.',
    alternatives: [
      { name: 'CryptPad', url: 'https://cryptpad.fr', desc: 'Encrypted collaborative editing' },
      { name: 'OnlyOffice', url: 'https://www.onlyoffice.com', desc: 'Self-hostable office suite' }
    ],
    enabled: true
  },
  {
    id: 'photos',
    label: 'Photos',
    fromPattern: '*://photos.google.com/*',
    action: 'interstitial',
    message: 'This photo service uses facial recognition and scans your images. Consider a private alternative.',
    alternatives: [
      { name: 'Ente', url: 'https://ente.io', desc: 'Encrypted photo storage and sharing' },
      { name: 'Immich', url: 'https://immich.app', desc: 'Self-hosted photo management' }
    ],
    enabled: true
  },
  {
    id: 'keep',
    label: 'Notes',
    fromPattern: '*://keep.google.com/*',
    action: 'interstitial',
    message: 'This notes app syncs your data for profiling. Consider an encrypted alternative.',
    alternatives: [
      { name: 'Standard Notes', url: 'https://standardnotes.com', desc: 'End-to-end encrypted notes' },
      { name: 'Joplin', url: 'https://joplinapp.org', desc: 'Open-source note-taking app' },
      { name: 'Notesnook', url: 'https://notesnook.com', desc: 'Private, zero-knowledge notes' }
    ],
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
  },
  {
    id: 'email-outlook',
    label: 'Email (Outlook)',
    fromPattern: '*://*.outlook.com/*',
    action: 'interstitial',
    message: 'This email service scans your messages for targeted advertising. Consider an encrypted alternative.',
    alternatives: [
      { name: 'ProtonMail', url: 'https://protonmail.com', desc: 'End-to-end encrypted, Swiss privacy' },
      { name: 'Tuta', url: 'https://tuta.com', desc: 'Encrypted email, based in Germany' }
    ],
    enabled: true
  },
  {
    id: 'email-outlook-live',
    label: 'Email (Outlook Live)',
    fromPattern: '*://*.outlook.live.com/*',
    action: 'interstitial',
    message: 'This email service scans your messages for targeted advertising. Consider an encrypted alternative.',
    alternatives: [
      { name: 'ProtonMail', url: 'https://protonmail.com', desc: 'End-to-end encrypted, Swiss privacy' },
      { name: 'Tuta', url: 'https://tuta.com', desc: 'Encrypted email, based in Germany' }
    ],
    enabled: true
  },
  {
    id: 'email-hotmail',
    label: 'Email (Hotmail)',
    fromPattern: '*://*.hotmail.com/*',
    action: 'interstitial',
    message: 'This email service scans your messages for targeted advertising. Consider an encrypted alternative.',
    alternatives: [
      { name: 'ProtonMail', url: 'https://protonmail.com', desc: 'End-to-end encrypted, Swiss privacy' },
      { name: 'Tuta', url: 'https://tuta.com', desc: 'Encrypted email, based in Germany' }
    ],
    enabled: true
  }
];

// ─── Payment Exclusion Patterns ────────────────────────────────────────────────
// These domains and path fragments must NEVER be redirected.

const PAYMENT_EXCLUSION_HOSTS = [
  'pay.google.com',
  'payments.google.com',
  'wallet.google.com',
  'checkout.google.com'
];

const PAYMENT_EXCLUSION_HOST_PATHS = [
  { host: 'play.google.com', pathPrefix: '/store/account' }
];

const PAYMENT_EXCLUSION_PATH_FRAGMENTS = [
  '/payment',
  '/checkout',
  '/billing',
  '/purchase',
  '/order'
];

// ─── Session Bypass (in-memory, resets on service worker restart) ───────────────

const sessionBypass = new Set();

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Checks if a URL is a payment/billing URL that must never be redirected.
 */
function isPaymentExcluded(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  const hostname = parsed.hostname;
  const pathname = parsed.pathname.toLowerCase();

  // Check excluded hosts
  if (PAYMENT_EXCLUSION_HOSTS.includes(hostname)) {
    return true;
  }

  // Check host + path prefix exclusions
  for (const entry of PAYMENT_EXCLUSION_HOST_PATHS) {
    if (hostname === entry.host && pathname.startsWith(entry.pathPrefix)) {
      return true;
    }
  }

  // Check path fragment exclusions
  for (const fragment of PAYMENT_EXCLUSION_PATH_FRAGMENTS) {
    if (pathname.includes(fragment)) {
      return true;
    }
  }

  return false;
}

/**
 * Converts a simple wildcard pattern (like *://*.example.com/*) into a regex.
 * Supports * as a wildcard for any characters.
 */
function patternToRegex(pattern) {
  // Escape regex special chars, then convert * wildcards to .*
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp('^' + escaped + '$', 'i');
}

/**
 * Tests whether a URL matches a given wildcard pattern.
 */
function urlMatchesPattern(url, pattern) {
  // Match the full URL against the wildcard pattern
  // This handles both domain-level and path-based patterns
  const regex = patternToRegex(pattern);
  return regex.test(url);
}

/**
 * Finds the first matching rule for a URL from the given rules array.
 * More specific rules (maps, mail, translate, drive, youtube) are checked
 * before the catch-all search rules.
 */
function findMatchingRule(url, rules) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const hostname = parsed.hostname;

  // Sort rules so that more specific hostname matches come first.
  // Subdomains like maps., mail., translate., drive. and youtube.com
  // should be checked before the generic catch-all domain rules.
  const specificPrefixes = ['maps.', 'mail.', 'translate.', 'drive.', 'play.', 'news.', 'meet.', 'calendar.', 'docs.', 'photos.', 'keep.'];
  const isSpecificHost = (h) =>
    specificPrefixes.some(p => h.startsWith(p)) ||
    h.includes('youtube.com');

  // Check specific rules first
  for (const rule of rules) {
    if (!rule.enabled) continue;

    // Determine if this rule targets a specific subdomain
    const ruleIsSpecific = specificPrefixes.some(p => rule.fromPattern.includes('://' + p)) ||
      rule.fromPattern.includes('youtube.com') ||
      rule.fromPattern.includes('/maps');

    if (ruleIsSpecific && urlMatchesPattern(url, rule.fromPattern)) {
      return rule;
    }
  }

  // Then check generic (search) rules, but only if the actual hostname
  // is NOT one of the specific subdomains
  if (!isSpecificHost(hostname)) {
    for (const rule of rules) {
      if (!rule.enabled) continue;
      const ruleIsSpecific = specificPrefixes.some(p => rule.fromPattern.includes('://' + p)) ||
        rule.fromPattern.includes('youtube.com') ||
        rule.fromPattern.includes('/maps');

      if (!ruleIsSpecific && urlMatchesPattern(url, rule.fromPattern)) {
        return rule;
      }
    }
  }

  return null;
}

/**
 * Builds the redirect URL for a direct-redirect rule, preserving query params if configured.
 */
function buildRedirectUrl(originalUrl, rule) {
  let targetUrl = rule.toUrl;

  if (rule.preserveQuery) {
    try {
      const parsed = new URL(originalUrl);
      const queryValue = parsed.searchParams.get(rule.preserveQuery);
      if (queryValue) {
        const target = new URL(targetUrl);
        target.searchParams.set(rule.preserveQuery, queryValue);
        targetUrl = target.toString();
      }
    } catch {
      // Fall through to plain redirect
    }
  }

  if (rule.preservePath) {
    try {
      const parsed = new URL(originalUrl);
      const target = new URL(targetUrl);
      target.pathname = parsed.pathname;
      target.search = parsed.search;
      targetUrl = target.toString();
    } catch {
      // Fall through to plain redirect
    }
  }

  return targetUrl;
}

/**
 * Builds the interstitial URL with encoded parameters.
 */
function buildInterstitialUrl(originalUrl, rule) {
  const params = new URLSearchParams({
    originalUrl: originalUrl,
    message: rule.message || ''
  });

  // Support new alternatives array and legacy single alternative
  if (rule.alternatives && rule.alternatives.length > 0) {
    params.set('alternatives', JSON.stringify(rule.alternatives));
  } else if (rule.alternativeUrl) {
    params.set('alternatives', JSON.stringify([
      { name: rule.alternativeName || 'Alternative', url: rule.alternativeUrl, desc: '' }
    ]));
  }

  return chrome.runtime.getURL('interstitial.html') + '?' + params.toString();
}

// ─── Redirect Counter ──────────────────────────────────────────────────────────

/**
 * Returns today's date key for the redirect counter (YYYY-MM-DD).
 */
function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `redirectCount_${y}-${m}-${d}`;
}

/**
 * Increments today's redirect count and updates the badge.
 */
async function incrementRedirectCount() {
  const key = getTodayKey();
  const result = await chrome.storage.local.get([key]);
  const count = (result[key] || 0) + 1;
  await chrome.storage.local.set({ [key]: count });
  updateBadge(count);
}

/**
 * Updates the extension icon badge with the given count.
 */
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#e94560' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Loads today's count and sets the badge on startup.
 */
async function initBadge() {
  const settings = await chrome.storage.sync.get(['enabled']);
  if (settings.enabled === false) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }
  const key = getTodayKey();
  const result = await chrome.storage.local.get([key]);
  const count = result[key] || 0;
  updateBadge(count);
}

// ─── Permanent Bypass ──────────────────────────────────────────────────────────

/**
 * Checks if a domain has a permanent bypass set.
 */
async function isPermanentlyBypassed(hostname) {
  const result = await chrome.storage.sync.get(['permanentBypasses']);
  const bypasses = result.permanentBypasses || [];
  return bypasses.includes(hostname);
}

// ─── Installation: Set Default Rules ───────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      rules: DEFAULT_RULES,
      enabled: true
    }, () => {
      console.log('Redirect DG: default rules installed.');
    });
  }
});

// ─── Service Worker Startup ────────────────────────────────────────────────────

initBadge();

// ─── Navigation Interception ───────────────────────────────────────────────────

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only handle top-level frame navigations
  if (details.frameId !== 0) return;

  const url = details.url;
  const tabId = details.tabId;

  // Skip chrome:// and extension:// URLs
  if (url.startsWith('chrome') || url.startsWith('about:') || url.startsWith('edge:')) return;

  // Skip our own interstitial page
  if (url.startsWith(chrome.runtime.getURL(''))) return;

  // Check payment exclusions FIRST — never redirect these
  if (isPaymentExcluded(url)) return;

  // Check session bypass
  if (sessionBypass.has(url)) {
    // Remove from bypass after use (one-time bypass)
    sessionBypass.delete(url);
    return;
  }

  // Load settings
  let settings;
  try {
    settings = await chrome.storage.sync.get(['rules', 'enabled']);
  } catch (err) {
    console.error('Redirect DG: failed to read settings', err);
    return;
  }

  // Check if extension is globally enabled
  if (settings.enabled === false) return;

  const rules = settings.rules || DEFAULT_RULES;

  // Find matching rule
  const rule = findMatchingRule(url, rules);
  if (!rule) return;

  // Check permanent bypass for interstitial rules
  if (rule.action === 'interstitial') {
    try {
      const hostname = new URL(url).hostname;
      if (await isPermanentlyBypassed(hostname)) return;
    } catch {
      // Ignore parse errors
    }
  }

  // Execute the rule
  if (rule.action === 'redirect') {
    const redirectUrl = buildRedirectUrl(url, rule);
    try {
      await chrome.tabs.update(tabId, { url: redirectUrl });
      await incrementRedirectCount();
    } catch (err) {
      console.error('Redirect DG: failed to redirect tab', err);
    }
  } else if (rule.action === 'interstitial') {
    const interstitialUrl = buildInterstitialUrl(url, rule);
    try {
      await chrome.tabs.update(tabId, { url: interstitialUrl });
      await incrementRedirectCount();
    } catch (err) {
      console.error('Redirect DG: failed to show interstitial', err);
    }
  }
});

// ─── Message Handling (for interstitial "Continue anyway" and popup) ───────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'bypass') {
    // Add URL to session bypass set and navigate
    const originalUrl = message.url;
    if (originalUrl) {
      sessionBypass.add(originalUrl);
      if (sender.tab && sender.tab.id) {
        chrome.tabs.update(sender.tab.id, { url: originalUrl });
      }
    }
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'bypassPermanent') {
    // Add domain to permanent bypass list
    const domain = message.domain;
    if (domain) {
      chrome.storage.sync.get(['permanentBypasses'], (result) => {
        const bypasses = result.permanentBypasses || [];
        if (!bypasses.includes(domain)) {
          bypasses.push(domain);
          chrome.storage.sync.set({ permanentBypasses: bypasses }, () => {
            sendResponse({ ok: true });
          });
        } else {
          sendResponse({ ok: true });
        }
      });
    } else {
      sendResponse({ ok: false });
    }
    return true;
  }

  if (message.type === 'getStatus') {
    chrome.storage.sync.get(['enabled'], (result) => {
      sendResponse({ enabled: result.enabled !== false });
    });
    return true; // async response
  }

  if (message.type === 'setStatus') {
    chrome.storage.sync.set({ enabled: message.enabled }, () => {
      // Clear or restore badge when toggling
      if (message.enabled) {
        initBadge();
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === 'getRules') {
    chrome.storage.sync.get(['rules'], (result) => {
      sendResponse({ rules: result.rules || DEFAULT_RULES });
    });
    return true;
  }

  if (message.type === 'setRules') {
    chrome.storage.sync.set({ rules: message.rules }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === 'resetRules') {
    chrome.storage.sync.set({ rules: DEFAULT_RULES }, () => {
      sendResponse({ rules: DEFAULT_RULES });
    });
    return true;
  }

  if (message.type === 'getDefaults') {
    sendResponse({ rules: DEFAULT_RULES });
    return true;
  }

  if (message.type === 'getPaymentExclusions') {
    sendResponse({
      hosts: PAYMENT_EXCLUSION_HOSTS,
      hostPaths: PAYMENT_EXCLUSION_HOST_PATHS,
      pathFragments: PAYMENT_EXCLUSION_PATH_FRAGMENTS
    });
    return true;
  }

  if (message.type === 'getRedirectCount') {
    const key = getTodayKey();
    chrome.storage.local.get([key], (result) => {
      sendResponse({ count: result[key] || 0 });
    });
    return true;
  }

  if (message.type === 'getPermanentBypasses') {
    chrome.storage.sync.get(['permanentBypasses'], (result) => {
      sendResponse({ bypasses: result.permanentBypasses || [] });
    });
    return true;
  }

  if (message.type === 'removePermanentBypass') {
    const domain = message.domain;
    chrome.storage.sync.get(['permanentBypasses'], (result) => {
      const bypasses = (result.permanentBypasses || []).filter(d => d !== domain);
      chrome.storage.sync.set({ permanentBypasses: bypasses }, () => {
        sendResponse({ ok: true, bypasses });
      });
    });
    return true;
  }
});
