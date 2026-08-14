interface SectionLabelProps {
  num?: string;
  children: React.ReactNode;
  className?: string;
}

/** The small mono eyebrow with a trailing hairline, used above every section. */
export function SectionLabel({ num, children, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {num && <span className="mono-label !text-acid">{num}</span>}
      <span className="mono-label">{children}</span>
      <span className="h-px w-12 bg-hairline sm:w-20" aria-hidden />
    </div>
  );
}
