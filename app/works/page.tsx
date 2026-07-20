import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages } from "@/src/data/content";

export const metadata: Metadata = {
  title: pages.works.title,
  description: pages.works.description,
};

export default function WorksPage() {
  return (
    <Window title={pages.works.windowTitle}>
      <div className="page-placeholder">
        <h1 className="page-placeholder__title">{pages.works.heading}</h1>
        <p className="page-placeholder__note">{pages.works.note}</p>
      </div>
    </Window>
  );
}
