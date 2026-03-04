// Redirect DG — Interstitial Page Logic
// Reads URL params to display the appropriate warning and alternatives,
// handles countdown timer, and manages bypass flows.

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const originalUrl = params.get('originalUrl') || '';
  const message = params.get('message') || '';
  const countdownDuration = parseInt(params.get('countdown'), 10) || 5;

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

  // ─── Countdown Timer ────────────────────────────────────────────────
  const continueBtn = document.getElementById('continueBtn');
  const permanentBypassCheckbox = document.getElementById('permanentBypass');
  let remaining = countdownDuration;

  function updateCountdownText() {
    if (remaining > 0) {
      continueBtn.textContent = `Continue anyway (${remaining}s)`;
      continueBtn.disabled = true;
    } else {
      continueBtn.textContent = 'Continue anyway';
      continueBtn.disabled = false;
    }
  }

  updateCountdownText();

  const countdownInterval = setInterval(() => {
    remaining--;
    updateCountdownText();
    if (remaining <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  // ─── "Continue anyway" — sends bypass message to background ─────────
  continueBtn.addEventListener('click', () => {
    if (!originalUrl) {
      history.back();
      return;
    }

    // If permanent bypass is checked, send that first
    if (permanentBypassCheckbox && permanentBypassCheckbox.checked) {
      try {
        const domain = new URL(originalUrl).hostname;
        chrome.runtime.sendMessage({ type: 'bypassPermanent', domain });
      } catch {
        // Ignore parse errors
      }
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
