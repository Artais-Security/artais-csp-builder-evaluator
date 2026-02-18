# CSP Builder + Evaluator

A lightweight, client-side web app to **build** and **lint/evaluate** Content Security Policies (CSP).

- ✅ Build a CSP with presets + directive inputs
- ✅ Paste a CSP and get **PASS/WARN/FAIL** findings
- ✅ Copy-ready `Content-Security-Policy` and `...-Report-Only` headers
- ✅ No backend required (safe for GitHub Pages)

> CSP is powerful but easy to misconfigure. This app gives fast feedback and helps generate a sensible baseline.

---

## Features

### Builder
- Choose from presets:
  - Strict (recommended baseline)
  - SPA + analytics
  - Report-Only starter
- Add/edit common directives:
  - `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `font-src`
  - `frame-ancestors`, `base-uri`, `object-src`
- Export headers:
  - `Content-Security-Policy: ...`
  - `Content-Security-Policy-Report-Only: ...`

### Evaluator (Lint)
Flags common issues:
- `unsafe-eval` in `script-src` (**FAIL**)
- wildcard `*` in `default-src`/`script-src` (**FAIL/WARN**)
- `unsafe-inline` in `script-src`/`style-src` (**WARN**)
- missing recommended directives:
  - `object-src 'none'`, `base-uri 'self'`, `frame-ancestors ...`
- duplicate directives (**WARN**)
- basic syntax problems (empty directive, missing directive name, etc.)

---

## Quick Start

### Requirements
- Node.js 18+ recommended

### Install
```bash
npm install
