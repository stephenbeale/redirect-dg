// Redirect DG — Interstitial Page Logic
// Reads URL params to display the appropriate warning and alternative,
// and handles the "Continue anyway" bypass flow.

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const originalUrl = params.get('originalUrl') || '';
  const message = params.get('message') || '';
  const alternativeUrl = params.get('alternativeUrl') || '';
  const alternativeName = params.get('alternativeName') || 'a privacy-friendly alternative';

  // Populate the warning message
  const messageEl = document.getElementById('warningMessage');
  if (message) {
    messageEl.textContent = message;
  }

  // Populate the alternative card
  const altCard = document.getElementById('alternativeCard');
  const altDesc = document.getElementById('alternativeDescription');
  const altLink = document.getElementById('alternativeLink');

  if (alternativeUrl) {
    altDesc.textContent = `Try ${alternativeName} — a privacy-respecting alternative.`;
    altLink.href = alternativeUrl;
    altLink.textContent = `Visit ${alternativeName}`;
  } else {
    altCard.style.display = 'none';
  }

  // "Continue anyway" button — sends bypass message to background service worker
  const continueBtn = document.getElementById('continueBtn');
  continueBtn.addEventListener('click', () => {
    if (!originalUrl) {
      // No URL to continue to; go back instead
      history.back();
      return;
    }

    chrome.runtime.sendMessage(
      { type: 'bypass', url: originalUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Redirect DG: bypass message failed', chrome.runtime.lastError);
          // Fallback: try navigating directly
          window.location.href = originalUrl;
        }
        // Navigation is handled by the background script
      }
    );
  });

  // "Go back" button
  const goBackBtn = document.getElementById('goBackBtn');
  goBackBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      history.back();
    } else {
      // If no history, go to DuckDuckGo as a safe default
      window.location.href = 'https://duckduckgo.com/';
    }
  });
})();
