import { pct } from "@/lib/format";

export function Delta({ value, suffix = "%", className = "" }: { value: number; suffix?: string; className?: string }) {
  const positive = value >= 0;
  const color = positive ? "text-[color:var(--color-success)]" : "text-[color:var(--color-destructive)]";
  const text = suffix === "%" ? pct(value) : `${positive ? "+" : ""}${value.toFixed(2)}${suffix}`;
  return <span className={`num text-sm font-medium ${color} ${className}`}>{text}</span>;
}
