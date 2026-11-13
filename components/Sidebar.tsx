"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { name: "Overview", icon: "⌂", href: "/" },
  { name: "Analytics", icon: "▥", href: "/analytics" },
  { name: "Transactions", icon: "⇄", href: "/transactions" },
  { name: "Customers", icon: "♧", href: null },
  { name: "Settings", icon: "⚙", href: null },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-full flex-col bg-[#22232D] px-5 py-7 text-white md:w-64">
      {/* Logo */}
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400 text-xl font-bold text-[#22232D]">
          P
        </div>

        <span className="text-2xl font-semibold tracking-wide">pulse</span>
      </div>

      {/* Navigation */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Main menu
      </p>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          const className = `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
            isActive
              ? "bg-violet-400/15 text-violet-300"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`;

          return item.href ? (
            <Link key={item.name} href={item.href} className={className}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ) : (
            <div
              key={item.name}
              className={`${className} cursor-not-allowed opacity-60`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 pt-6">
        <p className="text-xs text-gray-500">Pulse Analytics</p>
        <p className="mt-1 text-sm text-gray-300">Version 1.0</p>
      </div>
    </aside>
  );
}
