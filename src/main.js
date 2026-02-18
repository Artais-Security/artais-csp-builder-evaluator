import { DIRECTIVES, PRESETS } from './presets.js';
import { buildCSP, formatEnforceHeader, formatReportOnlyHeader } from './builder.js';
import { evaluateCSP } from './evaluator.js';

// --- Tabs ---
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tabContents.forEach((c) => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// --- Builder ---
const directiveInputs = document.getElementById('directive-inputs');
const presetSelect = document.getElementById('preset-select');
const outputEnforce = document.getElementById('output-enforce');
const outputReport = document.getElementById('output-report');

function createDirectiveInputs() {
  directiveInputs.innerHTML = '';
  for (const dir of DIRECTIVES) {
    const row = document.createElement('div');
    row.className = 'directive-row';

    const label = document.createElement('label');
    label.textContent = dir;
    label.setAttribute('for', `dir-${dir}`);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `dir-${dir}`;
    input.name = dir;
    input.placeholder = `e.g. 'self'`;
    input.addEventListener('input', () => {
      presetSelect.value = '';
      updateOutput();
    });

    row.appendChild(label);
    row.appendChild(input);
    directiveInputs.appendChild(row);
  }
}

function getDirectiveMap() {
  const map = {};
  for (const dir of DIRECTIVES) {
    const input = document.getElementById(`dir-${dir}`);
    if (input) map[dir] = input.value;
  }
  return map;
}

function setDirectiveMap(directives) {
  for (const dir of DIRECTIVES) {
    const input = document.getElementById(`dir-${dir}`);
    if (input) input.value = directives[dir] || '';
  }
}

function updateOutput() {
  const map = getDirectiveMap();
  const csp = buildCSP(map);
  outputEnforce.textContent = csp ? formatEnforceHeader(csp) : '';
  outputReport.textContent = csp ? formatReportOnlyHeader(csp) : '';
}

function applyPreset(key) {
  const preset = PRESETS[key];
  if (preset) {
    setDirectiveMap(preset.directives);
    updateOutput();
  }
}

presetSelect.addEventListener('change', () => {
  if (presetSelect.value) {
    applyPreset(presetSelect.value);
  }
});

// --- Copy buttons ---
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target || !target.textContent) return;
    navigator.clipboard.writeText(target.textContent).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    });
  });
});

// --- Evaluator ---
const evalInput = document.getElementById('eval-input');
const evalBtn = document.getElementById('eval-btn');
const evalResults = document.getElementById('eval-results');

evalBtn.addEventListener('click', () => {
  const raw = evalInput.value;
  const findings = evaluateCSP(raw);
  renderFindings(findings);
});

evalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    evalBtn.click();
  }
});

function renderFindings(findings) {
  evalResults.innerHTML = '';
  for (const f of findings) {
    const el = document.createElement('div');
    el.className = `finding ${f.severity.toLowerCase()}`;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = f.severity;

    const msg = document.createElement('span');
    msg.textContent = f.message;

    el.appendChild(badge);
    el.appendChild(msg);
    evalResults.appendChild(el);
  }
}

// --- Init ---
createDirectiveInputs();
applyPreset('strict');
