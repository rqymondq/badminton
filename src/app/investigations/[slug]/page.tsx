import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getInvestigation, investigations } from "@/content/investigations";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import WhatYouBelieve from "@/stories/what-you-believe";

/** Registry of story components. Each investigation owns its own structure. */
const stories: Record<string, ComponentType> = {
  "what-you-believe": WhatYouBelieve,
};

export function generateStaticParams() {
  return investigations.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inv = getInvestigation(slug);
  if (!inv) return {};
  return { title: inv.title, description: inv.dek };
}

export default async function InvestigationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = getInvestigation(slug);
  const Story = stories[slug];
  if (!inv || !Story) notFound();
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-40">
        <SiteHeader tone="ink" transparent />
      </div>
      <main id="main">
        <Story />
      </main>
      <SiteFooter />
    </>
  );
}
