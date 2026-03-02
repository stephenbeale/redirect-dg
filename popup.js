// Redirect DG — Popup Logic
// Manages the enable/disable toggle and links to the options page.

(function () {
  'use strict';

  const toggle = document.getElementById('enableToggle');
  const statusLabel = document.getElementById('statusLabel');
  const statusDescription = document.getElementById('statusDescription');
  const openOptionsBtn = document.getElementById('openOptions');

  function updateUI(enabled) {
    toggle.checked = enabled;

    if (enabled) {
      statusLabel.textContent = 'Active';
      statusLabel.className = 'status-label active';
      statusDescription.textContent =
        'Redirecting big-tech platforms to privacy-friendly alternatives.';
    } else {
      statusLabel.textContent = 'Paused';
      statusLabel.className = 'status-label paused';
      statusDescription.textContent =
        'All redirects are currently disabled.';
    }
  }

  // Load current status on popup open
  chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Redirect DG: could not get status', chrome.runtime.lastError);
      updateUI(true); // Default to enabled
      return;
    }
    updateUI(response.enabled);
  });

  // Toggle handler
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    updateUI(enabled);

    chrome.runtime.sendMessage({ type: 'setStatus', enabled }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Redirect DG: could not set status', chrome.runtime.lastError);
      }
    });
  });

  // Open options page
  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });
})();
