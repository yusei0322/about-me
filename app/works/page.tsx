import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages, works } from "@/src/data/content";
import WorksExplorer from "./WorksExplorer";

export const metadata: Metadata = {
  title: pages.works.title,
  description: pages.works.description,
};

export default function WorksPage() {
  return (
    <Window title={works.windowTitle}>
      <WorksExplorer />
    </Window>
  );
}
