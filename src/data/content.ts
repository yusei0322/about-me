/* ================================================================
   content.ts — サイト全体の文言・画像パス・構成データの唯一の情報源
   （CLAUDE.md 規約: 文言/画像パスは JSX に直書きせず必ずここへ集約する）
   ================================================================ */

/** サイト全体のメタ情報 */
export const site = {
  name: "ZaidOS",
  tagline: "an operating system about me",
} as const;

/**
 * 画像の出典。'own'=自作、それ以外はフリー素材サービス名。
 * 採点の「著作権上Web利用可能」対応として全画像に必ず持たせる。
 * TODO: フリー素材に差し替えたら該当サービス名へ更新すること。
 */
export type ImageSource = "own" | "unsplash" | "pexels" | "pixabay";

/** 出典付きの画像アセット（src の basePath は Image 側で付与） */
export type ImageAsset = {
  /** public/ 以下のパス */
  src: string;
  /** 代替テキスト（必須） */
  alt: string;
  /** 出典管理用 */
  source: ImageSource;
};

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
    source: "own",
  } satisfies ImageAsset,

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
  /** 画像の出典 */
  source: ImageSource;
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
      source: "own",
      title: "portfolio.exe",
      caption: "このサイト自体。ZaidOS をテーマにした自己紹介。",
    },
    {
      src: "/works/placeholder-voxel-world.svg",
      alt: "ボクセルで作った3Dワールドのプレビュー（暫定プレースホルダ）",
      source: "own",
      title: "voxel_world",
      caption: "three.js で組んだ小さな箱庭ワールド。",
    },
    {
      src: "/works/placeholder-brand-kit.svg",
      alt: "ブランドキット（配色とロゴ）のプレビュー（暫定プレースホルダ）",
      source: "own",
      title: "brand_kit",
      caption: "配色・タイポ・ロゴをまとめたブランド設計。",
    },
    {
      src: "/works/placeholder-motion-study.svg",
      alt: "モーション習作のプレビュー（暫定プレースホルダ）",
      source: "own",
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

/* ================================================================
   /works（sakuhin フォルダ）ページ。
   作品をファイルアイコンのグリッドで並べ、クリックで詳細ウィンドウ
   （モーダル）が開く。文言・画像はここに集約。
   ※ TODO: 内容と画像は後で本人の実作品へ差し替える。
   ================================================================ */
export type WorkFileKind = "exe" | "folder" | "image" | "text";

export type WorkItem = {
  /** 一意なID（モーダルの対象特定に使う） */
  id: string;
  /** デスクトップ上のファイル名（拡張子込み・日本語不可） */
  fileName: string;
  /** アイコンの種類（拡張子で見た目を変える） */
  kind: WorkFileKind;
  /** 詳細ウィンドウのタイトル・見出し */
  title: string;
  /** 詳細の本文 */
  description: string;
  /** 使用技術などのメタ情報（行単位） */
  meta: string[];
  /** 詳細ウィンドウに出す画像（1点） */
  image: ImageAsset;
};

export const works = {
  windowTitle: pages.works.windowTitle,
  heading: "sakuhin",
  lead: "アイコンをクリックすると詳細ウィンドウが開きます。",
  /** モーダルを閉じるボタンのラベル */
  closeLabel: "閉じる",
  items: [
    {
      id: "portfolio",
      fileName: "portfolio.exe",
      kind: "exe",
      title: "portfolio.exe — ZaidOS",
      description:
        "このサイト自体。架空のOS「ZaidOS」をテーマに、TOPの一人称3D体験から下層のウィンドウUIまでを一貫した世界観でつくった自己紹介ポートフォリオ。",
      meta: ["Next.js / TypeScript", "three.js / GSAP", "自作CSS（リセットCSSから）"],
      image: {
        src: "/works/placeholder-portfolio.svg",
        alt: "ポートフォリオサイトのトップ画面（暫定プレースホルダ）",
        source: "own",
      },
    },
    {
      id: "voxel-world",
      fileName: "voxel_world",
      kind: "folder",
      title: "voxel_world",
      description:
        "three.js で組んだ小さな箱庭ワールド。ボクセル（立方体）を並べて地形や建物をつくる実験。",
      meta: ["three.js", "WebGL"],
      image: {
        src: "/works/placeholder-voxel-world.svg",
        alt: "ボクセルで作った3Dワールド（暫定プレースホルダ）",
        source: "own",
      },
    },
    {
      id: "brand-kit",
      fileName: "brand_kit.png",
      kind: "image",
      title: "brand_kit.png",
      description:
        "配色・タイポグラフィ・ロゴをまとめたブランド設計。ZaidOSの見た目の土台になっている。",
      meta: ["Design", "配色設計"],
      image: {
        src: "/works/placeholder-brand-kit.svg",
        alt: "ブランドキット（配色とロゴ）（暫定プレースホルダ）",
        source: "own",
      },
    },
    {
      id: "motion-study",
      fileName: "motion_study",
      kind: "folder",
      title: "motion_study",
      description:
        "GSAP によるスクロール連動アニメーションの習作。数値を動かすだけで演出を組み立てる練習。",
      meta: ["GSAP", "ScrollTrigger"],
      image: {
        src: "/works/placeholder-motion-study.svg",
        alt: "モーション習作（暫定プレースホルダ）",
        source: "own",
      },
    },
    {
      id: "readme",
      fileName: "readme.txt",
      kind: "text",
      title: "readme.txt",
      description:
        "制作メモ。作品はすべて暫定プレースホルダで、後で本人の実作品へ差し替える予定。",
      meta: ["TODO: 実作品に差し替え"],
      image: {
        src: "/works/placeholder-portfolio.svg",
        alt: "readmeのプレビュー（暫定プレースホルダ）",
        source: "own",
      },
    },
  ] satisfies WorkItem[],
} as const;

/* ================================================================
   趣味ページ（動的ルート app/hobby/[slug]）のデータ。
   ここに1エントリ追記するだけで趣味ページが1枚増える。
   題材が決まったら slug 文字列を書き換えるとURLも変わる（フォルダ操作不要）。

   kind で表示スタイルを選ぶ:
     "ranking" … 画像 + 紹介文 + 推しランキング（JS: クリックで詳細トグル）
     "gallery" … 画像 + 紹介文 + タグで絞り込めるギャラリー（JS: フィルタ）

   ※ TODO: 題材・文言・画像はすべて仮。後で本人の趣味に差し替える。
   ================================================================ */
export type RankingEntry = {
  rank: number;
  name: string;
  note: string;
};

export type GalleryItem = {
  image: ImageAsset;
  caption: string;
  /** 絞り込み用タグ（filters のいずれか） */
  tags: string[];
};

export type Hobby = {
  /** URL スラッグ（英小文字・ケバブケース）。題材確定時はここを変える */
  slug: string;
  /** ナビ/タスクバー用の短いラベル */
  label: string;
  /** ウィンドウのタイトルバー */
  windowTitle: string;
  /** <title> */
  title: string;
  /** meta description */
  description: string;
  /** 表示スタイル */
  kind: "ranking" | "gallery";
  /** 冒頭の紹介文 */
  intro: { heading: string; body: string };
  /** メイン画像（必須1点） */
  hero: ImageAsset;
  /** kind:"ranking" のとき使う */
  ranking?: RankingEntry[];
  /** kind:"gallery" のとき使う絞り込みタグ */
  filters?: string[];
  /** kind:"gallery" のとき使う画像一覧 */
  gallery?: GalleryItem[];
};

export const hobbies: Hobby[] = [
  {
    // TODO: 題材確定時に slug を実際の趣味名へ（例: "music"）変更する
    slug: "first",
    label: "hobby",
    windowTitle: "hobby/first",
    title: "hobby/first — ZaidOS",
    description: "好きな音楽についての紹介ページ（仮・準備中）。",
    kind: "ranking",
    intro: {
      heading: "好きな音楽",
      // TODO: 実際の趣味紹介に書き換える
      body: "ここは仮の題材（音楽）です。よく聴くアーティストやジャンルを、ランキング形式で紹介する構成にしています。",
    },
    hero: {
      src: "/hobby/placeholder-music.svg",
      alt: "音楽をイメージしたイラスト（暫定プレースホルダ）",
      source: "own",
    },
    ranking: [
      // TODO: 実際の「推し」に書き換える
      { rank: 1, name: "アーティストA", note: "初めて自分で買ったアルバム。" },
      { rank: 2, name: "アーティストB", note: "作業中によく流している。" },
      { rank: 3, name: "アーティストC", note: "ライブに行ってみたい。" },
      { rank: 4, name: "ジャンルD", note: "最近開拓中のジャンル。" },
    ],
  },
  {
    // TODO: 題材確定時に slug を実際の趣味名へ（例: "photo"）変更する
    slug: "second",
    label: "hobby",
    windowTitle: "hobby/second",
    title: "hobby/second — ZaidOS",
    description: "撮った写真を並べたギャラリーページ（仮・準備中）。",
    kind: "gallery",
    intro: {
      heading: "写真ギャラリー",
      // TODO: 実際の趣味紹介に書き換える
      body: "ここは仮の題材（写真）です。撮りためた写真をタグで絞り込めるギャラリーにしています。",
    },
    hero: {
      src: "/hobby/placeholder-photo-01.svg",
      alt: "写真ギャラリーのメイン画像（暫定プレースホルダ）",
      source: "own",
    },
    // TODO: 実際のタグ・写真に差し替える
    filters: ["街", "自然", "夜"],
    gallery: [
      {
        image: {
          src: "/hobby/placeholder-photo-01.svg",
          alt: "街の風景の写真（暫定プレースホルダ）",
          source: "own",
        },
        caption: "街の風景",
        tags: ["街"],
      },
      {
        image: {
          src: "/hobby/placeholder-photo-02.svg",
          alt: "自然の風景の写真（暫定プレースホルダ）",
          source: "own",
        },
        caption: "山と空",
        tags: ["自然"],
      },
      {
        image: {
          src: "/hobby/placeholder-photo-03.svg",
          alt: "夜景の写真（暫定プレースホルダ）",
          source: "own",
        },
        caption: "夜のネオン",
        tags: ["夜", "街"],
      },
      {
        image: {
          src: "/hobby/placeholder-photo-04.svg",
          alt: "夜の自然の写真（暫定プレースホルダ）",
          source: "own",
        },
        caption: "星空",
        tags: ["夜", "自然"],
      },
    ],
  },
];

/** slug から趣味データを引く（無ければ undefined） */
export function findHobby(slug: string): Hobby | undefined {
  return hobbies.find((h) => h.slug === slug);
}

/* ナビの hobby 項目は先頭の趣味の slug に追従させる。
   slug をリネームしてもナビのリンク先が自動で正しくなる。 */
const hobbyNav = nav.find((item) => item.href.startsWith("/hobby"));
if (hobbyNav) hobbyNav.href = `/hobby/${hobbies[0].slug}`;

/* ================================================================
   /contact（renraku）ページ。
   Win95ダイアログ風のお問い合わせフォーム。送信機能は不要（課題要件）で、
   「送信」時はJSでバリデーションのみ行い、結果をモーダルで表示する。
   ================================================================ */
export type ContactSubject = { value: string; label: string };

export type SnsLink = {
  label: string;
  /** TODO: 暫定ダミーURL。本人のアカウントURLに差し替える */
  url: string;
  /** 画面に出す表示名（@ハンドル等） */
  handle: string;
};

export const contact = {
  windowTitle: pages.contact.windowTitle,
  heading: "renraku",
  lead: "お仕事のご相談・ご感想など、お気軽にどうぞ。",
  /** ページ上部の装飾イラスト（画像1点以上の要件を満たす） */
  image: {
    // TODO: 必要ならブランドに合う画像へ差し替える
    src: "/contact/placeholder-mail.svg",
    alt: "封筒のイラスト（renraku ページの装飾・暫定プレースホルダ）",
    source: "own",
  } satisfies ImageAsset,
  /** 静的サイトのため実送信されない旨の注記 */
  notice:
    "※ このサイトは静的サイトのデモです。入力チェックのみ行い、実際には送信されません。",

  /** フォーム各項目の文言 */
  fields: {
    name: {
      id: "contact-name",
      label: "お名前",
      placeholder: "例）ざいど",
      required: true,
    },
    email: {
      id: "contact-email",
      label: "返信先メールアドレス",
      placeholder: "例）you@example.com",
      required: true,
    },
    subject: {
      id: "contact-subject",
      label: "用件",
      required: false,
      // TODO: 用件の選択肢は必要に応じて調整する
      options: [
        { value: "", label: "選択してください" },
        { value: "work", label: "お仕事の相談" },
        { value: "message", label: "感想・メッセージ" },
        { value: "other", label: "その他" },
      ] satisfies ContactSubject[],
    },
    body: {
      id: "contact-body",
      label: "本文",
      placeholder: "ご用件をご記入ください。",
      required: true,
    },
  },

  submitLabel: "送信",

  /** バリデーションメッセージ（エラーダイアログに列挙する） */
  validation: {
    nameRequired: "お名前を入力してください。",
    emailRequired: "返信先メールアドレスを入力してください。",
    emailInvalid: "メールアドレスの形式が正しくありません。",
    bodyRequired: "本文を入力してください。",
  },

  /** 結果ダイアログの文言 */
  dialogs: {
    errorTitle: "入力エラー",
    errorIntro: "次の項目を確認してください：",
    successTitle: "renraku",
    successMessage: "送信しました。（デモのため実際には送信されません）",
    closeLabel: "OK",
  },

  /** SNS導線（URLは暫定ダミー） */
  snsHeading: "SNS",
  sns: [
    // TODO: 実際のアカウントURLに差し替える
    { label: "X (Twitter)", url: "https://example.com/", handle: "@zaido_dummy" },
    { label: "Instagram", url: "https://example.com/", handle: "@zaido_dummy" },
    { label: "GitHub", url: "https://example.com/", handle: "zaido-dummy" },
  ] satisfies SnsLink[],
} as const;
