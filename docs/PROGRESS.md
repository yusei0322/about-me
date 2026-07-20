# 開発進捗（PROGRESS）

ZaidOS ポートフォリオサイトのこれまでの作業記録。
（概要・規約は [CLAUDE.md](../CLAUDE.md)、品質チェックの証跡は
[docs/reviews/quality-pass.md](./reviews/quality-pass.md) を参照）

- スタック: Next.js 16 / TypeScript / App Router / 自前CSS（Tailwind不使用）
- 公開方法: 静的エクスポート（`output: 'export'`）→ GitHub Pages（`/about-me/`）
- コンセプト: 架空OS「ZaidOS」。TOP=一人称3D体験、下層=最大化ウィンドウ、
  ヘッダー=メニューバー、フッター=タスクバー

---

## 完了した作業（時系列）

### 1. 環境構築
- `create-next-app`（TS / App Router / ESLint / Tailwind なし）で雛形作成
- `next.config.ts` を静的エクスポート用に設定
  - `output: 'export'` / `basePath: '/about-me'` / `images.unoptimized: true`
  - `public/` 画像の basePath 問題対策として `NEXT_PUBLIC_BASE_PATH` を env で公開
- `.gitignore` に `node_modules` / `.next` / `out` を確認
- `CLAUDE.md`（プロジェクト規約）作成
- GitHub Actions（`.github/workflows/deploy.yml`）で Pages 自動デプロイ設定
  - push → build → `out/` を Pages へ。`.nojekyll` を生成して `_next/` の404を防止

### 2. ZaidOS テーマの土台
- `styles/reset.css`: 自前 modern reset（外部パッケージ不使用）
- `styles/tokens.css`: デザイントークン（プロトタイプ `docs/prototype/` の配色を踏襲）
  - デスクトップ ティール `#0e7a6f` / ウィンドウ灰 `#c0c0c0` / タイトルバー紺 `#000080`
  - 夜の部屋 `#05060a` / 等幅フォントスタック / Win95風ベベル 等
- 共通レイアウト `app/layout.tsx`
  - ヘッダー `site-header.tsx`（メニューバー・ロゴ・ナビ・768px以下でハンバーガー）
  - フッター `site-footer.tsx`（タスクバー・現在ページ表示・**JS時計**＝全ページ共通JS）
- ナビは `next/link`、現在ページを先頭セグメント一致でハイライト
- 文言・ナビ項目は `src/data/content.ts` に集約

### 3. 全ページのルートと共通部品
- `components/os/Window.tsx`（Win95風ウィンドウ枠：タイトルバー・枠線・影）
- ルート整理: `/about`（jibun.txt）/ `/works`（sakuhin）/ `/hobby/[slug]` /
  `/contact`（renraku）
- `app/not-found.tsx`: ZaidOS風 404 ダイアログ
- 各ページに Metadata API で `<title>` / description を設定

### 4. TOP：一人称3D体験の移植
- プロトタイプ `docs/prototype/a2-first-person.html` を `components/scene/` へ移植
  - `types.ts`（状態型）/ `drawScreen.ts`（画面層）/ `createScene.ts`（3D+振付+ループ）
  - `FirstPersonScene.tsx`（殻）/ `FirstPersonExperience.tsx`（`dynamic` `ssr:false` の入口）
- three.js / gsap を npm 導入（CDN廃止）
- **クリーンアップ**: renderer/geometry/material/texture の dispose、
  ScrollTrigger.kill / gsap.killTweensOf、cancelAnimationFrame
- 画面内テキストは `content.ts` から供給。`prefers-reduced-motion` で呼吸・視差を無効化
- プロトタイプの3層構造・コメントを保持（過度な抽象化はしない方針）

### 5. TOP 下部：sakuhin プレビュー スライダー
- 3D体験（暗転）の下に続く通常DOMセクション
- ライブラリ不使用のスライダー（CSS Scroll Snap + GSAP ScrollToPlugin の Prev/Next）
- 作品画像4点（暫定プレースホルダSVG・alt付き）→ **TOP画像3点以上を充足**
- 継ぎ目の工夫: 夜色背景を連続させ z-index で fixed canvas を覆う + 見出しの
  IntersectionObserver フェードイン

### 6. /about（jibun.txt）
- メモ帳風の白い紙面に、名前肩書/出身/学校専攻/スキル/座右の銘目標/生い立ちを表示
  （`docs/about-me-portfolio-analysis.md` の共通要素分析に基づく構成）
- **JS**: GSAP で各行をタイプライター風に1行ずつ表示（reduced-motion では即時）
- 画像1点（アバター・プレースホルダ）。全文言は content.ts に TODO 付きで集約

### 7. /works と趣味ページ×2
- `/works`: 作品サムネイルのグリッド → クリックで Win95風モーダル（詳細ウィンドウ）
- `components/os/Modal.tsx`: 再利用モーダル（**Esc / オーバーレイ / ×** で閉じる、
  フォーカス制御・背景スクロール固定）
- 趣味を**動的ルート `app/hobby/[slug]`** に統合（`generateStaticParams` で静的出力）
  - `content.ts` の `hobbies` に追記するだけで増やせる／slug変更でリネーム
  - ランキング型（クリックで詳細トグル）とギャラリー型（タグフィルタ＋ホバー拡大）
- 全画像に `source` フィールド（出典管理）を導入

### 8. /contact（renraku）
- Win95ダイアログ風フォーム：名前(必須)/メール(必須・形式チェック)/用件/本文(必須)
- **送信機能なし**。送信でJSバリデーションのみ→エラーは Win95風ダイアログに列挙、
  成功時は「送信しました」ダイアログ＋フォームリセット
- label と input を htmlFor で関連付け、必須に aria-required、エラーに aria-invalid
- 実送信されない旨を注記。SNSリンク枠（URLは content.ts に暫定ダミー）
- 封筒イラスト1点（画像要件充足）

### 9. 提出前 品質チェック（AIレビュー）
- W3C Nu Html Checker で全7ページ検証 → **error/warning を0に修正**
  - `<time>`→`<span>`、Window `section`→`div`＋`h1`化、404の`h1`→`p`
- ESLint エラー0・警告0、BEM逸脱0、全ページ画像/alt/JS/title/description 充足
- コントラストをAA化（muted `#4a4a4a`、夜色用ティール追加）
- 詳細は [docs/reviews/quality-pass.md](./reviews/quality-pass.md)

---

## 残タスク（提出まで）

- [ ] **README 作成**（サイト概要・工夫点・技術構成。採点で必須）
- [ ] **GitHub Pages 公開設定**（Settings → Pages → Source を「GitHub Actions」に）
      と公開後の表示確認
- [ ] **仮コンテンツの差し替え**（`content.ts` の TODO：本名・経歴・スキル・
      趣味の題材・実作品・SNS URL、および各プレースホルダ画像）
- [ ] 趣味の題材確定 → `hobbies` の `slug` をリネーム（例 `first`→`music`）
- [ ] 実機（スマホ／タブレット／PC）でのレスポンシブ最終確認

---

## メモ・既知の制限

- 画像はすべて暫定プレースホルダSVG（自作＝`source: 'own'`）。差し替え時は
  `source` をフリー素材名に更新する。
- モーダルはフォーカストラップ未実装（Esc・閉じる・フォーカス復帰は実装済み）。
- Windows + Git Bash では、シェルの作業ディレクトリが `out/` 内にあると
  `npm run build` が `out` のロックで失敗する。ビルド前にリポジトリ直下へ戻すこと。
