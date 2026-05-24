import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#analytics" className="hover:text-foreground">Analytics</a>
          <a href="#portfolio" className="hover:text-foreground">Portfolio</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-95"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
