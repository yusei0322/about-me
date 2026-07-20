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
  /** 画面に表示するラベル（英数字のみ — 採点基準でファイル名/クラス名に日本語不可） */
  label: string;
  /** タスクバーに出す「ウィンドウ名」 */
  windowTitle: string;
};

export const nav: NavItem[] = [
  { href: "/", label: "TOP", windowTitle: "ZaidOS — desktop" },
  { href: "/jibun", label: "jibun", windowTitle: "jibun.txt" },
  { href: "/sakuhin", label: "sakuhin", windowTitle: "sakuhin" },
  { href: "/hobby", label: "hobby", windowTitle: "hobby" },
  { href: "/renraku", label: "renraku", windowTitle: "renraku" },
];

/**
 * 現在のパスに対応するナビ項目を返す。
 * 見つからない場合は TOP を既定にする。
 */
export function findNavItem(pathname: string): NavItem {
  return nav.find((item) => item.href === pathname) ?? nav[0];
}
