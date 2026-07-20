import type { Metadata } from "next";
import Link from "next/link";
import Window from "@/components/os/Window";
import { notFound } from "@/src/data/content";

export const metadata: Metadata = {
  title: notFound.title,
  description: notFound.description,
};

export default function NotFound() {
  return (
    <div className="not-found">
      <Window title={notFound.windowTitle} variant="dialog">
        <div className="not-found__body">
          <p className="not-found__icon" aria-hidden="true">
            ⚠
          </p>
          <div className="not-found__text">
            {/* ページの h1 は Window のタイトルバーが担うため、ここは p にする */}
            <p className="not-found__heading">{notFound.heading}</p>
            <p className="not-found__message">{notFound.body}</p>
          </div>
        </div>
        <div className="not-found__actions">
          <Link href="/" className="not-found__action">
            {notFound.action}
          </Link>
        </div>
      </Window>
    </div>
  );
}
