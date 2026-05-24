import { Doughnut } from "react-chartjs-2";
import { ensureChartsRegistered } from "@/lib/charts";

ensureChartsRegistered();

type Slice = { label: string; value: number };

const PALETTE = [
  "oklch(0.42 0.09 160)",
  "oklch(0.55 0.08 220)",
  "oklch(0.65 0.1 75)",
  "oklch(0.5 0.09 30)",
  "oklch(0.55 0.06 280)",
  "oklch(0.7 0.05 240)",
];

export function AllocationChart({ slices, height = 220 }: { slices: Slice[]; height?: number }) {
  const data = {
    labels: slices.map((s) => s.label),
    datasets: [
      {
        data: slices.map((s) => s.value),
        backgroundColor: slices.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 8,
        displayColors: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
