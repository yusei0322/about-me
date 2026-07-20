# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code（および開発者）向けのプロジェクト規約です。
**作業を始める前に必ず全体を読み、「絶対ルール」を厳守してください。**

---

## 1. プロジェクト概要

2026年前期「Web基礎」期末課題の個人ポートフォリオサイト。
Next.js（App Router / TypeScript）で制作し、GitHub Pages で静的公開する。

### 課題要件（採点対象）

- **5ページ以上**で構成する
- **全ページに共通のヘッダー・フッター・ナビゲーション**を設置する
- **レスポンシブ対応**（スマホ／タブレット／PC で崩れない）
- **サイト全体でテーマ（配色・トーン・世界観）を統一**する
- **フォーム**を設置する（問い合わせ等）
- **TOPページに画像を3点以上**、**その他の各ページに画像を1点以上**配置する
- **各ページに JavaScript による実装**を含める（動き・インタラクション）
- **README を用意**する（サイト概要・工夫点・技術構成などを記載）

> CSS は自前で書く（Tailwind は使わない）。CSS の書き方自体が採点されるため。

---

## 2. コンセプト：「ZaidOS」

サイト全体を**架空の OS（オペレーティングシステム）「ZaidOS」の画面**に見立てる。
一貫した世界観で全ページのテーマを統一する仕掛け。

| 要素 | 見立て | 役割 |
| --- | --- | --- |
| **TOPページ** | 一人称視点の 3D 空間体験 | OS 起動後のデスクトップ／没入エントリー |
| **下層ページ** | 最大化されたウィンドウ | 各コンテンツ（About / Works / … ）を全画面ウィンドウとして表示 |
| **ヘッダー** | メニューバー | 画面上部の固定ナビ（OS のメニューバー風） |
| **フッター** | タスクバー | 画面下部の固定バー（開いているページ＝タスク風） |

- TOP は three.js による一人称 3D 体験、下層はウィンドウUIのメタファーで統一する。
- 「OS の画面を操作している」感覚を全ページで壊さないこと。

---

## 3. 絶対ルール（違反＝減点・作り直しリスク）

1. **ファイル名・クラス名に日本語を使わない。**
   - 半角英数・ハイフン・アンダースコアのみ。日本語のファイル名／クラス名は採点基準で減点対象。
   - 日本語は「表示される文言」だけに限る（後述の `content.ts` 内）。

2. **クラス命名は BEM で統一する。**
   - 形式：`block__element--modifier`
   - 例：`menu-bar`, `menu-bar__item`, `menu-bar__item--active`
   - キャメルケースやスネークケースのクラス名を混在させない。

3. **コンテンツの文言・画像パスは `src/data/content.ts` にのみ書く。**
   - JSX/TSX に日本語の文言や画像パスを直書きしない。
   - テキスト・画像の追加や修正は必ず `content.ts` を経由する（データとビューの分離）。

4. **three.js / GSAP のコードは `components/scene/` に隔離する。**
   - 3D・アニメーションのロジックを一般コンポーネントに混ぜない。
   - **アンマウント時のクリーンアップを必ず実装する：**
     - three.js のリソースは `dispose()`（geometry / material / texture / renderer 等）
     - GSAP は `ScrollTrigger.kill(true)`
   - クリーンアップ漏れはメモリリーク・多重描画の原因になるため必須。

5. **指示されたファイル以外を変更しない。**
   - スコープ外の変更が必要／望ましいと判断した場合は、**実装せずに報告**する。
   - 「ついでの修正」「気になった箇所の整形」も勝手に行わない。

---

## 4. ディレクトリ規約

```
app/
  page.tsx           TOP（一人称3D体験 + sakuhin プレビュー）
  layout.tsx         共通レイアウト（ヘッダー/フッター/ナビ）
  about/             /about（jibun.txt メモ帳）
  works/             /works（sakuhin フォルダ + 詳細モーダル）
  hobby/[slug]/      /hobby/<slug>（趣味ページ・動的ルート）
  contact/           /contact（renraku お問い合わせフォーム）
  not-found.tsx      404（ZaidOS風ダイアログ）
  globals.css        全ページ共通スタイル（BEM）
components/
  os/                Window / Modal（Win95風の枠・ダイアログ）
  scene/             three.js / GSAP 専用（ここ以外に 3D・アニメを書かない）
  site-header.tsx    メニューバー / site-footer.tsx タスクバー（JS時計）
src/data/content.ts  全ページの文言・画像パスを集約（唯一の情報源）
styles/              reset.css（自前リセット）/ tokens.css（デザイントークン）
public/              画像などの静的アセット（basePath 込みで参照すること）
```

- ルートと nav ラベルの対応: `/`=TOP / `/about`=jibun / `/works`=sakuhin /
  `/hobby/[slug]`=hobby / `/contact`=renraku。
- **趣味ページは動的ルート**。増やすときは `content.ts` の `hobbies` に1エントリ追記
  するだけ（フォルダ作成不要）。題材確定時は `slug` 文字列を書き換えるとURLも変わる。
- **画像は `{ src, alt, source }` 型**で持つ（`source: 'own' | フリー素材名` で出典管理）。
- `public/` の画像を文字列パスで参照する場合は basePath が自動付与されないため、
  `` `${process.env.NEXT_PUBLIC_BASE_PATH}/foo.png` `` の形で組み立てる
  （詳細は `next.config.ts` のコメント参照）。
- 進捗の詳細は `docs/PROGRESS.md`、品質チェックの証跡は
  `docs/reviews/quality-pass.md` を参照。

---

## 5. 現在のフェーズ（開発チェックリスト）

- [x] **Phase 0: 環境構築**
  - [x] create-next-app で雛形作成（TS / App Router / ESLint / Tailwind なし）
  - [x] `next.config.ts` を静的エクスポート用に設定（output/basePath/images.unoptimized）
  - [x] `npm run build` で `out/` 生成を確認
  - [x] `.gitignore` に node_modules / .next / out を確認
  - [x] CLAUDE.md（本ファイル）作成
  - [x] GitHub Actions による Pages 自動デプロイ設定
- [x] **Phase 1: 骨組み**
  - [x] `src/data/content.ts` 作成（全ページ分の文言・画像パスを定義）
  - [x] 共通レイアウト：ヘッダー（メニューバー）／フッター（タスクバー）／ナビ
  - [x] 5ページ以上のルーティング（TOP/about/works/hobby×2/contact + 404）
  - [x] 全体テーマ（reset.css / tokens.css / globals.css）の定義
- [x] **Phase 2: TOP（一人称3D体験）**
  - [x] `components/scene/` に three.js シーンを移植（プロトタイプの3層構造を保持）
  - [x] dispose / ScrollTrigger.kill / cancelAnimationFrame のクリーンアップを実装
  - [x] TOP に画像3点以上を配置（sakuhin プレビュー横スライダー・4点）
- [x] **Phase 3: 下層ページ（最大化ウィンドウ）**
  - [x] 各ページを Window（Win95風）で実装
  - [x] 各ページに画像1点以上（contact も封筒イラストで充足）
  - [x] 各ページに JS 実装（タイプライター/モーダル/ランキング開閉/ギャラリーフィルタ/フォーム検証）
  - [x] フォームページ（/contact・バリデーション＋結果ダイアログ、送信機能なし）
- [ ] **Phase 4: 仕上げ**
  - [~] レスポンシブ調整（メディアクエリ実装済み。実機での最終確認は未実施）
  - [x] テーマ統一（ZaidOS の世界観で全ページ統一）
  - [x] 品質チェック（W3C/ESLint/画像・alt・BEM・コントラスト → `docs/reviews/quality-pass.md`）
  - [ ] README 作成（概要・工夫点・技術構成）
  - [ ] GitHub Pages 公開確認（Settings→Pages の Source を「GitHub Actions」に設定）
  - [ ] 仮テキスト・仮画像を本人の内容へ差し替え（content.ts の TODO 参照）

> 凡例: `[x]`=完了 / `[~]`=一部完了 / `[ ]`=未着手

---

## 6. よく使うコマンド

```bash
npm run dev     # 開発サーバー
npm run build   # 静的ビルド → out/ 生成
npm run lint    # ESLint
```
