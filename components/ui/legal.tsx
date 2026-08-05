import { Container } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";

/** Ruhige, gut lesbare Textspalte für die Rechtsseiten. */
export function LegalPage({
  crumb,
  eyebrow,
  title,
  lead,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader crumb={crumb} eyebrow={eyebrow} title={title} lead={lead} />
      <section className="bg-ink-800 py-20 md:py-28">
        <Container>
          <div className="max-w-3xl [&_a]:text-flame [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2:first-child]:mt-0 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-paper/70 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-paper/70">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
