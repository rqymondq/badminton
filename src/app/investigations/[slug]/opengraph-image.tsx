import { investigationImage, frontImage, ogSize } from "@/lib/og";
import { getInvestigation, investigations } from "@/content/investigations";

export const alt = "How much of what you believe is actually yours? An investigation by Palimpsest.";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return investigations.map((i) => ({ slug: i.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = getInvestigation(slug);
  if (!inv) return frontImage();
  return investigationImage({ number: inv.number, desk: inv.desk, readingTime: inv.readingTime });
}
