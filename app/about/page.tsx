import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages } from "@/src/data/content";

export const metadata: Metadata = {
  title: pages.about.title,
  description: pages.about.description,
};

export default function AboutPage() {
  return (
    <Window title={pages.about.windowTitle}>
      <div className="page-placeholder">
        <h1 className="page-placeholder__title">{pages.about.heading}</h1>
        <p className="page-placeholder__note">{pages.about.note}</p>
      </div>
    </Window>
  );
}
