"use client";

import dynamic from "next/dynamic";

/*
 * three.js は WebGL コンテキストや window / document などブラウザ専用APIを
 * 前提にしており、サーバー側(SSR / 静的エクスポートのビルド時)には存在しない。
 * そのままサーバーで実行すると "window is not defined" 等でクラッシュするため、
 * dynamic import の ssr:false でクライアント上でのみ読み込む。
 * (ssr:false は Client Component 内でしか使えないので、この薄い殻を挟む)
 */
const FirstPersonScene = dynamic(() => import("./FirstPersonScene"), {
  ssr: false,
  // JS読み込み中は夜の部屋色で場をつなぐ
  loading: () => <div className="scene__loading" aria-hidden="true" />,
});

export default function FirstPersonExperience() {
  return <FirstPersonScene />;
}
