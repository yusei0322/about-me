import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Window from "@/components/os/Window";
import { findHobby, hobbies } from "@/src/data/content";
import HobbyView from "./HobbyView";

// content.ts の hobbies から全 slug を静的出力する。
// 趣味を増やすときは content.ts に1エントリ追記するだけでよい。
export function generateStaticParams() {
  return hobbies.map((h) => ({ slug: h.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const hobby = findHobby(slug);
  if (!hobby) return {};
  return { title: hobby.title, description: hobby.description };
}

export default async function HobbyPage({ params }: Params) {
  const { slug } = await params;
  const hobby = findHobby(slug);
  if (!hobby) notFound();

  return (
    <Window title={hobby.windowTitle}>
      <HobbyView hobby={hobby} />
    </Window>
  );
}
