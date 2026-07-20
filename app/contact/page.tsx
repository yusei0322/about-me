import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { pages } from "@/src/data/content";

export const metadata: Metadata = {
  title: pages.contact.title,
  description: pages.contact.description,
};

export default function ContactPage() {
  return (
    <Window title={pages.contact.windowTitle}>
      <div className="page-placeholder">
        <h1 className="page-placeholder__title">{pages.contact.heading}</h1>
        <p className="page-placeholder__note">{pages.contact.note}</p>
      </div>
    </Window>
  );
}
