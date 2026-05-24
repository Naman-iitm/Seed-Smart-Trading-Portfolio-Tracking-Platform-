// Static seed dataset — no fake AI-generated noise, just realistic reference data
// used to demonstrate the UI. Values are illustrative.

export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;       // absolute change today
  changePct: number;    // % change today
  history: number[];    // last 30 closes
};

export type Holding = {
  symbol: string;
  shares: number;
  avgCost: number;
};

const series = (start: number, vol: number, n = 30): number[] => {
  const out: number[] = [];
  let v = start;
  // deterministic pseudo-random so chart is stable across renders
  let seed = start * 100;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < n; i++) {
    v = Math.max(1, v + (rand() - 0.5) * vol);
    out.push(parseFloat(v.toFixed(2)));
  }
  return out;
};

export const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 224.31, change: 1.82, changePct: 0.82, history: series(218, 3) },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 438.74, change: -2.16, changePct: -0.49, history: series(432, 5) },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Communication", price: 178.92, change: 0.65, changePct: 0.36, history: series(175, 3) },
  { symbol: "AMZN", name: "Amazon.com", sector: "Consumer", price: 198.45, change: 2.31, changePct: 1.18, history: series(190, 4) },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", price: 141.22, change: -1.04, changePct: -0.73, history: series(140, 4) },
  { symbol: "TSLA", name: "Tesla, Inc.", sector: "Automotive", price: 352.08, change: 4.92, changePct: 1.42, history: series(340, 8) },
  { symbol: "META", name: "Meta Platforms", sector: "Communication", price: 612.50, change: -3.45, changePct: -0.56, history: series(610, 6) },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials", price: 248.17, change: 0.94, changePct: 0.38, history: series(245, 2) },
  { symbol: "V", name: "Visa Inc.", sector: "Financials", price: 312.66, change: 1.21, changePct: 0.39, history: series(308, 2) },
  { symbol: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", price: 467.30, change: -0.55, changePct: -0.12, history: series(465, 3) },
];

export const INDICES = [
  { symbol: "S&P 500", price: 6018.43, changePct: 0.21 },
  { symbol: "Nasdaq", price: 19421.07, changePct: 0.34 },
  { symbol: "Dow Jones", price: 44512.10, changePct: -0.08 },
  { symbol: "Russell 2000", price: 2412.55, changePct: 0.62 },
];

export const PORTFOLIO: Holding[] = [
  { symbol: "AAPL", shares: 40, avgCost: 182.10 },
  { symbol: "MSFT", shares: 15, avgCost: 395.50 },
  { symbol: "NVDA", shares: 60, avgCost: 118.20 },
  { symbol: "TSLA", shares: 12, avgCost: 298.00 },
  { symbol: "JPM", shares: 25, avgCost: 220.40 },
];

export const WATCHLIST = ["GOOGL", "AMZN", "META", "V", "BRK.B"];

export const RECENT_ACTIVITY = [
  { id: 1, type: "BUY",  symbol: "NVDA", shares: 10, price: 140.10, date: "Today, 10:42" },
  { id: 2, type: "SELL", symbol: "META", shares: 5,  price: 615.20, date: "Today, 09:11" },
  { id: 3, type: "BUY",  symbol: "AAPL", shares: 20, price: 222.45, date: "Yesterday" },
  { id: 4, type: "DIV",  symbol: "JPM",  shares: 25, price: 1.25,   date: "Yesterday" },
  { id: 5, type: "BUY",  symbol: "MSFT", shares: 5,  price: 436.00, date: "2 days ago" },
];

export function getStock(symbol: string): Stock | undefined {
  return STOCKS.find((s) => s.symbol === symbol);
}

export function portfolioMetrics(holdings: Holding[]) {
  let marketValue = 0;
  let cost = 0;
  let dayChange = 0;
  const rows = holdings.map((h) => {
    const s = getStock(h.symbol)!;
    const value = s.price * h.shares;
    const c = h.avgCost * h.shares;
    const pl = value - c;
    const plPct = (pl / c) * 100;
    marketValue += value;
    cost += c;
    dayChange += s.change * h.shares;
    return { ...h, stock: s, value, cost: c, pl, plPct };
  });
  const totalPl = marketValue - cost;
  const totalPlPct = (totalPl / cost) * 100;
  return { rows, marketValue, cost, totalPl, totalPlPct, dayChange };
}

// 90-day equity curve (deterministic)
export function equityCurve(): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  let v = 100000;
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 89; i >= 0; i--) {
    v = v * (1 + (rand() - 0.48) * 0.012);
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(v.toFixed(2)),
    });
  }
  return out;
}
