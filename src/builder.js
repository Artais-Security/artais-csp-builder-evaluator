import { DIRECTIVES } from './presets.js';

export function buildCSP(directiveMap) {
  const parts = [];
  for (const dir of DIRECTIVES) {
    const value = (directiveMap[dir] || '').trim();
    if (value) {
      parts.push(`${dir} ${value}`);
    }
  }
  return parts.join('; ');
}

export function formatEnforceHeader(csp) {
  return `Content-Security-Policy: ${csp}`;
}

export function formatReportOnlyHeader(csp) {
  return `Content-Security-Policy-Report-Only: ${csp}`;
}
