import { investigationImage, frontImage, receiptImage, ogSize } from "@/lib/og";
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
  if (slug === "attention") return receiptImage({ region: "world", hours: 2 });
  return investigationImage({ number: inv.number, desk: inv.desk, readingTime: inv.readingTime });
}
