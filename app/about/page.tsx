import type { Metadata } from "next";
import AboutHero from "@/app/_components/AboutHero";
import AboutCTA from "@/app/_components/AboutCTA";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali Nginapin lebih dekat — platform booking penginapan terpercaya di Indonesia.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutCTA />
    </>
  );
}
