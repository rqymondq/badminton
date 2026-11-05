import { receiptImage } from "@/lib/og";
import { clampHours, regionByKey } from "@/stories/attention/figures";

/** Personalised share card for a receipt. Inputs are two public choices, nothing else. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = regionByKey(searchParams.get("r")).key;
  const hours = clampHours(Number(searchParams.get("h")));
  const res = await receiptImage({ region, hours });
  res.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
  return res;
}
