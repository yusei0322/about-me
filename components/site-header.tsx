"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/src/data/content";

/**
 * メニューバー風の共通ヘッダー。
 * - 左: ZaidOS ロゴ
 * - 右: ナビ（TOP / jibun / sakuhin / hobby / renraku）
 * - 768px以下: ハンバーガーでナビを開閉するドロワーに切替（メディアクエリで制御）
 * 現在ページは usePathname() で判定してハイライトする。
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="menu-bar">
      <Link href="/" className="menu-bar__brand" onClick={() => setOpen(false)}>
        <span className="menu-bar__logo-mark" aria-hidden="true">
          ▚
        </span>
        {site.name}
      </Link>

      {/* モバイル用トグル（768px超では CSS で非表示） */}
      <button
        type="button"
        className="menu-bar__toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label="メニューを開閉"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-bar__toggle-bars" aria-hidden="true" />
      </button>

      <nav
        id="primary-nav"
        className={
          open ? "menu-bar__nav menu-bar__nav--open" : "menu-bar__nav"
        }
      >
        <ul className="menu-bar__list">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="menu-bar__item">
                <Link
                  href={item.href}
                  className={
                    isActive
                      ? "menu-bar__link menu-bar__link--active"
                      : "menu-bar__link"
                  }
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
