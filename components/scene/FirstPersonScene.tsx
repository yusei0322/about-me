"use client";

import { useEffect, useRef } from "react";
import { scene as sceneText } from "@/src/data/content";
import { createScene } from "./createScene";

/**
 * 一人称3D体験(ZaidOSプロトタイプ)の React ラッパ。
 * 実処理は createScene に委ね、この殻は
 *  - canvas と scroll 用の背高要素をレンダーする
 *  - マウント時に createScene を起動し、アンマウント時に dispose を呼ぶ
 * ことだけを担う。
 */
export default function FirstPersonScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const trigger = rootRef.current;
    if (!canvas || !trigger) return;

    // prefers-reduced-motion: 呼吸・視差を切る(スクロール連動は残す)
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const controller = createScene({
      canvas,
      trigger,
      text: sceneText,
      reducedMotion,
    });

    // アンマウント時に必ず全リソースを解放する
    return () => controller.dispose();
  }, []);

  return (
    <div ref={rootRef} className="scene">
      <canvas ref={canvasRef} className="scene__stage" />
      <p className="scene__hint" aria-hidden="true">
        {sceneText.scrollHint}
      </p>
    </div>
  );
}
