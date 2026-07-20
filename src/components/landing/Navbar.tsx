"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS_LOGGED_OUT = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

const NAV_LINKS_LOGGED_IN = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
<<<<<<< HEAD
  { href: "/items/add", label: "Add Cow" },
  { href: "/items/manage", label: "My Cows" },
=======
  { href: "/dashboard/cow", label: "Dashboard" },
>>>>>>> 8cfe7ef (Initial commit)
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = user ? NAV_LINKS_LOGGED_IN : NAV_LINKS_LOGGED_OUT;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
<<<<<<< HEAD
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">{"\uD83D\uDC04"}</span>
          <span className="text-lg font-bold text-emerald-800">SmartKhamar</span>
=======
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/animals/cow.svg" alt="SmartKhamar" className="h-8 w-8" />
          <span className="text-xl font-bold text-emerald-800">SmartKhamar</span>
>>>>>>> 8cfe7ef (Initial commit)
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-700">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-zinc-500">{user.name}</span>
              <Link href="/dashboard/cow" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:text-emerald-700">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 md:hidden hover:bg-zinc-100">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-emerald-100 bg-white px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-emerald-50">
              {l.label}
            </Link>
          ))}
          <hr className="my-2 border-zinc-100" />
          {user ? (
            <>
              <span className="block px-3 py-1 text-sm text-zinc-400">{user.name}</span>
              <Link href="/dashboard/cow" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 mt-1">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
