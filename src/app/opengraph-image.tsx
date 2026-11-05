import { frontImage, ogSize } from "@/lib/og";

export const alt = "Palimpsest. Don't tell people what to think. Give them something worth thinking about.";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return frontImage();
}
