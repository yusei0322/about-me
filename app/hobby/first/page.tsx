import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages } from "@/src/data/content";

// ルート名 "first" は仮。中身が決まり次第リネームする前提の一時的な英語名。
export const metadata: Metadata = {
  title: pages.hobbyFirst.title,
  description: pages.hobbyFirst.description,
};

export default function HobbyFirstPage() {
  return (
    <Window title={pages.hobbyFirst.windowTitle}>
      <div className="page-placeholder">
        <h1 className="page-placeholder__title">{pages.hobbyFirst.heading}</h1>
        <p className="page-placeholder__note">{pages.hobbyFirst.note}</p>
      </div>
    </Window>
  );
}
