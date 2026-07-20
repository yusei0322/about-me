import type { Metadata } from "next";
import { top } from "@/src/data/content";

export const metadata: Metadata = {
  title: top.title,
  description: top.description,
};

export default function Home() {
  return (
    <section className="page-placeholder page-placeholder--desktop">
      <h1 className="page-placeholder__title">{top.heading}</h1>
      <p className="page-placeholder__lead">{top.lead}</p>
      <p className="page-placeholder__note">{top.note}</p>
    </section>
  );
}
