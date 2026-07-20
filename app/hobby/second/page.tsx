import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages } from "@/src/data/content";

// ルート名 "second" は仮。中身が決まり次第リネームする前提の一時的な英語名。
export const metadata: Metadata = {
  title: pages.hobbySecond.title,
  description: pages.hobbySecond.description,
};

export default function HobbySecondPage() {
  return (
    <Window title={pages.hobbySecond.windowTitle}>
      <div className="page-placeholder">
        <h1 className="page-placeholder__title">{pages.hobbySecond.heading}</h1>
        <p className="page-placeholder__note">{pages.hobbySecond.note}</p>
      </div>
    </Window>
  );
}
