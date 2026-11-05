import { sources } from "./data";
import { Sources as SourceList } from "@/components/story/Sources";

export function Sources() {
  return (
    <SourceList
      sources={sources}
      startHere={[
        "The Righteous Mind, chapters 2–4, for the elephant and the rider.",
        "Faust, Part I, scene i (“Night”), for the study and the four faculties.",
        "Mercier & Sperber (2011), for the hopeful view of reasoning.",
      ]}
    />
  );
}
