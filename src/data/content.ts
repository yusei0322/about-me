/* ================================================================
   content.ts — サイト全体の文言・画像パス・構成データの唯一の情報源
   （CLAUDE.md 規約: 文言/画像パスは JSX に直書きせず必ずここへ集約する）
   ================================================================ */

/** サイト全体のメタ情報 */
export const site = {
  name: "ZaidOS",
  tagline: "an operating system about me",
} as const;

/** ナビゲーション項目（ヘッダー・フッター・ハンバーガーで共用） */
export type NavItem = {
  /** 遷移先パス（basePath は next/link が自動付与するため付けない） */
  href: string;
  /** メニューバーに表示するラベル（英数字のみ — 採点基準で日本語不可） */
  label: string;
  /** タスクバーに出す「開いているウィンドウ名」 */
  taskbarTitle: string;
};

export const nav: NavItem[] = [
  { href: "/", label: "TOP", taskbarTitle: "ZaidOS — desktop" },
  { href: "/about", label: "jibun", taskbarTitle: "jibun.txt" },
  { href: "/works", label: "sakuhin", taskbarTitle: "sakuhin" },
  { href: "/hobby/first", label: "hobby", taskbarTitle: "hobby" },
  { href: "/contact", label: "renraku", taskbarTitle: "renraku" },
];

/**
 * パスの先頭セグメントを "/xxx" 形式で返す（"/" は "/" のまま）。
 * 例: "/hobby/second" -> "/hobby"、"/about" -> "/about"、"/" -> "/"
 */
function section(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg ? `/${seg}` : "/";
}

/**
 * ナビ項目が現在ページ（そのセクション配下を含む）に該当するか。
 * 例: /hobby/first も /hobby/second も "hobby" をアクティブ扱いにする。
 */
export function isNavActive(item: NavItem, pathname: string): boolean {
  return section(item.href) === section(pathname);
}

/** 現在のパスに対応するナビ項目を返す（無ければ TOP を既定にする） */
export function findNavItem(pathname: string): NavItem {
  return nav.find((item) => isNavActive(item, pathname)) ?? nav[0];
}

/** TOP ページの文言 */
export const top = {
  title: "ZaidOS — an operating system about me",
  description:
    "ざいどの自己紹介サイト「ZaidOS」のトップページ。一人称視点の3D体験を予定しています。",
  heading: "ZaidOS",
  lead: "an operating system about me",
  note: "TOP（一人称3D体験）は後で実装します。",
} as const;

/** 下層ページ（最大化ウィンドウ）の文言と <title>/description */
export const pages = {
  about: {
    windowTitle: "jibun.txt - メモ帳",
    heading: "jibun.txt",
    note: "自己紹介ページはここに実装予定です。",
    title: "jibun.txt — ZaidOS",
    description: "ざいどの自己紹介ページ（準備中）。",
  },
  works: {
    windowTitle: "sakuhin",
    heading: "sakuhin",
    note: "作品ページはここに実装予定です。",
    title: "sakuhin — ZaidOS",
    description: "ざいどの制作物を紹介するページ（準備中）。",
  },
  hobbyFirst: {
    windowTitle: "hobby/first",
    heading: "hobby / first",
    note: "趣味①の内容は後で決定します（ルート名は後日リネーム予定）。",
    title: "hobby/first — ZaidOS",
    description: "趣味を紹介するページ その1（準備中）。",
  },
  hobbySecond: {
    windowTitle: "hobby/second",
    heading: "hobby / second",
    note: "趣味②の内容は後で決定します（ルート名は後日リネーム予定）。",
    title: "hobby/second — ZaidOS",
    description: "趣味を紹介するページ その2（準備中）。",
  },
  contact: {
    windowTitle: "renraku",
    heading: "renraku",
    note: "お問い合わせフォームはここに実装予定です。",
    title: "renraku — ZaidOS",
    description: "お問い合わせページ（準備中）。",
  },
} as const;

/* ================================================================
   /about（jibun.txt）ページの本文。
   共通要素分析(docs/about-me-portfolio-analysis.md 2章)に基づく構成:
     名前・肩書 / 出身 / 学校・専攻 / スキル / 座右の銘・目標 /
     生い立ちタイムライン。
   ※ TODO: 以下のダミーテキストは後で本人が実際の内容へ書き換えること。
     画像も暫定プレースホルダなので自分の写真・アバターへ差し替える。
   ================================================================ */
export const about = {
  /** メモ帳ウィンドウのタイトルバー（pages.about と揃える） */
  windowTitle: pages.about.windowTitle,

  /** 自分に関する画像（1点以上・alt必須） */
  image: {
    // TODO: 本人の写真 or アバター画像に差し替える
    src: "/about/placeholder-avatar.svg",
    alt: "ざいどのアバター画像（暫定プレースホルダ）",
  },

  /* 本文は「メモ帳の行」の集合。タイプライター演出で1行ずつ表示する。
     各セクションは label(見出し) と lines(本文行) を持つ。 */
  sections: [
    {
      label: "名前・肩書",
      lines: [
        // TODO: 本名またはニックネームと、肩書を記入
        "ざいど（Zaido）",
        "Webデザイン & フロントエンドを学ぶ学生",
      ],
    },
    {
      label: "出身",
      lines: [
        // TODO: 出身地（都道府県レベルでOK）を記入
        "◯◯県◯◯市 出身",
      ],
    },
    {
      label: "学校・専攻",
      lines: [
        // TODO: 学校名・専攻・学年を記入
        "◯◯専門学校 / ◯◯専攻",
        "Web制作とプログラミングを勉強中",
      ],
    },
    {
      label: "スキル",
      lines: [
        // TODO: 実際に使える/学習中の技術に書き換える
        "HTML / CSS / JavaScript",
        "TypeScript / React / Next.js",
        "GSAP / three.js（学習中）",
      ],
    },
    {
      label: "座右の銘・目標",
      lines: [
        // TODO: 自分の言葉に書き換える
        "座右の銘：「まず作ってみる」",
        "目標：2Dと3Dの境目をなくす表現をつくる",
      ],
    },
    {
      label: "生い立ち",
      lines: [
        // TODO: 出生→幼稚園→小中高→専門学校 の流れで実際の年を記入
        "20XX年　◯◯県で生まれる",
        "20XX年　はじめてPCに触れる",
        "20XX年　高校でWebに興味を持つ",
        "20XX年　◯◯専門学校に入学",
        "現在　　このサイトを制作中",
      ],
    },
  ],

  /** メモ帳フッターの署名行（最後に表示） */
  signature: "— jibun.txt (rev. draft)",
} as const;

/** タイプライター演出コンポーネントへ渡す本文の型 */
export type AboutContent = typeof about;

/** 404（ファイルが見つかりません）ダイアログの文言 */
export const notFound = {
  title: "404 — ZaidOS",
  description: "指定されたページが見つかりませんでした。",
  windowTitle: "ZaidOS",
  heading: "ファイルが見つかりません",
  body: "指定されたページは存在しないか、移動または削除された可能性があります。",
  action: "デスクトップに戻る",
} as const;

/* ================================================================
   TOP の一人称3D体験(ZaidOSプロトタイプ)で画面に描く文言。
   canvas 2D の画面層(components/scene/drawScreen.ts)がここを読む。
   ================================================================ */
export const scene = {
  /** 電源ON直後に流れる BIOS 行（"OK"/"FOUND" を含む行は緑で表示される） */
  bootLines: [
    "ZaidOS BIOS v1.998",
    "Memory Test : 65536 KB OK",
    "Detecting Designer ... FOUND: ZAIDO",
    "Loading personality drivers ... OK",
    "Starting ZaidOS ...",
  ],
  /** デスクトップ上のアイコン名 */
  desktopIcons: ["jibun.txt", "sakuhin", "renraku"],
  /** メモ帳(jibun.txt)を開いたときの本文 */
  memoLines: [
    "こんにちは。ざいどです。",
    "デザインリードをしています。",
    "2Dと3Dの境目をなくすのが好きです。",
  ],
  /** メモ帳ウィンドウのタイトルバー */
  memoTitle: "jibun.txt - メモ帳",
  /** 作品フォルダ内のファイル名 */
  files: ["portfolio.exe", "voxel_world", "brand_kit", "???"],
  /** 作品フォルダウィンドウのタイトルバー */
  worksTitle: "sakuhin",
  /** ラストのお別れダイアログ */
  byeTitle: "ZaidOS",
  byeMessage: "見てくれてありがとう。",
  byeActions: "[ 連絡する ] [ もう一度 ]",
  /** スクロールを促すヒント */
  scrollHint: "▼ SCROLL",
} as const;

/** 画面層(drawScreen)へ渡すテキストの型 */
export type SceneText = typeof scene;

/* ================================================================
   TOP 下部の「sakuhin プレビュー」セクション(通常のDOM)。
   3D体験の暗転の下に続く。作品画像3点以上でTOP画像要件を満たす。
   画像は暫定プレースホルダ(public/works/ に英語ケバブケース)で、
   後で自作スクリーンショットに差し替える前提。
   ================================================================ */
export type WorkPreview = {
  /** public/works/ 以下のファイル名(basePath は Image 側で付与) */
  src: string;
  /** 代替テキスト(必須) */
  alt: string;
  /** スライド内のキャプション見出し */
  title: string;
  /** キャプション本文 */
  caption: string;
};

export const worksPreview = {
  /** セクションの橋渡し帯・見出し */
  eyebrow: "sakuhin // preview",
  heading: "作品プレビュー",
  lead: "画面の中で開いた sakuhin フォルダの中身を、少しだけ。",
  /** 横スライダーに並べる作品(3点以上) */
  items: [
    {
      src: "/works/placeholder-portfolio.svg",
      alt: "ポートフォリオサイトのトップ画面のプレビュー（暫定プレースホルダ）",
      title: "portfolio.exe",
      caption: "このサイト自体。ZaidOS をテーマにした自己紹介。",
    },
    {
      src: "/works/placeholder-voxel-world.svg",
      alt: "ボクセルで作った3Dワールドのプレビュー（暫定プレースホルダ）",
      title: "voxel_world",
      caption: "three.js で組んだ小さな箱庭ワールド。",
    },
    {
      src: "/works/placeholder-brand-kit.svg",
      alt: "ブランドキット（配色とロゴ）のプレビュー（暫定プレースホルダ）",
      title: "brand_kit",
      caption: "配色・タイポ・ロゴをまとめたブランド設計。",
    },
    {
      src: "/works/placeholder-motion-study.svg",
      alt: "モーション習作のプレビュー（暫定プレースホルダ）",
      title: "motion_study",
      caption: "GSAP によるスクロール連動アニメーションの習作。",
    },
  ] satisfies WorkPreview[],
  /** スライダー操作ボタンのラベル(スクリーンリーダー用) */
  prevLabel: "前の作品へ",
  nextLabel: "次の作品へ",
  /** セクション末尾の /works 誘導 */
  cta: {
    href: "/works",
    label: "sakuhin をすべて見る →",
  },
} as const;
