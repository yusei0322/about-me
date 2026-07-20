import type { ReactNode } from "react";

/** Window の見た目バリエーション */
type WindowVariant = "maximized" | "dialog";

type WindowProps = {
  /** タイトルバーに表示する文字列 */
  title: string;
  /** ウィンドウ本体の中身 */
  children: ReactNode;
  /**
   * maximized: コンテンツ領域いっぱいに広がる最大化ウィンドウ（下層ページ用）
   * dialog:    中央に浮かぶ小さめのダイアログ（404 等）
   */
  variant?: WindowVariant;
  /** 追加クラス（呼び出し側の微調整用） */
  className?: string;
};

/**
 * Win95風の共通ウィンドウ枠。
 * タイトルバー（紺）・ベベルの枠線・ドロップシャドウを持つ。
 * 下層ページはすべてこれで包む（CLAUDE.md のウィンドウUI方針）。
 * 状態を持たないため Server Component のまま静的出力できる。
 */
export default function Window({
  title,
  children,
  variant = "maximized",
  className,
}: WindowProps) {
  const rootClass = ["os-window", `os-window--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    // UI のウィンドウ枠。文書上のセクションではなく単なる枠なので div。
    // タイトルはページ唯一の見出しとして h1 にする（各下層ページの h1 を兼ねる）。
    <div className={rootClass}>
      <div className="os-window__titlebar">
        <h1 className="os-window__title">
          <span className="os-window__title-icon" aria-hidden="true">
            ▣
          </span>
          {title}
        </h1>
        {/* 装飾用のウィンドウ操作ボタン（見た目のみ・操作はしない） */}
        <span className="os-window__controls" aria-hidden="true">
          <span className="os-window__control">_</span>
          <span className="os-window__control">▢</span>
          <span className="os-window__control os-window__control--close">
            ×
          </span>
        </span>
      </div>
      <div className="os-window__body">{children}</div>
    </div>
  );
}
