import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getInvestigation, investigations } from "@/content/investigations";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import WhatYouBelieve from "@/stories/what-you-believe";
import Attention from "@/stories/attention";
import { computeReceipt, money } from "@/stories/attention/figures";
import { siteUrl } from "@/lib/site";

/** Registry of story components. Each investigation owns its own structure. */
const stories: Record<string, ComponentType> = {
  "what-you-believe": WhatYouBelieve,
  attention: Attention,
};

export function generateStaticParams() {
  return investigations.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const inv = getInvestigation(slug);
  if (!inv) return {};
  const base: Metadata = {
    title: inv.title,
    description: inv.dek,
    alternates: { canonical: `/investigations/${inv.slug}` },
    openGraph: {
      title: inv.title,
      description: inv.dek,
      type: "article",
      publishedTime: inv.published,
      section: inv.desk,
      url: `/investigations/${inv.slug}`,
    },
    twitter: { card: "summary_large_image", title: inv.title, description: inv.dek },
  };
  // A shared receipt link gets its own card with the sender's two inputs.
  if (slug === "attention") {
    const sp = await searchParams;
    const r = typeof sp.r === "string" ? sp.r : undefined;
    const h = typeof sp.h === "string" ? Number(sp.h) : NaN;
    if (r && Number.isFinite(h)) {
      const rec = computeReceipt(r, h);
      const img = `/api/og/receipt?r=${encodeURIComponent(rec.region.key)}&h=${rec.hoursPerDay}`;
      const desc = `An hour of attention in ${rec.region.short} sells for about ${money(rec.perHour)}, by Meta's own accounts. ${inv.dek}`;
      return {
        ...base,
        description: desc,
        openGraph: { ...base.openGraph, description: desc, images: [{ url: img, width: 1200, height: 630, alt: "A receipt for one hour of attention" }] },
        twitter: { ...base.twitter, description: desc, images: [img] },
      };
    }
  }
  return base;
}

export default async function InvestigationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = getInvestigation(slug);
  const Story = stories[slug];
  if (!inv || !Story) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: inv.title,
    description: inv.dek,
    datePublished: inv.published,
    articleSection: inv.desk,
    url: `${siteUrl}/investigations/${inv.slug}`,
    publisher: { "@type": "Organization", name: "Palimpsest", url: siteUrl },
    author: { "@type": "Organization", name: "Palimpsest" },
    isAccessibleForFree: true,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
