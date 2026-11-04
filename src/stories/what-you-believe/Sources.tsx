import { sources } from "./data";
import { Column, RegisterTag } from "@/components/story/Prose";

export function Sources() {
  const toVerify = sources.filter((s) => s.verify).length;
  return (
    <div id="sources" className="py-24 md:py-32">
      <Column>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mono text-fg-3">Sources &amp; further reading</p>
            <p className="display mt-4 text-[length:var(--step-3)]">Where this came from</p>
            <p className="mt-6 max-w-[36ch] text-[length:var(--step--1)] leading-relaxed text-fg-2">
              Each entry carries a register. <span className="register" data-level="established">Established</span>{" "}
              means a finding replicated or widely accepted in its field; <span className="register" data-level="theory">Theory</span>{" "}
              means an interpretive framework; <span className="register" data-level="contested">Contested</span>{" "}
              means a live scholarly dispute. Where we read a source in a particular way, the text says so.
            </p>
            <p className="mono-lc mt-6 max-w-[36ch] text-fg-3">
              {toVerify > 0 && (
                <>
                  Links marked <span className="text-accent">†</span> were compiled without live network access and should be checked before publication.
                </>
              )}
            </p>
            <div className="mt-10">
              <p className="mono text-fg-3">Start here</p>
              <ul className="mt-3 space-y-2 text-[length:var(--step--1)] text-fg-2">
                <li>The Righteous Mind, chapters 2–4, for the elephant and the rider.</li>
                <li>Faust, Part I, scene i (&ldquo;Night&rdquo;), for the study and the four faculties.</li>
                <li>Mercier &amp; Sperber (2011), for the hopeful view of reasoning.</li>
              </ul>
            </div>
          </div>

          <ol className="divide-y divide-rule border-t border-rule">
            {sources.map((s) => (
              <li key={s.n} id={`src-${s.n}`} className="grid scroll-mt-24 grid-cols-[2.5rem_1fr] gap-4 py-5">
                <span className="mono pt-1 text-fg-3">{String(s.n).padStart(2, "0")}</span>
                <div>
                  <p className="text-[length:var(--step-0)] leading-snug">
                    <span className="text-fg-2">{s.authors}</span> ({s.year}).{" "}
                    <a href={s.url} className="serif-text ink-link italic" rel="noopener noreferrer" target="_blank">
                      {s.title}
                    </a>
                    {s.verify && <span className="text-accent" title="Link compiled offline; verify before publication"> †</span>}
                  </p>
                  <p className="mono-lc mt-1 text-fg-3">{s.venue}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <RegisterTag level={s.register} />
                    {s.note && <p className="max-w-[60ch] text-[length:var(--step--1)] text-fg-2">{s.note}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Column>
    </div>
  );
}
