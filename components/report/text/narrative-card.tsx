import { paletteVars, type ReportPalette } from "../report-theme";

type NarrativeCardProps = {
  content: string;
  title?: string;
  palette?: Partial<ReportPalette>;
};

export function NarrativeCard({
  content,
  title = "Summary",
  palette,
}: NarrativeCardProps) {
  const themeStyle = paletteVars("narrative-card", palette);

  return (
    <article
      className="overflow-hidden border border-foreground/10 bg-[var(--narrative-card-background)] text-[var(--narrative-card-text)]"
      style={themeStyle}
    >
      <section className="relative min-h-[420px] p-5 md:min-h-[520px] md:p-10">
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--narrative-card-background)",
            backgroundImage:
              "linear-gradient(145deg, var(--narrative-card-background) 0%, var(--narrative-card-muted) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[430px] border border-white/15 bg-[var(--narrative-card-primary)] text-white shadow-2xl">
          <div className="h-px w-full bg-white/20" />
          <section className="space-y-7 px-7 pb-10 pt-12 md:px-9 md:pb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{title}</h2>
            <p className="text-lg leading-relaxed text-white/95 [text-wrap:pretty] md:text-[2rem] md:leading-[1.35]">{content}</p>
          </section>
        </div>
      </section>
    </article>
  );
}
