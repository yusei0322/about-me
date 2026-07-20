"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { worksPreview } from "@/src/data/content";

gsap.registerPlugin(ScrollToPlugin);

// public/ 配下は basePath が自動付与されないため手動で連結する
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 「sakuhin プレビュー」横スライダー。ライブラリ不使用。
 *
 * 仕組み:
 *  - 並びとスワイプ/横スクロールは CSS Scroll Snap に任せる
 *    (トラックに scroll-snap-type: x mandatory、各スライドに scroll-snap-align)。
 *  - Prev/Next ボタンは「現在位置の前後のスライドへ track.scrollLeft を
 *    アニメートするだけ」。GSAP の scrollTo でスナップ位置へ滑らかに寄せる。
 *  - 見出し帯は IntersectionObserver で画面に入ったら --in を付けCSSでフェード。
 *    (3D暗転からの継ぎ目を、下から浮かび上がる演出で橋渡しする)
 */
export default function WorksPreview() {
  const trackRef = useRef<HTMLUListElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // 見出し帯のフェードイン(継ぎ目の橋渡し)
  useEffect(() => {
    const el = bridgeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // 一度出したら監視終了
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** 現在の中央付近のスライド index を scrollLeft から求める */
  function currentIndex(track: HTMLUListElement): number {
    const slideW = track.clientWidth;
    return Math.round(track.scrollLeft / slideW);
  }

  /** dir: -1 で前、+1 で次のスライドへスナップ移動 */
  function move(dir: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const total = worksPreview.items.length;
    const next = Math.min(
      Math.max(currentIndex(track) + dir, 0),
      total - 1
    );
    // reduced-motion なら即時、通常は 0.5s でスクロール位置をアニメート
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(track, {
      scrollTo: { x: next * track.clientWidth },
      duration: reduced ? 0 : 0.5,
      ease: "power2.out",
      overwrite: true,
    });
  }

  return (
    <section
      className="works-preview"
      aria-labelledby="works-preview-heading"
    >
      {/* 継ぎ目の橋渡し帯: 3D暗転の夜色を受けて下から浮かび上がる */}
      <div
        ref={bridgeRef}
        className={
          inView ? "works-preview__intro works-preview__intro--in" : "works-preview__intro"
        }
      >
        <p className="works-preview__eyebrow">{worksPreview.eyebrow}</p>
        <h2 id="works-preview-heading" className="works-preview__heading">
          {worksPreview.heading}
        </h2>
        <p className="works-preview__lead">{worksPreview.lead}</p>
      </div>

      <div className="works-preview__slider">
        <ul ref={trackRef} className="works-preview__track">
          {worksPreview.items.map((item) => (
            <li key={item.src} className="works-preview__slide">
              <figure className="works-preview__figure">
                <Image
                  className="works-preview__image"
                  src={`${basePath}${item.src}`}
                  alt={item.alt}
                  width={800}
                  height={500}
                />
                <figcaption className="works-preview__caption">
                  <span className="works-preview__caption-title">
                    {item.title}
                  </span>
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="works-preview__controls">
          <button
            type="button"
            className="works-preview__button"
            aria-label={worksPreview.prevLabel}
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="works-preview__button"
            aria-label={worksPreview.nextLabel}
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="works-preview__cta">
        <Link href={worksPreview.cta.href} className="works-preview__cta-link">
          {worksPreview.cta.label}
        </Link>
      </div>
    </section>
  );
}
