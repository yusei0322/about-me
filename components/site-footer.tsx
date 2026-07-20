"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { findNavItem } from "@/src/data/content";

/** HH:MM:SS 形式（24時間・ゼロ埋め）の現在時刻文字列を返す */
function formatClock(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

/**
 * タスクバー風の共通フッター。
 * - 左: 現在ページを「開いているウィンドウ」として表示
 * - 右: JS で毎秒更新する時計（全ページ共通のJS実装 その1）
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const current = findNavItem(pathname);

  // 時計: マウント後にJSで駆動し、アンマウント時に必ず clearInterval する。
  // 初期値を空にしておくことで SSR/CSR の表示不一致(hydration mismatch)を避ける。
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick(); // 初回即時反映
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="taskbar">
      <div className="taskbar__windows">
        <span className="taskbar__window taskbar__window--active">
          <span className="taskbar__window-icon" aria-hidden="true">
            ▣
          </span>
          {current.taskbarTitle}
        </span>
      </div>

      {/* 動く壁掛け時計。特定日時への参照ではないため time 要素は使わず span。
          (空の <time> は datetime 未指定だとHTML的に無効になるため) */}
      <span className="taskbar__clock" suppressHydrationWarning>
        {clock}
      </span>
    </footer>
  );
}
