import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/seed/SiteHeader";
import { Logo } from "@/components/seed/Logo";
import { EquityChart } from "@/components/seed/EquityChart";
import { Sparkline } from "@/components/seed/Sparkline";
import { Delta } from "@/components/seed/Delta";
import { STOCKS, equityCurve } from "@/lib/market-data";
import { currency } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seed — Smart Trading & Portfolio Tracker" },
      {
        name: "description",
        content:
          "Track stocks, manage your portfolio, and analyze performance with a clean, professional trading dashboard.",
      },
      { property: "og:title", content: "Seed — Smart Trading & Portfolio Tracker" },
      { property: "og:description", content: "A focused dashboard for tracking stocks, watchlists and portfolio performance." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const curve = equityCurve();
  const movers = [...STOCKS].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero — compact */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:py-16">
          <div className="flex flex-col justify-center">
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]" />
              Live market data
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              A focused dashboard for tracking stocks and your portfolio.
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Seed brings real-time prices, watchlists, profit and loss, and allocation
              insights into one clean workspace. No noise, no clutter.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
              >
                Open dashboard
              </Link>
              <a
                href="#features"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                See features
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
              <div>
                <div className="num text-lg font-semibold text-foreground">12,400+</div>
                <div className="text-xs text-muted-foreground">Symbols tracked</div>
              </div>
              <div>
                <div className="num text-lg font-semibold text-foreground">99.98%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="num text-lg font-semibold text-foreground">&lt; 250ms</div>
                <div className="text-xs text-muted-foreground">Quote latency</div>
              </div>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Portfolio value</div>
                <div className="num mt-1 text-2xl font-semibold">{currency(curve[curve.length - 1].value)}</div>
              </div>
              <Delta value={((curve[curve.length - 1].value / curve[0].value - 1) * 100)} />
            </div>
            <div className="pt-3">
              <EquityChart labels={curve.map((p) => p.label)} values={curve.map((p) => p.value)} height={200} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight">Everything you need to follow the market</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The essentials that traders and long-term investors actually use, without the bloat.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-[15px] font-medium text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics preview */}
      <section id="analytics" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight">Performance analytics</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Track returns over time, daily P/L, and benchmark performance against major
              indices. Visualizations stay clean and informative.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {["Time-weighted returns", "Daily P/L breakdown", "Benchmark comparison", "Sector exposure"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 md:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">90-day performance</div>
                <div className="num text-lg font-semibold">{currency(curve[curve.length - 1].value)}</div>
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
            <EquityChart labels={curve.map((p) => p.label)} values={curve.map((p) => p.value)} height={220} />
          </div>
        </div>
      </section>

      {/* Portfolio insights */}
      <section id="portfolio" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Portfolio insights</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Top movers in your watchlist, updated continuously.
              </p>
            </div>
            <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
              Go to dashboard →
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Symbol</th>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 text-right font-medium">Price</th>
                  <th className="px-4 py-2.5 text-right font-medium">Change</th>
                  <th className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">30d</th>
                </tr>
              </thead>
              <tbody>
                {movers.map((s) => (
                  <tr key={s.symbol} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{s.symbol}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.name}</td>
                    <td className="num px-4 py-3 text-right">{currency(s.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <Delta value={s.changePct} />
                    </td>
                    <td className="hidden px-4 py-3 text-right sm:table-cell">
                      <div className="flex justify-end">
                        <Sparkline data={s.history} positive={s.changePct >= 0} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-8 sm:flex-row sm:items-center">
          <div>
            <Logo />
            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              Seed is a portfolio tracking tool. Data shown is for demonstration and is not investment advice.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Product</a>
            <a href="#" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">Docs</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Seed Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[color:var(--color-success)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4 4 8-8" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Real-time stock tracking",
    desc: "Streaming quotes for thousands of symbols with low-latency updates.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l6-6 4 4 8-8" />
      </svg>
    ),
  },
  {
    title: "Watchlist management",
    desc: "Organize tickers into focused lists and monitor what matters to you.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3v18l7-4 7 4V3z" />
      </svg>
    ),
  },
  {
    title: "Portfolio P/L",
    desc: "Cost basis, day change and unrealized gains tracked automatically.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M5 8h11a3 3 0 010 6H8a3 3 0 000 6h11" />
      </svg>
    ),
  },
  {
    title: "Interactive charts",
    desc: "Performance curves, allocation breakdowns and historical context.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
      </svg>
    ),
  },
  {
    title: "Market overview",
    desc: "Major indices, sector heatmap and top movers all in one place.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: "Activity history",
    desc: "Buys, sells and dividends logged in a clean, searchable timeline.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];
