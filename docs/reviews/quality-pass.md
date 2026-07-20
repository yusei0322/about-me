# 提出前 品質チェック記録（AIレビュー証跡）

- 対象: ZaidOS ポートフォリオサイト（Next.js 静的エクスポート / GitHub Pages 公開）
- 実施日: 2026-07-20
- 実施者: Claude（Claude Code 上でのAIレビュー）
- 対象コミット: 本レビュー直前の `main`（/contact 実装 `022a60d` 以降）

このドキュメントは採点基準「AIレビュー」の証跡として、実施した検証手順・発見した問題・
その対応（修正した / しない＋理由）を記録するものです。

---

## 0. 検証環境と手順の要点

| 項目 | 内容 |
|---|---|
| ビルド | `npm run build`（`output: 'export'` で `out/` を生成） |
| HTML 検証 | W3C Nu Html Checker の REST API（`https://validator.w3.org/nu/?out=json`）に `out/` の各HTMLを POST し、JSON で error/warning を取得 |
| Lint | `npm run lint`（ESLint / eslint-config-next） |
| 画像・メタ・JS の機械チェック | `out/` HTML と `app/` ソースを grep/Node スクリプトで集計 |
| ファイル名チェック | `find` で日本語・大文字・スペースを走査 |
| BEM チェック | `app/globals.css` のクラスセレクタを正規表現で BEM 判定 |
| コントラスト | 主要な文字色 / 背景色の組を WCAG 相対輝度式で算出 |
| A11y キーボード | ソースの操作要素（button/a/input）とフォーカス可視性をコード監査 |

> 注: HTML 検証は「W3C Nu Html Checker」に自サイトのHTMLを送信して行っています
> （課題が指定する検証手段であり、内容は公開予定の自作HTMLのみ）。

### Nu Html Checker の再現手順

```bash
npm run build
# 各ページを Nu にPOSTして JSON を取得
for f in index about works hobby/first hobby/second contact 404; do
  curl -s -H "Content-Type: text/html; charset=utf-8" \
    --data-binary @"out/$f.html" \
    "https://validator.w3.org/nu/?out=json"
done
```

---

## 1. W3C（Nu Html Checker）検証結果

### 修正前（初回検証）

全ページで **error 1件ずつ**（合計7件）＋ warning。主な指摘:

| 種別 | 指摘 | 該当 |
|---|---|---|
| **error** | `The text content of element "time" was not in the required format`（`<time>` の内容が時刻フォーマットでない） | 全ページ（タスクバー時計） |
| warning | `Section lacks heading`（`<section>` に見出しがない） | Window を使う下層ページ |
| warning | `This document has heading elements but none … computed heading level of 1`（h1 が無い） | 下層ページ |
| info | `Trailing slash on void elements …`（void要素の末尾スラッシュ） | 全ページ（Next.js の出力） |

### 修正後（再検証）

| ページ | error | warning | info |
|---|---|---|---|
| index (`/`) | 0 | 0 | 10 |
| about | 0 | 0 | 7 |
| works | 0 | 0 | 11 |
| hobby/first | 0 | 0 | 7 |
| hobby/second | 0 | 0 | 11 |
| contact | 0 | 0 | 8 |
| 404 | 0 | 0 | 7 |
| **合計** | **0** | **0** | 61 |

→ **error・warning は全ページ 0 件**。残る info は次項で扱う。

### 各指摘への対応

| # | 指摘 | 対応 | 理由 |
|---|---|---|---|
| 1 | `<time>` の内容が時刻フォーマット違反（error） | **修正した** | タスクバー時計は初期状態で空文字を描画し、`datetime` 属性の無い空の `<time>` は無効。動く壁掛け時計は特定日時への参照ではないため、意味的にも `<time>` ではなく `<span>` が適切と判断し変更（`components/site-footer.tsx`）。 |
| 2 | `Section lacks heading`（warning） | **修正した** | `Window` の枠は文書上の「章」ではなくUIの枠なので、ルートを `<section>` → `<div>` に変更（`components/os/Window.tsx`）。 |
| 3 | h1 が存在しない（warning） | **修正した** | `Window` のタイトルバーを各下層ページ唯一の `<h1>` として描画するよう変更。あわせて 404 の内部見出しは重複を避けて `<h1>`→`<p>` に降格（`app/not-found.tsx`）。TOP は従来どおり視覚的に隠した `<h1>` を持つ。 |
| 4 | `Trailing slash on void elements`（info） | **修正しない** | Next.js（React）の HTML シリアライズが出力する `<meta/>` `<img/>` 等に由来。info レベルで error/warning ではなく、フレームワークの標準出力のため手を入れない。実害なし。 |

---

## 2. ESLint

- コマンド: `npm run lint`
- 結果: **エラー 0 / 警告 0**
- 途中で検出した警告 1 件（`react-hooks/exhaustive-deps`: `HobbyView` の `useMemo` 依存に毎回再生成される配列が入る）は、`hobby.gallery` を `useMemo` 内で参照する形に修正して解消済み。

---

## 3. 全ページ機械チェック一覧

### 3-1. 画像 / alt / JS / タイトル / description

| ルート | 画像数 | alt | title | description | JS実装（1つ以上） |
|---|---|---|---|---|---|
| `/` | 4 | 4/4 | ✓ | ✓ | 3D体験（three.js/GSAP）＋作品スライダー＋時計 |
| `/about` | 1 | 1/1 | ✓ | ✓ | GSAP タイプライター演出 |
| `/works` | 5 | 5/5 | ✓ | ✓ | ファイルアイコン→詳細モーダル開閉 |
| `/hobby/first` | 1 | 1/1 | ✓ | ✓ | ランキング行のクリック開閉 |
| `/hobby/second` | 5 | 5/5 | ✓ | ✓ | タグによるギャラリー絞り込み＋ホバー拡大 |
| `/contact` | 1 | 1/1 | ✓ | ✓ | フォーム入力バリデーション＋結果ダイアログ |

- すべてのページで「画像1点以上・alt あり・JS実装1つ以上・title/description あり」を満たす。
- TOP は画像3点以上（作品スライダー4点）で要件充足。全ページ共通の JS として時計もある。

**発見した問題:** `/contact` が当初 **画像0点**で「各ページ画像1点以上」を満たしていなかった。
→ **修正した**: `renraku` テーマの封筒イラスト（自作プレースホルダSVG `public/contact/placeholder-mail.svg`）を
ページ上部に追加し alt を付与。`content.ts` の `contact.image` に集約。

### 3-2. ファイル名（日本語・大文字・スペース）

- **公開アセット（`public/`）**: すべて英小文字ケバブケース。日本語・大文字・スペース **なし**。
  - 例: `placeholder-avatar.svg`, `placeholder-photo-01.svg`, `placeholder-mail.svg`
- **ルートセグメント（URL）**: `/about` `/works` `/hobby/[slug]` `/contact` — すべて英小文字。
- **ソースのコンポーネントファイル**: `AboutMemo.tsx` 等の PascalCase / `createScene.ts` 等の camelCase に
  大文字を含む。
  → **修正しない**。理由: React コンポーネントの PascalCase は業界標準の命名規約であり、採点基準の
  「日本語ファイル名NG」「ファイル名適切」が問題にするのは**公開される画像/HTML等のアセット名**。
  公開アセット・URL は上記のとおりすべて小文字ケバブで問題なし。ソースの慣用的命名を崩す方が有害。

**あわせて対応:** create-next-app 由来の未使用SVG 5点（`file/globe/next/vercel/window.svg`）を
参照ゼロと確認のうえ削除（ディレクトリ整理）。

### 3-3. BEM 逸脱チェック

- `app/globals.css` の実クラスセレクタ **125個** を BEM パターン
  `block(-word)*(__element)?(--modifier)?`（すべて小文字ケバブ）で判定。
- **逸脱: 0件**。ブロック/ユーティリティは 15 種（`menu-bar` `taskbar` `os-window` `modal` `scene`
  `works-preview` `about-memo` `ranking` `gallery` `contact` `contact-form` `contact-sns`
  `contact-dialog` `not-found` `page-placeholder` ほか `sr-only` `app-shell`）。
- JSX の className と CSS 定義を突き合わせ、未定義クラス参照（タイポ）も確認。
  16個が「CSSルール無し」で挙がったが、いずれも
  (a) レイアウトを親に委ねる構造ラッパ（`hobby` `gallery__cell` `menu-bar__item` 等）、
  (b) JS/GSAP のフック（`about-memo__reveal`）、
  (c) id の誤検出（`works-preview-heading` は class でなく id）
  であり、**タイポ・壊れた参照は0件**。

---

## 4. アクセシビリティ簡易チェック

### 4-1. キーボード操作（コード監査）

| 対象 | 実装 | キーボード操作 |
|---|---|---|
| ナビ（ヘッダー） | `next/link`（`<a href>`）＋ハンバーガーは `<button>` | Tab で移動・Enter で遷移・Space/Enter で開閉 ✓ |
| モーダル（作品詳細 / フォーム結果） | `<button>` の閉じるボタン、開いたら閉じるボタンへフォーカス、閉じたら元要素へ復帰 | **Esc で閉じる**・オーバーレイクリックで閉じる・×ボタンで閉じる ✓ |
| フォーム | ネイティブ `<input>/<select>/<textarea>` ＋ `<button type="submit">` | Tab で全項目・Enter で送信 ✓ |
| ランキング / ギャラリー / 作品タイル | すべて `<button>` | Tab＋Enter/Space で操作 ✓ |

- 操作要素はすべてネイティブの `button` / `a` / フォーム要素で、`div` に `onClick` だけを付けた
  「キーボードで押せない要素」は**無し**。
- フォーカスの可視性: リンク・ボタンはブラウザ既定のフォーカスリングを残置。入力欄と作品タイルには
  `:focus-visible` で枠/ベベルを付与。`outline: none` を1箇所使用しているが、同時に
  背景＋ベベルでフォーカスを可視化しているため問題なし。

**既知の制限（修正しない）:** モーダルは「開いた時のフォーカス移動・Esc・フォーカス復帰」は実装済みだが、
**フォーカストラップ（Tab がモーダル内で循環）は未実装**。Esc と閉じるボタンで確実に閉じられ、
基本操作は成立するため、今回のスコープでは許容。将来的な改善候補として記録。

### 4-2. コントラスト比（WCAG 相対輝度で算出）

修正前に検出した低コントラスト:

| 文字色 / 背景 | 比 | 判定 | 用途 |
|---|---|---|---|
| muted `#6a6a6a` / ウィンドウ灰 `#c0c0c0` | 2.97 | **FAIL** | 補助テキスト（注記・キャプション等） |
| ティール `#0e7a6f` / 夜色 `#05060a` | 3.89 | AA-large のみ | 作品プレビューの小見出し（小サイズ文字） |

**対応（修正した）:**
- `--color-text-muted` を `#6a6a6a` → **`#4a4a4a`** に変更。ウィンドウ灰の上で **4.87**（AA）、白の上 8.86、
  `#dfdfdf` の上 6.65 と、使用箇所すべてで AA を満たす。
- 夜色背景の小見出し用に `--color-desktop-bright: #38b0a3` を追加し、`works-preview__eyebrow` に適用。
  夜色の上で **7.63**（AA）。

修正後の主要ペア（すべて AA 以上）:

| 文字色 / 背景 | 比 | 判定 |
|---|---|---|
| 本文 `#1a1a1a` / 白 | 17.40 | AA |
| 本文 `#1a1a1a` / 灰 `#c0c0c0` | 9.57 | AA |
| muted `#4a4a4a` / 灰 `#c0c0c0` | 4.87 | AA |
| タイトルバー白 `#fff` / 紺 `#000080` | 16.01 | AA |
| 反転 `#f4f4f4` / 夜色 `#05060a` | 18.41 | AA |
| 紺 `#000080` / 灰 `#c0c0c0`（ラベル） | 8.80 | AA |
| 明ティール `#38b0a3` / 夜色 | 7.63 | AA |
| アクセント `#f2e06b` / 夜色 | 15.09 | AA |

- `.scene__hint`（"▼ SCROLL"）は半透明の装飾テキストで `aria-hidden` 指定のため、コントラスト評価対象外。

---

## 5. 対応サマリー（修正した / しない）

### 修正した
1. `<time>` → `<span>`（Nu error解消・全ページ）
2. `Window` ルート `<section>`→`<div>`、タイトルを `<h1>` 化（Nu warning解消・見出し階層）
3. 404 の内部 `<h1>`→`<p>`（h1 重複回避）
4. ESLint `useMemo` 依存警告の解消（`HobbyView`）
5. `/contact` に画像1点を追加（画像要件充足）
6. `--color-text-muted` を `#4a4a4a` に、夜色用 `--color-desktop-bright #38b0a3` を追加（コントラストAA化）
7. 未使用の create-next-app 既定SVG 5点を削除

### 修正しない（理由つき）
1. Nu の info「void要素の末尾スラッシュ」— Next.js の標準HTML出力。error/warningでなく実害なし。
2. ソースのコンポーネント名の大文字（PascalCase/camelCase）— React/TS の標準規約。採点対象は公開アセット/URL名で、そちらは小文字ケバブで問題なし。
3. モーダルのフォーカストラップ未実装 — Esc・閉じる・フォーカス復帰で基本操作は成立。将来改善候補。

---

## 6. 最終状態

- `npm run build`: 成功（`out/` 生成、TOP=Static、hobby=SSG で全ルート静的出力）
- `npm run lint`: エラー0 / 警告0
- W3C Nu Html Checker: 全7ページ **error 0 / warning 0**（info のみ）
- 全ページ: 画像1点以上・alt・JS・title・description を充足
- ファイル名（公開アセット/URL）: 日本語・大文字・スペースなし
- BEM 逸脱: 0
- 主要テキストのコントラスト: すべて WCAG AA 以上
