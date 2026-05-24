type Props = {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({ data, positive = true, width = 96, height = 28, className = "" }: Props) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => `${(i * stepX).toFixed(2)},${(height - ((v - min) / range) * height).toFixed(2)}`)
    .join(" ");
  const color = positive ? "var(--color-success)" : "var(--color-destructive)";
  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}
