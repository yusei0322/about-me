import type { Metadata } from "next";
import FirstPersonExperience from "@/components/scene/FirstPersonExperience";
import WorksPreview from "@/components/scene/WorksPreview";
import { top } from "@/src/data/content";

export const metadata: Metadata = {
  title: top.title,
  description: top.description,
};

export default function Home() {
  return (
    <>
      {/* 3D体験はssr:falseでクライアント描画のため、静的HTMLに残る見出しを
          サーバー側(このページ)で視覚的に隠して置いておく */}
      <h1 className="sr-only">{top.heading}</h1>
      <FirstPersonExperience />
      {/* 3D体験(暗転)の下に続く通常DOMセクション。
          画像はssr:false対象外なので静的HTMLに含まれる(画像3点以上の要件) */}
      <WorksPreview />
    </>
  );
}
