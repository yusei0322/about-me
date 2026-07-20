import type { Metadata } from "next";
import Window from "@/components/os/Window";
import { contact, pages } from "@/src/data/content";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: pages.contact.title,
  description: pages.contact.description,
};

export default function ContactPage() {
  return (
    <Window title={contact.windowTitle}>
      <ContactForm />
    </Window>
  );
}
