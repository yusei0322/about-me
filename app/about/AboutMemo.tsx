"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { about } from "@/src/data/content";

// public/ 配下は basePath が自動付与されないため手動で連結する
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * jibun.txt のメモ帳本文。
 * JS実装: 表示時に各行がタイプライター風に1行ずつ浮かび上がる(GSAP)。
 *
 * ・全行は最初から DOM に存在させる(JS無効でも読める・静的HTMLに残る)。
 * ・通常時は useLayoutEffect で描画前に opacity:0 にしてから順に見せる。
 * ・prefers-reduced-motion 時は何もしない = 即時表示(CSS既定のまま)。
 */
export default function AboutMemo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 動きを抑える設定なら演出せず即時表示のまま
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    // gsap.context: このコンポーネント内の tween をまとめて管理し、
    // revert() で元のインラインスタイルへ戻して確実にクリーンアップする。
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".about-memo__reveal");
      gsap.set(lines, { opacity: 0, y: 6 });
      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "none",
        stagger: 0.12, // 1行ずつ順番に(タイプライター風)
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="about-memo">
      <div className="about-memo__paper">
        <figure className="about-memo__figure about-memo__reveal">
          <Image
            className="about-memo__image"
            src={`${basePath}${about.image.src}`}
            alt={about.image.alt}
            width={320}
            height={320}
          />
          <figcaption className="about-memo__caption">avatar.png</figcaption>
        </figure>

        {about.sections.map((section) => (
          <section key={section.label} className="about-memo__section">
            <h2 className="about-memo__label about-memo__reveal">
              # {section.label}
            </h2>
            {section.lines.map((line, i) => (
              <p
                key={`${section.label}-${i}`}
                className="about-memo__line about-memo__reveal"
              >
                {line}
              </p>
            ))}
          </section>
        ))}

        <p className="about-memo__signature about-memo__reveal">
          {about.signature}
          <span className="about-memo__cursor" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
