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
    message: 'This site tracks your activity. Consider using FreeTube instead — a privacy-friendly desktop alternative.',
    alternativeUrl: 'https://freetubeapp.io',
    alternativeName: 'FreeTube',
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
    message: 'This email service scans your messages for targeted advertising. Consider switching to ProtonMail for end-to-end encrypted email.',
    alternativeUrl: 'https://protonmail.com',
    alternativeName: 'ProtonMail',
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
    message: 'This cloud storage service accesses your files for data profiling. Consider switching to Proton Drive for private, encrypted storage.',
    alternativeUrl: 'https://proton.me/drive',
    alternativeName: 'Proton Drive',
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
  const specificPrefixes = ['maps.', 'mail.', 'translate.', 'drive.', 'play.'];
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

  return targetUrl;
}

/**
 * Builds the interstitial URL with encoded parameters.
 */
function buildInterstitialUrl(originalUrl, rule) {
  const params = new URLSearchParams({
    originalUrl: originalUrl,
    message: rule.message || '',
    alternativeUrl: rule.alternativeUrl || '',
    alternativeName: rule.alternativeName || ''
  });
  return chrome.runtime.getURL('interstitial.html') + '?' + params.toString();
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

  // Execute the rule
  if (rule.action === 'redirect') {
    const redirectUrl = buildRedirectUrl(url, rule);
    try {
      await chrome.tabs.update(tabId, { url: redirectUrl });
    } catch (err) {
      console.error('Redirect DG: failed to redirect tab', err);
    }
  } else if (rule.action === 'interstitial') {
    const interstitialUrl = buildInterstitialUrl(url, rule);
    try {
      await chrome.tabs.update(tabId, { url: interstitialUrl });
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

  if (message.type === 'getStatus') {
    chrome.storage.sync.get(['enabled'], (result) => {
      sendResponse({ enabled: result.enabled !== false });
    });
    return true; // async response
  }

  if (message.type === 'setStatus') {
    chrome.storage.sync.set({ enabled: message.enabled }, () => {
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
});
