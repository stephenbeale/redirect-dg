// Redirect DG — Options Page Logic
// Manages redirect rules, payment exclusion display, and global toggle.

(function () {
  'use strict';

  // ─── DOM References ──────────────────────────────────────────────

  const globalToggle = document.getElementById('globalToggle');
  const globalStatusText = document.getElementById('globalStatusText');
  const rulesBody = document.getElementById('rulesBody');
  const addRuleBtn = document.getElementById('addRuleBtn');
  const resetBtn = document.getElementById('resetBtn');
  const saveBtn = document.getElementById('saveBtn');
  const saveStatus = document.getElementById('saveStatus');
  const exclusionsList = document.getElementById('exclusionsList');

  // Modal elements
  const ruleModal = document.getElementById('ruleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const modalSave = document.getElementById('modalSave');
  const modalError = document.getElementById('modalError');

  const ruleLabelInput = document.getElementById('ruleLabel');
  const ruleFromInput = document.getElementById('ruleFrom');
  const ruleActionSelect = document.getElementById('ruleAction');
  const ruleToUrlInput = document.getElementById('ruleToUrl');
  const rulePreserveQueryInput = document.getElementById('rulePreserveQuery');
  const ruleMessageInput = document.getElementById('ruleMessage');
  const ruleAltUrlInput = document.getElementById('ruleAltUrl');
  const ruleAltNameInput = document.getElementById('ruleAltName');

  const redirectFields = document.getElementById('redirectFields');
  const interstitialFields = document.getElementById('interstitialFields');

  // ─── State ───────────────────────────────────────────────────────

  let currentRules = [];
  let editingIndex = -1; // -1 means adding new, >= 0 means editing

  // ─── Initialization ──────────────────────────────────────────────

  loadSettings();
  loadPaymentExclusions();

  // ─── Global Toggle ───────────────────────────────────────────────

  function updateGlobalToggleUI(enabled) {
    globalToggle.checked = enabled;
    globalStatusText.textContent = enabled
      ? 'All redirect rules are currently active.'
      : 'All redirect rules are currently paused.';
  }

  globalToggle.addEventListener('change', () => {
    const enabled = globalToggle.checked;
    updateGlobalToggleUI(enabled);
    chrome.runtime.sendMessage({ type: 'setStatus', enabled });
  });

  // ─── Load Settings ──────────────────────────────────────────────

  function loadSettings() {
    chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        updateGlobalToggleUI(true);
      } else {
        updateGlobalToggleUI(response.enabled);
      }
    });

    chrome.runtime.sendMessage({ type: 'getRules' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to load rules:', chrome.runtime.lastError);
        return;
      }
      currentRules = response.rules || [];
      renderRulesTable();
    });
  }

  // ─── Render Rules Table ──────────────────────────────────────────

  function renderRulesTable() {
    rulesBody.innerHTML = '';

    currentRules.forEach((rule, index) => {
      const tr = document.createElement('tr');

      // Enabled toggle
      const tdEnabled = document.createElement('td');
      const toggleLabel = document.createElement('label');
      toggleLabel.className = 'toggle-switch toggle-small';
      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.checked = rule.enabled;
      toggleInput.addEventListener('change', () => {
        currentRules[index].enabled = toggleInput.checked;
      });
      const toggleSlider = document.createElement('span');
      toggleSlider.className = 'toggle-slider';
      toggleLabel.appendChild(toggleInput);
      toggleLabel.appendChild(toggleSlider);
      tdEnabled.appendChild(toggleLabel);
      tr.appendChild(tdEnabled);

      // Label
      const tdLabel = document.createElement('td');
      tdLabel.textContent = rule.label || rule.id || '—';
      tr.appendChild(tdLabel);

      // From pattern
      const tdFrom = document.createElement('td');
      tdFrom.className = 'cell-from';
      tdFrom.textContent = rule.fromPattern;
      tr.appendChild(tdFrom);

      // Action
      const tdAction = document.createElement('td');
      tdAction.className = 'cell-action';
      const badge = document.createElement('span');
      badge.className = 'action-badge ' + rule.action;
      badge.textContent = rule.action;
      tdAction.appendChild(badge);
      tr.appendChild(tdAction);

      // To / message
      const tdTo = document.createElement('td');
      tdTo.className = 'cell-to';
      if (rule.action === 'redirect') {
        tdTo.textContent = rule.toUrl || '—';
      } else {
        tdTo.textContent = rule.alternativeName
          ? `Interstitial → ${rule.alternativeName}`
          : 'Interstitial warning';
      }
      tr.appendChild(tdTo);

      // Delete button
      const tdDelete = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-icon';
      deleteBtn.title = 'Delete rule';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete rule "${rule.label || rule.id}"?`)) {
          currentRules.splice(index, 1);
          renderRulesTable();
        }
      });
      tdDelete.appendChild(deleteBtn);
      tr.appendChild(tdDelete);

      // Double-click row to edit
      tr.addEventListener('dblclick', () => {
        openEditModal(index);
      });
      tr.style.cursor = 'pointer';
      tr.title = 'Double-click to edit';

      rulesBody.appendChild(tr);
    });
  }

  // ─── Save Rules ──────────────────────────────────────────────────

  saveBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'setRules', rules: currentRules }, (response) => {
      if (chrome.runtime.lastError) {
        showSaveStatus('Failed to save.', 'error');
        return;
      }
      showSaveStatus('Saved successfully.', 'success');
    });
  });

  function showSaveStatus(text, type) {
    saveStatus.textContent = text;
    saveStatus.className = 'save-status ' + type;
    setTimeout(() => {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 3000);
  }

  // ─── Reset to Defaults ──────────────────────────────────────────

  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset all rules to defaults? Custom rules will be lost.')) return;

    chrome.runtime.sendMessage({ type: 'resetRules' }, (response) => {
      if (chrome.runtime.lastError) {
        showSaveStatus('Reset failed.', 'error');
        return;
      }
      currentRules = response.rules;
      renderRulesTable();
      showSaveStatus('Reset to defaults.', 'success');
    });
  });

  // ─── Modal: Add / Edit Rule ──────────────────────────────────────

  function openAddModal() {
    editingIndex = -1;
    modalTitle.textContent = 'Add New Rule';
    modalSave.textContent = 'Add Rule';
    clearModalForm();
    showModal();
  }

  function openEditModal(index) {
    editingIndex = index;
    const rule = currentRules[index];
    modalTitle.textContent = 'Edit Rule';
    modalSave.textContent = 'Save Changes';

    ruleLabelInput.value = rule.label || '';
    ruleFromInput.value = rule.fromPattern || '';
    ruleActionSelect.value = rule.action || 'redirect';
    updateActionFields();

    if (rule.action === 'redirect') {
      ruleToUrlInput.value = rule.toUrl || '';
      rulePreserveQueryInput.value = rule.preserveQuery || '';
    } else {
      ruleMessageInput.value = rule.message || '';
      ruleAltUrlInput.value = rule.alternativeUrl || '';
      ruleAltNameInput.value = rule.alternativeName || '';
    }

    showModal();
  }

  function clearModalForm() {
    ruleLabelInput.value = '';
    ruleFromInput.value = '';
    ruleActionSelect.value = 'redirect';
    ruleToUrlInput.value = '';
    rulePreserveQueryInput.value = '';
    ruleMessageInput.value = '';
    ruleAltUrlInput.value = '';
    ruleAltNameInput.value = '';
    modalError.hidden = true;
    updateActionFields();
  }

  function showModal() {
    ruleModal.hidden = false;
    ruleLabelInput.focus();
  }

  function hideModal() {
    ruleModal.hidden = true;
  }

  function updateActionFields() {
    const action = ruleActionSelect.value;
    if (action === 'redirect') {
      redirectFields.hidden = false;
      interstitialFields.hidden = true;
    } else {
      redirectFields.hidden = true;
      interstitialFields.hidden = false;
    }
  }

  ruleActionSelect.addEventListener('change', updateActionFields);

  function validateModal() {
    const fromPattern = ruleFromInput.value.trim();
    const action = ruleActionSelect.value;

    if (!fromPattern) {
      return 'From Pattern is required.';
    }

    // Basic pattern validation: should contain :// and at least one *
    if (!fromPattern.includes('://')) {
      return 'From Pattern must include a protocol (e.g., *://).';
    }

    if (action === 'redirect') {
      const toUrl = ruleToUrlInput.value.trim();
      if (!toUrl) {
        return 'Redirect To URL is required.';
      }
      try {
        new URL(toUrl);
      } catch {
        return 'Redirect To URL must be a valid URL.';
      }
    } else {
      const message = ruleMessageInput.value.trim();
      if (!message) {
        return 'Warning Message is required for interstitial rules.';
      }
    }

    return null; // valid
  }

  function saveModal() {
    const error = validateModal();
    if (error) {
      modalError.textContent = error;
      modalError.hidden = false;
      return;
    }
    modalError.hidden = true;

    const action = ruleActionSelect.value;
    const rule = {
      id: editingIndex >= 0 ? currentRules[editingIndex].id : 'custom-' + Date.now(),
      label: ruleLabelInput.value.trim() || 'Custom rule',
      fromPattern: ruleFromInput.value.trim(),
      action: action,
      enabled: editingIndex >= 0 ? currentRules[editingIndex].enabled : true
    };

    if (action === 'redirect') {
      rule.toUrl = ruleToUrlInput.value.trim();
      const pq = rulePreserveQueryInput.value.trim();
      if (pq) rule.preserveQuery = pq;
    } else {
      rule.message = ruleMessageInput.value.trim();
      const altUrl = ruleAltUrlInput.value.trim();
      const altName = ruleAltNameInput.value.trim();
      if (altUrl) rule.alternativeUrl = altUrl;
      if (altName) rule.alternativeName = altName;
    }

    if (editingIndex >= 0) {
      currentRules[editingIndex] = rule;
    } else {
      currentRules.push(rule);
    }

    renderRulesTable();
    hideModal();
  }

  addRuleBtn.addEventListener('click', openAddModal);
  modalClose.addEventListener('click', hideModal);
  modalCancel.addEventListener('click', hideModal);
  modalSave.addEventListener('click', saveModal);

  // Close modal on overlay click
  ruleModal.addEventListener('click', (e) => {
    if (e.target === ruleModal) hideModal();
  });

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !ruleModal.hidden) hideModal();
  });

  // ─── Payment Exclusions ──────────────────────────────────────────

  function loadPaymentExclusions() {
    chrome.runtime.sendMessage({ type: 'getPaymentExclusions' }, (response) => {
      if (chrome.runtime.lastError || !response) return;

      let html = '';

      // Host exclusions
      if (response.hosts && response.hosts.length > 0) {
        html += '<div class="exclusion-group">';
        html += '<h3>Excluded Domains</h3>';
        response.hosts.forEach(host => {
          html += `<span class="exclusion-item">${escapeHtml(host)}</span>`;
        });
        html += '</div>';
      }

      // Host + path exclusions
      if (response.hostPaths && response.hostPaths.length > 0) {
        html += '<div class="exclusion-group">';
        html += '<h3>Excluded Domain + Path Combinations</h3>';
        response.hostPaths.forEach(entry => {
          html += `<span class="exclusion-item">${escapeHtml(entry.host + entry.pathPrefix)}*</span>`;
        });
        html += '</div>';
      }

      // Path fragment exclusions
      if (response.pathFragments && response.pathFragments.length > 0) {
        html += '<div class="exclusion-group">';
        html += '<h3>Excluded Path Fragments (any domain)</h3>';
        response.pathFragments.forEach(frag => {
          html += `<span class="exclusion-item">Any URL containing "${escapeHtml(frag)}" in its path</span>`;
        });
        html += '</div>';
      }

      exclusionsList.innerHTML = html;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
