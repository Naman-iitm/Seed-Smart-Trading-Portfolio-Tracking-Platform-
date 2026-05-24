export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L10 12 L14 16 L20 7" />
          <path d="M14 7 H20 V13" />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight">Seed</span>
    </div>
  );
}
