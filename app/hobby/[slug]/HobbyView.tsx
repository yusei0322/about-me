"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Hobby } from "@/src/data/content";

// public/ 配下は basePath が自動付与されないため手動で連結する
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 趣味ページの本体。hobby.kind で表示スタイルを切り替える。
 *  - "ranking": 画像 + 紹介文 + 推しランキング（JS: クリックで詳細トグル）
 *  - "gallery": 画像 + 紹介文 + タグで絞り込むギャラリー（JS: フィルタ）
 */
export default function HobbyView({ hobby }: { hobby: Hobby }) {
  return (
    <div className="hobby">
      {/* 冒頭: メイン画像 + 紹介文（全 kind 共通・画像1点はここで満たす） */}
      <div className="hobby__intro">
        <Image
          className="hobby__hero"
          src={`${basePath}${hobby.hero.src}`}
          alt={hobby.hero.alt}
          width={800}
          height={400}
        />
        <div className="hobby__intro-text">
          <h2 className="hobby__heading">{hobby.intro.heading}</h2>
          <p className="hobby__body">{hobby.intro.body}</p>
        </div>
      </div>

      {hobby.kind === "ranking" && <Ranking hobby={hobby} />}
      {hobby.kind === "gallery" && <Gallery hobby={hobby} />}
    </div>
  );
}

/** ランキング型: 各行をクリックすると note を開閉する（アコーディオン） */
function Ranking({ hobby }: { hobby: Hobby }) {
  const entries = hobby.ranking ?? [];
  // 開いている rank（null = すべて閉じ）
  const [openRank, setOpenRank] = useState<number | null>(null);
  const medal = (rank: number) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <ol className="ranking">
      {entries.map((entry) => {
        const isOpen = openRank === entry.rank;
        return (
          <li key={entry.rank} className="ranking__item">
            <button
              type="button"
              className="ranking__row"
              aria-expanded={isOpen}
              onClick={() => setOpenRank(isOpen ? null : entry.rank)}
            >
              <span className="ranking__medal" aria-hidden="true">
                {medal(entry.rank)}
              </span>
              <span className="ranking__name">{entry.name}</span>
              <span className="ranking__toggle" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className="ranking__note">{entry.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}

/** ギャラリー型: タグボタンで画像を絞り込む（フィルタ） */
function Gallery({ hobby }: { hobby: Hobby }) {
  const filters = hobby.filters ?? [];
  // 選択中のタグ（null = すべて表示）
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(() => {
    const items = hobby.gallery ?? [];
    return active ? items.filter((it) => it.tags.includes(active)) : items;
  }, [active, hobby.gallery]);

  return (
    <div className="gallery">
      <div className="gallery__filters" role="group" aria-label="タグで絞り込み">
        <button
          type="button"
          className={
            active === null
              ? "gallery__filter gallery__filter--active"
              : "gallery__filter"
          }
          onClick={() => setActive(null)}
        >
          すべて
        </button>
        {filters.map((tag) => (
          <button
            key={tag}
            type="button"
            className={
              active === tag
                ? "gallery__filter gallery__filter--active"
                : "gallery__filter"
            }
            onClick={() => setActive(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <ul className="gallery__grid">
        {visible.map((it) => (
          <li key={it.image.src} className="gallery__cell">
            <figure className="gallery__figure">
              <Image
                className="gallery__image"
                src={`${basePath}${it.image.src}`}
                alt={it.image.alt}
                width={600}
                height={400}
              />
              <figcaption className="gallery__caption">{it.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
