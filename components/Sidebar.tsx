"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

const navigationItems = [
  { name: "Overview", icon: "⌂", href: "/" },
  { name: "Analytics", icon: "▥", href: "/analytics" },
  { name: "Transactions", icon: "⇄", href: "/transactions" },
  { name: "Customers", icon: "♧", href: "/customers" },
  { name: "Settings", icon: "⚙", href: "/settings" },
];

function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        const className = `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
          isActive
            ? "bg-violet-400/15 text-violet-300"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={className}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE NAVIGATION */}
      <div className="relative z-50 w-full bg-[#22232D] text-white md:hidden">
        <div className="flex h-[72px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400 text-xl font-bold text-[#22232D]">
              P
            </div>

            <span className="text-2xl font-semibold tracking-wide">pulse</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition hover:bg-white/10"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-white/10 px-5 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Main menu
            </p>

            <Suspense
              fallback={
                <p className="text-sm text-gray-400">Loading navigation...</p>
              }
            >
              <SidebarNavigation
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </Suspense>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs text-gray-500">Pulse Analytics</p>
              <p className="mt-1 text-sm text-gray-300">Version 1.0</p>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-[#22232D] px-5 py-7 text-white md:flex">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400 text-xl font-bold text-[#22232D]">
            P
          </div>

          <span className="text-2xl font-semibold tracking-wide">pulse</span>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Main menu
        </p>

        <Suspense
          fallback={
            <p className="text-sm text-gray-400">Loading navigation...</p>
          }
        >
          <SidebarNavigation />
        </Suspense>

        <div className="mt-auto border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500">Pulse Analytics</p>
          <p className="mt-1 text-sm text-gray-300">Version 1.0</p>
        </div>
      </aside>
    </>
  );
}
