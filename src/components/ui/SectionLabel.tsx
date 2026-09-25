export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="section-label"><span>{number}</span><span className="label-rule" aria-hidden="true" />{children}</p>;
}
