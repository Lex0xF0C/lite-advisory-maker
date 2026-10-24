# lite-advisory-maker

**Static. Client-side. No dependencies.**

デモ / Demo: <https://lex0xf0c.github.io/lite-advisory-maker/>

[日本語](#日本語) | [English](#english) | [License](#license--ライセンス)

---

## 日本語

製品の脆弱性アドバイザリを、Markdown形式で作るための小さなWebツールです。フォームに入力すると、CVSS v3.1 基本値の計算と、公開前チェックつきのMarkdownが生成されます。「今日初めて自社製品の脆弱性情報を公開することになった」という担当者が、迷わず書き始められることを目指しています。

### 特長

- **ブラウザの中だけで動作します。** 入力内容を外部へ送信しません。サーバーもデータベースもありません。
- **外部ライブラリなし。** 素のHTML・CSS・JavaScriptのみ。ビルド手順も不要です。
- **CVSS v3.1 基本値の計算機。** 各項目と選択肢に説明つきです。
- **定型文とサンプル。** 状況（緊急、攻撃確認済み、サポート終了）、CWEの例文、対策・回避策・連絡先の雛形。
- **公開前チェック。** 必須項目、仮の文言の取り残し、CVE番号の形式を、入力中に確認します。
- **日本語・英語の表示切り替え。** 文言は `lang/` に分離されています。
- 項目の構成と定型文は、日本の一般的な脆弱性情報の公表形式を参考にしています。

### 使い方

1. `index.html` をブラウザで開きます（GitHub Pages にそのまま置いても動きます）。
2. 左のフォームに入力します。右側に、Markdownと公開前チェックの結果が表示されます。
3. 「Markdownをコピー」または「.mdで保存」で取り出し、自社サイトなどに貼り付けます。

入力内容はページを閉じると消えます。必要な場合は、生成したMarkdownを保存してください。

### Markdown出力の注意点

本ツールは、入力内容をMarkdown形式で出力します。Markdownを禁止するのではなく、次の点を理解したうえで使う方針です。

- 概要・脆弱性の説明などの欄に Markdown 記法（`#`、`*`、`-`、`>`、`` ``` `` など）を入力すると、出力にそのまま反映されます。
- 管理番号・製品名・バージョンは Markdown の表として出力されます。`|` は自動でエスケープされ、改行は空白に置き換わります。ただし、それ以外のMarkdown記法は表の中でも有効です。`|` の直前にバックスラッシュを入力した場合の表示は、レンダラによって異なることがあります。
- タイトルは1行の項目です。改行は空白として扱われます。
- HTMLタグを入力した場合の表示は、掲載先の Markdown レンダラの仕様に依存します。本ツールの画面上では、HTMLとして解釈されません。
- **公開前に必ず、掲載先で表示結果を確認してください。**

### 免責

本ツールは文面づくりの補助です。公開の可否、内容の正確性、CVSSの評価の妥当性は、利用者が判断してください。定型文とサンプルは一般的な例であり、製品ごとの事情に合わせた修正が必要です。公開前に、社内（法務・広報など）の確認を受けることを推奨します。

### ファイル構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | 画面の骨組み。文言は `data-i18n` で言語ファイルから入る |
| `style.css` | 見た目（ダークモード対応） |
| `app.js` | フォーム処理、Markdown生成、公開前チェック、言語の切り替え |
| `cvss.js` | CVSS v3.1 基本値の計算 |
| `lang/ja.js`, `lang/en.js` | 表示文言、定型文、CVSSの説明、CWE例文 |

### 文言の修正と言語の追加

- 画面の文言・定型文・例文は、すべて `lang/*.js` にあります。コードの変更は不要です。
- `ja.js` と `en.js` は同じ構造です。キーを足したら、両方に足してください。
- 言語を追加するには、`lang/en.js` をコピーして翻訳し、`index.html` に `<script src="lang/xx.js"></script>` と `<option value="xx">` を追加します。

### セキュリティ方針

- ネットワーク通信なし（CSPで `connect-src 'none'`）
- `innerHTML` を使用しない（表示は `textContent` と DOM API のみ）
- 外部スクリプト・外部CSSなし（CSPは `default-src 'self'`）
- JSONの読み込み・保存機能なし

不具合や脆弱性を見つけた場合は、Issue でお知らせください。

---

## English

A small web tool for writing product vulnerability advisories in Markdown. Fill in the form to get a CVSS v3.1 base score calculation and Markdown output with a pre-publication checklist. It is aimed at people who have to publish a vulnerability advisory for their own product for the first time and need a clear place to start.

### Features

- **Runs entirely in your browser.** Nothing you enter is sent anywhere. No server, no database.
- **No dependencies.** Plain HTML, CSS and JavaScript. No build step.
- **CVSS v3.1 base score calculator**, with an explanation for every metric and option.
- **Presets and samples:** situation (urgent, attacks confirmed, end of support), CWE sample text, and templates for countermeasures, workarounds and contacts.
- **Pre-publication checks:** required items, leftover placeholders and CVE ID format, checked as you type.
- **Japanese / English UI.** All text lives in `lang/`.
- The section layout and preset wording are modeled on common Japanese vulnerability disclosure formats.

### Usage

1. Open `index.html` in a browser (it also works as-is on GitHub Pages).
2. Fill in the form on the left. The Markdown and the checklist appear on the right.
3. Use “Copy Markdown” or “Save as .md” and paste the result into your website.

Your input is discarded when you close the page. Save the generated Markdown if you need to keep it.

### Notes on Markdown output

The tool outputs your input as Markdown. Markdown is allowed rather than prohibited; please keep the following in mind.

- Markdown syntax (`#`, `*`, `-`, `>`, `` ``` ``, etc.) typed into free-text fields such as Overview or Description is passed through to the output as-is.
- Advisory ID, product names and versions are output as a Markdown table. `|` is escaped automatically and line breaks become spaces, but other Markdown syntax still takes effect inside table cells. How a backslash typed right before `|` is displayed may vary between renderers.
- The title is a single-line field. Line breaks are converted to spaces.
- HTML tags are output as typed. How they are displayed depends on the Markdown renderer of the site you publish to. This tool's own screen does not interpret them as HTML.
- **Always check the rendered result on your publishing site before publishing.**

### Disclaimer

This tool only helps you draft the text. Whether to publish, the accuracy of the content and the validity of the CVSS assessment are your responsibility. Presets and samples are generic examples and must be adapted to your product. We recommend an internal review (legal, PR, etc.) before publication.

### Files

| File | Role |
| --- | --- |
| `index.html` | UI skeleton. Text is filled in from the language files via `data-i18n` |
| `style.css` | Styling (supports dark mode) |
| `app.js` | Form handling, Markdown generation, pre-publication checks, language switching |
| `cvss.js` | CVSS v3.1 base score calculation |
| `lang/ja.js`, `lang/en.js` | UI text, presets, CVSS explanations, CWE sample text |

### Editing text and adding a language

- All UI text, presets and samples are in `lang/*.js`; no code changes are needed.
- `ja.js` and `en.js` share the same structure. When you add a key, add it to both.
- To add a language, copy `lang/en.js`, translate it, then add `<script src="lang/xx.js"></script>` and `<option value="xx">` to `index.html`.

### Security policy

- No network access (`connect-src 'none'` in the CSP)
- No `innerHTML` (output goes through `textContent` and DOM APIs only)
- No external scripts or stylesheets (`default-src 'self'`)
- No JSON import or export

If you find a bug or a vulnerability, please open an issue.

---

## License / ライセンス

[MIT License](LICENSE) © 2026 Lex0xF0C

本ソフトウェアは MIT ライセンスのもとで提供されます。/ This software is released under the MIT License.
