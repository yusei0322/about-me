import type { NextConfig } from "next";

// GitHub Pages で公開するサブパス（https://<username>.github.io/about-me/）
const basePath = "/about-me";

const nextConfig: NextConfig = {
  // GitHub Pages にはNode.jsサーバーがないため、
  // ビルド時にHTML/CSS/JSファイルへ変換する「静的エクスポート」を行う
  output: "export",

  // https://<username>.github.io/about-me/ のようにサブパス配下で公開するため、
  // 全てのルーティング・アセットパスの先頭に /about-me を付与する
  basePath,

  images: {
    // next/imageの自動最適化はNode.jsサーバーが必要な機能なので、
    // サーバーを持たない静的エクスポートでは利用できない。無効化して
    // 元画像をそのまま出力する設定にする
    unoptimized: true,
  },

  env: {
    // public/ 配下の画像を <img src="/foo.png"> や next/image の
    // src="/foo.png" のように文字列パスで参照する場合、basePathは
    // 自動的には付与されない。コンポーネント側で
    // `${process.env.NEXT_PUBLIC_BASE_PATH}/foo.png` として組み立てるための値
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
