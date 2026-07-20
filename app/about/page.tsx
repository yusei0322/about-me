import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { about, pages } from "@/src/data/content";
import AboutMemo from "./AboutMemo";

export const metadata: Metadata = {
  title: pages.about.title,
  description: pages.about.description,
};

export default function AboutPage() {
  return (
    <Window title={about.windowTitle}>
      <AboutMemo />
    </Window>
  );
}
