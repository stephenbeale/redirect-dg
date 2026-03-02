// Redirect DG — Interstitial Page Logic
// Reads URL params to display the appropriate warning and alternatives,
// and handles the "Continue anyway" bypass flow.

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const originalUrl = params.get('originalUrl') || '';
  const message = params.get('message') || '';

  // Parse alternatives (new array format or legacy single)
  let alternatives = [];
  const altJson = params.get('alternatives');
  if (altJson) {
    try {
      alternatives = JSON.parse(altJson);
    } catch {
      alternatives = [];
    }
  }

  // Populate the warning message
  const messageEl = document.getElementById('warningMessage');
  if (message) {
    messageEl.textContent = message;
  }

  // Populate alternatives
  const altSection = document.getElementById('alternativesSection');
  const altGrid = document.getElementById('alternativesGrid');

  if (alternatives.length > 0) {
    alternatives.forEach((alt) => {
      const card = document.createElement('a');
      card.href = alt.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'alt-card';

      const name = document.createElement('span');
      name.className = 'alt-name';
      name.textContent = alt.name;

      const desc = document.createElement('span');
      desc.className = 'alt-desc';
      desc.textContent = alt.desc || '';

      const arrow = document.createElement('span');
      arrow.className = 'alt-arrow';
      arrow.textContent = '\u2192';

      card.appendChild(name);
      if (alt.desc) card.appendChild(desc);
      card.appendChild(arrow);
      altGrid.appendChild(card);
    });
  } else {
    altSection.style.display = 'none';
  }

  // "Continue anyway" button — sends bypass message to background service worker
  const continueBtn = document.getElementById('continueBtn');
  continueBtn.addEventListener('click', () => {
    if (!originalUrl) {
      history.back();
      return;
    }

    chrome.runtime.sendMessage(
      { type: 'bypass', url: originalUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Redirect DG: bypass message failed', chrome.runtime.lastError);
          window.location.href = originalUrl;
        }
      }
    );
  });

  // "Go back" button
  const goBackBtn = document.getElementById('goBackBtn');
  goBackBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      history.back();
    } else {
      window.location.href = 'https://duckduckgo.com/';
    }
  });
})();
