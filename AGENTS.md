# AGENTS.md - AI Development Guidelines

This repository hosts a browser-based, client-side **Security Advisory Generator** that creates standardized vulnerability advisories in Markdown format.

When assisting with code modifications, feature additions, or refactoring, AI agents **MUST** follow the instructions and rules outlined in this document.

---

## 1. Core Principles & Philosophy

- **Zero Third-Party Dependencies:** Written in plain Vanilla JavaScript, standard HTML5, and CSS. Do NOT introduce external frameworks (e.g., React, Vue), build tools, or CDN dependencies unless explicitly requested.
- **Strict Privacy & Client-Side Execution:** All user inputs and score calculations MUST take place entirely within the user's browser memory. Never send data to external servers.
- **Static Hosting:** The project is deployed via **GitHub Pages**. No backend service or database exists.
- **No JSON import/export:** Do not add features that parse user-supplied JSON files. No persistent storage (`localStorage` etc.) unless explicitly requested.

---

## 2. Strict Security Rules

1. **NO `innerHTML` Allowed (DOM XSS Prevention):**
   - **`innerHTML` is strictly forbidden**, including for clearing elements (use `textContent = ""`). Always use `textContent`, `innerText`, or DOM methods (`document.createElement`, `setAttribute`, `appendChild`) to insert user-controlled data or strings into the DOM.
2. **Strict CSP Adherence:**
   - Keep the Content Security Policy in `index.html` tight (`default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `connect-src 'none'`). Do not use `eval()`, inline scripts, inline `style` attributes, or inline event handlers (`onclick=` etc.).

---

## 3. Project Structure & File Roles

- `index.html`: Base UI layout, input forms, modal/details tags, and CSP meta definitions. Visible text is empty in the HTML and filled from the language files via `data-i18n` / `data-i18n-ph` attributes.
- `style.css`: Stylesheet supporting responsive design and light/dark mode themes (`prefers-color-scheme`).
- `cvss.js`: Language-independent CVSS v3.1 metric codes and official scoring algorithm (`window.CVSS`).
- `lang/ja.js`, `lang/en.js`: All language-specific content: UI strings, preset templates, CVSS metric/option descriptions, CWE options and sample text, linter labels, Markdown output headings (`window.I18N.ja`, `window.I18N.en`).
- `app.js`: Event listeners, dynamic Markdown generation logic, real-time validation (linter), language switching, and clipboard/download actions.
- `README.md`: Bilingual (JA/EN) documentation, including usage notes for Markdown output. `LICENSE`: MIT.

### i18n rules

- Do NOT hard-code user-visible strings in `app.js` or `index.html`. Add them to **both** `lang/ja.js` and `lang/en.js` (keep the same keys and the same array order, e.g. `cwes`, `lint`, `chk`).
- A string of the form `"text|hint"` is rendered as text plus a smaller hint (via DOM nodes, never HTML).

---

## 4. Context & Japanese Vulnerability Disclosure Standards

This tool is designed to support both global standards and local Japanese security disclosure guidelines:

- **CVSS v3.1:** First.org Common Vulnerability Scoring System.
- **CWE:** Common Weakness Enumeration mappings.
- **IPA / JVN / JPCERT/CC (Local Context):**

  - **IPA:** Information-technology Promotion Agency, Japan / Innovation Platform Agency, Japan (From 2026) (Government agency overseeing software security).
  - **JVN:** Japan Vulnerability Notes (Japanese vulnerability advisories portal).
  - **JPCERT/CC:** Japan Computer Emergency Response Team Coordination Center (acting as a CNA/coordinator). *Note: Preset phrases and linter checks follow common Japanese vulnerability disclosure formats (e.g., advisories coordinated via JVN/IPA).*

---

## 5. Input Handling & Markdown Output Policy

- User input is passed to the Markdown output as typed. Markdown syntax in free-text fields is **allowed** (documented in the README), not stripped.
- The title is a single-line field; line breaks are converted to spaces in `build()`.
- Fields rendered inside Markdown tables (advisory ID, product name, version) must go through `esc()` (escapes `|`, converts line breaks to spaces).
- Related information (`refs`) is split by line breaks only. The CVE field may be separated by commas, `、`, or whitespace, and is validated by the linter (`CVE-YYYY-NNNN`).
- The on-screen preview uses `textContent`; never render the generated Markdown as HTML in the tool itself.

---

## 6. Instructions for AI Code Modifications

- **Respect Specifications:** Do NOT alter the mathematical formulas in `cvss.js` or the official CWE mapping logic without explicit instructions. After any change to `cvss.js`, verify known vectors (e.g. `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = 9.8, `S:C` with all High = 10.0).
- **Surgical Edits:** When adding or modifying code, target the specific script (`app.js`, `cvss.js`, etc.) without breaking existing event handling or CSS variables.
- **Preserve Responsive Layout:** Ensure two-column desktop layouts properly collapse into single-column views on narrower screens (`@media (max-width: 860px)`), and that CVSS option rows stay aligned (name and description columns).
- **Check both languages:** After UI changes, switch between Japanese and English and confirm that no text is left untranslated and no console errors appear.
