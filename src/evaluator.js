const SEVERITY = { FAIL: 'FAIL', WARN: 'WARN', PASS: 'PASS' };

export function parseCSP(raw) {
  const directives = {};
  const parts = raw.replace(/^Content-Security-Policy(-Report-Only)?:\s*/i, '').split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    const name = tokens[0].toLowerCase();
    const values = tokens.slice(1);
    if (!directives[name]) {
      directives[name] = { values, duplicate: false };
    } else {
      directives[name].duplicate = true;
      directives[name].values.push(...values);
    }
  }
  return directives;
}

export function evaluateCSP(raw) {
  const findings = [];
  const trimmed = raw.trim();

  if (!trimmed) {
    findings.push({ severity: SEVERITY.FAIL, message: 'CSP is empty.' });
    return findings;
  }

  const directives = parseCSP(trimmed);

  // Syntax: empty directive (name with no values)
  for (const [name, data] of Object.entries(directives)) {
    if (data.values.length === 0) {
      findings.push({
        severity: SEVERITY.WARN,
        message: `Directive "${name}" has no values.`,
      });
    }
  }

  // Syntax: check for entries that don't look like valid directive names
  for (const name of Object.keys(directives)) {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
      findings.push({
        severity: SEVERITY.FAIL,
        message: `"${name}" does not look like a valid directive name.`,
      });
    }
  }

  // Duplicate directives
  for (const [name, data] of Object.entries(directives)) {
    if (data.duplicate) {
      findings.push({
        severity: SEVERITY.WARN,
        message: `Duplicate directive "${name}" found. Only the first occurrence is used by browsers.`,
      });
    }
  }

  // unsafe-eval in script-src
  const scriptSrc = directives['script-src'];
  if (scriptSrc && scriptSrc.values.includes("'unsafe-eval'")) {
    findings.push({
      severity: SEVERITY.FAIL,
      message: `"script-src" contains 'unsafe-eval'. This allows arbitrary code execution via eval().`,
    });
  }

  // unsafe-inline in script-src
  if (scriptSrc && scriptSrc.values.includes("'unsafe-inline'")) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `"script-src" contains 'unsafe-inline'. This weakens XSS protection. Consider using nonces or hashes instead.`,
    });
  }

  // unsafe-inline in style-src
  const styleSrc = directives['style-src'];
  if (styleSrc && styleSrc.values.includes("'unsafe-inline'")) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `"style-src" contains 'unsafe-inline'. Consider using nonces or hashes for styles.`,
    });
  }

  // Wildcard in default-src
  const defaultSrc = directives['default-src'];
  if (defaultSrc && defaultSrc.values.includes('*')) {
    findings.push({
      severity: SEVERITY.FAIL,
      message: `"default-src" contains wildcard '*'. This effectively disables CSP for all resource types not explicitly set.`,
    });
  }

  // Wildcard in script-src
  if (scriptSrc && scriptSrc.values.includes('*')) {
    findings.push({
      severity: SEVERITY.FAIL,
      message: `"script-src" contains wildcard '*'. This allows scripts from any origin.`,
    });
  }

  // Missing recommended directives
  if (!directives['object-src']) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `Missing "object-src". Recommended: object-src 'none' to block plugin content (Flash, Java).`,
    });
  } else if (!directives['object-src'].values.includes("'none'")) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `"object-src" is not set to 'none'. Consider restricting plugin content.`,
    });
  }

  if (!directives['base-uri']) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `Missing "base-uri". Recommended: base-uri 'self' to prevent base tag injection.`,
    });
  }

  if (!directives['frame-ancestors']) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `Missing "frame-ancestors". Recommended to prevent clickjacking (e.g., frame-ancestors 'none' or 'self').`,
    });
  }

  if (!directives['default-src'] && !directives['script-src']) {
    findings.push({
      severity: SEVERITY.WARN,
      message: `Neither "default-src" nor "script-src" is defined. Scripts will not be restricted.`,
    });
  }

  // If no issues, add a PASS
  if (findings.length === 0) {
    findings.push({
      severity: SEVERITY.PASS,
      message: 'No issues detected. Your CSP looks good!',
    });
  }

  // Sort: FAIL first, WARN second, PASS last
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return findings;
}
