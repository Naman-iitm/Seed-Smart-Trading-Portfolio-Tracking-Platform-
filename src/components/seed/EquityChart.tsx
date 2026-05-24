import { Line } from "react-chartjs-2";
import { ensureChartsRegistered } from "@/lib/charts";

ensureChartsRegistered();

type Props = {
  labels: string[];
  values: number[];
  height?: number;
};

export function EquityChart({ labels, values, height = 240 }: Props) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "oklch(0.42 0.09 160)",
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return "rgba(60,130,90,0.08)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(60,130,90,0.18)");
          g.addColorStop(1, "rgba(60,130,90,0.00)");
          return g;
        },
        borderWidth: 1.75,
        fill: true,
        tension: 0.28,
        pointRadius: 0,
        pointHoverRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (c: { parsed: { y: number | null } }) =>
            `$${(c.parsed.y ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", maxTicksLimit: 6, font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: (v: string | number) => `$${Number(v).toLocaleString("en-US")}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Line data={data} options={options as any} />
    </div>
  );
}
