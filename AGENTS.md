# AGENTS.md - AI Development Guidelines

This repository hosts a browser-based, client-side **Security Advisory Generator** that creates standardized vulnerability advisories in Markdown format.

When assisting with code modifications, feature additions, or refactoring, AI agents **MUST** follow the instructions and rules outlined in this document.

---

## 1. Core Principles & Philosophy

- **Zero Third-Party Dependencies:** Written in plain Vanilla JavaScript, standard HTML5, and CSS. Do NOT introduce external frameworks (e.g., React, Vue), build tools, or CDN dependencies unless explicitly requested.
- **Strict Privacy & Client-Side Execution:** All user inputs and score calculations MUST take place entirely within the user's browser memory. Never send data to external servers.
- **Static Hosting:** The project is deployed via **GitHub Pages**. No backend service or database exists.

---

## 2. Strict Security Rules

1. **NO `innerHTML` Allowed (DOM XSS Prevention):**
   - **`innerHTML` is strictly forbidden.** Always use `textContent`, `innerText`, or DOM methods (`document.createElement`, `setAttribute`, `appendChild`) to insert user-controlled data or strings into the DOM.
2. **Strict CSP Adherence:**
   - Keep Content Security Policy (CSP) headers tight (`default-src 'self'`). Do not use `eval()` or dynamically inject inline scripts.

---

## 3. Project Structure & File Roles

- `index.html`: Base UI layout, input forms, modal/details tags, and CSP meta definitions.
- `style.css`: Stylesheet supporting responsive design and light/dark mode themes (`prefers-color-scheme`).
- `cvss.js`: CVSS v3.1 metric definitions and official scoring algorithm (`window.CVSS`).
- `presets.js`: Preset templates, CWE options, and threat descriptions (`window.PRESETS`, `window.CWES`).
- `app.js`: Event listeners, dynamic Markdown generation logic, real-time validation (linter), and clipboard/download actions.

---

## 4. Context & Japanese Vulnerability Disclosure Standards

This tool is designed to support both global standards and local Japanese security disclosure guidelines:
- **CVSS v3.1:** First.org Common Vulnerability Scoring System.
- **CWE:** Common Weakness Enumeration mappings.
- **IPA / JVN / JPCERT/CC (Local Context):**
  - **IPA:** Information-technology Promotion Agency, Japan / Innovation Platform Agency, Japan (From 2026) (Government agency overseeing software security).
  - **JVN:** Japan Vulnerability Notes (Japanese vulnerability advisories portal).
  - **JPCERT/CC:** Japan Computer Emergency Response Team Coordination Center (acting as a CNA/coordinator).
  *Note: Preset phrases and linter checks follow common Japanese vulnerability disclosure formats (e.g., advisories coordinated via JVN/IPA).*

---

## 5. Instructions for AI Code Modifications

- **Respect Specifications:** Do NOT alter the mathematical formulas in `cvss.js` or the official CWE mapping logic without explicit instructions.
- **Surgical Edits:** When adding or modifying code, target the specific script (`app.js`, `cvss.js`, etc.) without breaking existing event handling or CSS variables.
- **Preserve Responsive Layout:** Ensure two-column desktop layouts properly collapse into single-column views on narrower screens (`@media (max-width: 860px)`).
