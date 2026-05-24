import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/seed/Logo";
import { EquityChart } from "@/components/seed/EquityChart";
import { AllocationChart } from "@/components/seed/AllocationChart";
import { Sparkline } from "@/components/seed/Sparkline";
import { Delta } from "@/components/seed/Delta";
import {
  STOCKS,
  INDICES,
  PORTFOLIO,
  WATCHLIST,
  RECENT_ACTIVITY,
  equityCurve,
  getStock,
  portfolioMetrics,
} from "@/lib/market-data";
import { currency, signed } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Seed" },
      { name: "description", content: "Real-time stock tracking, watchlist, and portfolio performance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [watchlist, setWatchlist] = useState<string[]>(WATCHLIST);
  const [holdings, setHoldings] = useState(PORTFOLIO);
  const [query, setQuery] = useState("");

  const metrics = useMemo(() => portfolioMetrics(holdings), [holdings]);
  const curve = useMemo(() => equityCurve(), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const allocation = useMemo(
    () =>
      metrics.rows.map((r) => ({
        label: r.symbol,
        value: parseFloat(((r.value / metrics.marketValue) * 100).toFixed(2)),
      })),
    [metrics]
  );

  function addToWatchlist(symbol: string) {
    if (!watchlist.includes(symbol)) setWatchlist([symbol, ...watchlist]);
    setQuery("");
  }
  function removeFromWatchlist(symbol: string) {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  }
  function removeHolding(symbol: string) {
    setHoldings(holdings.filter((h) => h.symbol !== symbol));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center"><Logo /></Link>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              {["Overview", "Portfolio", "Watchlist", "Markets", "Activity"].map((n, i) => (
                <a
                  key={n}
                  href={`#${n.toLowerCase()}`}
                  className={`rounded-md px-3 py-1.5 ${i === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {n}
                </a>
              ))}
            </nav>
          </div>
          <div className="relative w-64">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbol or company"
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground/30"
            />
            {searchResults.length > 0 && (
              <div className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-md border border-border bg-popover shadow-md">
                {searchResults.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => addToWatchlist(s.symbol)}
                    className="flex w-full items-center justify-between border-b border-border px-3 py-2 text-left text-sm last:border-0 hover:bg-muted"
                  >
                    <div>
                      <div className="font-medium">{s.symbol}</div>
                      <div className="text-xs text-muted-foreground">{s.name}</div>
                    </div>
                    <div className="num text-sm">{currency(s.price)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {/* Market overview strip */}
        <section id="markets" className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INDICES.map((idx) => (
            <div key={idx.symbol} className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="text-xs text-muted-foreground">{idx.symbol}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="num text-base font-semibold">{idx.price.toLocaleString("en-US")}</div>
                <Delta value={idx.changePct} />
              </div>
            </div>
          ))}
        </section>

        {/* KPIs */}
        <section className="mb-5 grid gap-3 md:grid-cols-4">
          <Kpi label="Portfolio value" value={currency(metrics.marketValue)} />
          <Kpi
            label="Day change"
            value={signed(metrics.dayChange)}
            tone={metrics.dayChange >= 0 ? "pos" : "neg"}
          />
          <Kpi
            label="Total P/L"
            value={signed(metrics.totalPl)}
            tone={metrics.totalPl >= 0 ? "pos" : "neg"}
            sub={`${metrics.totalPlPct >= 0 ? "+" : ""}${metrics.totalPlPct.toFixed(2)}%`}
          />
          <Kpi label="Cost basis" value={currency(metrics.cost)} />
        </section>

        {/* Chart + Allocation */}
        <section id="overview" className="mb-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium">Performance</div>
                <div className="text-xs text-muted-foreground">90-day equity curve</div>
              </div>
              <div className="flex gap-1 text-xs">
                {["1W", "1M", "3M", "1Y", "All"].map((p) => (
                  <button
                    key={p}
                    className={`rounded px-2 py-1 ${p === "3M" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <EquityChart labels={curve.map((p) => p.label)} values={curve.map((p) => p.value)} height={260} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Allocation</div>
                <div className="text-xs text-muted-foreground">By position</div>
              </div>
            </div>
            <AllocationChart slices={allocation} height={180} />
            <ul className="mt-4 space-y-1.5 text-sm">
              {allocation.map((a, i) => (
                <li key={a.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: ["oklch(0.42 0.09 160)", "oklch(0.55 0.08 220)", "oklch(0.65 0.1 75)", "oklch(0.5 0.09 30)", "oklch(0.55 0.06 280)", "oklch(0.7 0.05 240)"][i % 6] }}
                    />
                    <span className="text-foreground">{a.label}</span>
                  </span>
                  <span className="num text-muted-foreground">{a.value.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Portfolio + Right column */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div id="portfolio" className="rounded-lg border border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="text-sm font-medium">Portfolio</div>
                <div className="text-xs text-muted-foreground">{holdings.length} positions</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Symbol</th>
                    <th className="px-4 py-2.5 text-right font-medium">Shares</th>
                    <th className="px-4 py-2.5 text-right font-medium">Avg cost</th>
                    <th className="px-4 py-2.5 text-right font-medium">Price</th>
                    <th className="px-4 py-2.5 text-right font-medium">Value</th>
                    <th className="px-4 py-2.5 text-right font-medium">P/L</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.rows.map((r) => (
                    <tr key={r.symbol} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.symbol}</div>
                        <div className="text-xs text-muted-foreground">{r.stock.name}</div>
                      </td>
                      <td className="num px-4 py-3 text-right">{r.shares}</td>
                      <td className="num px-4 py-3 text-right">{currency(r.avgCost)}</td>
                      <td className="num px-4 py-3 text-right">{currency(r.stock.price)}</td>
                      <td className="num px-4 py-3 text-right">{currency(r.value)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="num text-sm font-medium">
                          <span className={r.pl >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-destructive)]"}>
                            {signed(r.pl)}
                          </span>
                        </div>
                        <div className="text-xs">
                          <Delta value={r.plPct} />
                        </div>
                      </td>
                      <td className="pr-3 text-right">
                        <button
                          onClick={() => removeHolding(r.symbol)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Remove ${r.symbol}`}
                        >
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 5l10 10M15 5L5 15" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent activity */}
          <div id="activity" className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <div className="text-sm font-medium">Recent activity</div>
              <div className="text-xs text-muted-foreground">Last 5 events</div>
            </div>
            <ul className="divide-y divide-border">
              {RECENT_ACTIVITY.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <ActivityBadge type={a.type} />
                    <div>
                      <div className="font-medium">{a.symbol}</div>
                      <div className="text-xs text-muted-foreground">{a.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="num text-sm">{a.shares} @ {currency(a.price)}</div>
                    <div className="text-xs text-muted-foreground">{a.type}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Watchlist */}
        <section id="watchlist" className="mt-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-sm font-medium">Watchlist</div>
              <div className="text-xs text-muted-foreground">{watchlist.length} symbols · search to add</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Symbol</th>
                  <th className="px-4 py-2.5 font-medium">Sector</th>
                  <th className="px-4 py-2.5 text-right font-medium">Price</th>
                  <th className="px-4 py-2.5 text-right font-medium">Change</th>
                  <th className="px-4 py-2.5 text-right font-medium">% Change</th>
                  <th className="hidden px-4 py-2.5 text-right font-medium md:table-cell">30d</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {watchlist.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">Watchlist is empty. Use search to add symbols.</td></tr>
                )}
                {watchlist.map((sym) => {
                  const s = getStock(sym);
                  if (!s) return null;
                  return (
                    <tr key={sym} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{s.symbol}</div>
                        <div className="text-xs text-muted-foreground">{s.name}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.sector}</td>
                      <td className="num px-4 py-3 text-right">{currency(s.price)}</td>
                      <td className="num px-4 py-3 text-right">
                        <span className={s.change >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-destructive)]"}>
                          {signed(s.change)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right"><Delta value={s.changePct} /></td>
                      <td className="hidden px-4 py-3 text-right md:table-cell">
                        <div className="flex justify-end"><Sparkline data={s.history} positive={s.changePct >= 0} /></div>
                      </td>
                      <td className="pr-3 text-right">
                        <button
                          onClick={() => removeFromWatchlist(sym)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Remove ${sym}`}
                        >
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 5l10 10M15 5L5 15" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "pos" | "neg" }) {
  const color =
    tone === "pos" ? "text-[color:var(--color-success)]"
    : tone === "neg" ? "text-[color:var(--color-destructive)]"
    : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`num mt-1 text-xl font-semibold ${color}`}>{value}</div>
      {sub && <div className={`num text-xs ${color}`}>{sub}</div>}
    </div>
  );
}

function ActivityBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    BUY: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
    SELL: "bg-[color:var(--color-destructive)]/10 text-[color:var(--color-destructive)]",
    DIV: "bg-muted text-foreground",
  };
  return (
    <span className={`inline-flex h-7 w-10 items-center justify-center rounded text-[11px] font-semibold ${styles[type] ?? "bg-muted"}`}>
      {type}
    </span>
  );
}
