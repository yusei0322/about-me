"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  /** タイトルバーの文字列 */
  title: string;
  /** 閉じるボタンの aria-label */
  closeLabel: string;
  /** 閉じる要求（Esc / オーバーレイ / ×ボタン） */
  onClose: () => void;
  children: ReactNode;
};

/**
 * Win95風のモーダルダイアログ。
 * - Esc キーで閉じる
 * - オーバーレイ（背景）クリックで閉じる
 * - × ボタンで閉じる
 * 開いている間は背景スクロールを止め、開いたら閉じるボタンへフォーカス、
 * 閉じたら元のフォーカス位置へ戻す。
 */
export default function Modal({
  title,
  closeLabel,
  onClose,
  children,
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 開く直前のフォーカス要素を覚えておき、閉じたら戻す
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // 背景スクロールを固定
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 閉じるボタンへフォーカス
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    // オーバーレイ: クリックで閉じる
    <div className="modal" onClick={onClose}>
      {/* ダイアログ本体: 内側クリックはオーバーレイに伝播させない */}
      <div
        className="os-window os-window--dialog modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="os-window__titlebar">
          <span className="os-window__title">
            <span className="os-window__title-icon" aria-hidden="true">
              ▣
            </span>
            {title}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            className="os-window__control os-window__control--close modal__close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="os-window__body">{children}</div>
      </div>
    </div>
  );
}
