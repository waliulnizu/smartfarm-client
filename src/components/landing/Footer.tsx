"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{"\uD83D\uDC04"}</span>
              <span className="text-lg font-bold text-white">SmartKhamar</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">AI-powered farm management system for modern cattle farming in Bangladesh.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400">Home</Link></li>
              <li><Link href="/explore" className="hover:text-emerald-400">Explore Cows</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Dashboard</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/cow" className="hover:text-emerald-400">Cow Dashboard</Link></li>
              <li><Link href="/dashboard/goat" className="hover:text-emerald-400">Goat Dashboard</Link></li>
              <li><Link href="/dashboard/hen" className="hover:text-emerald-400">Hen Dashboard</Link></li>
              <li><Link href="/dashboard/duck" className="hover:text-emerald-400">Duck Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>hello@smartkhamar.com</li>
              <li>+880 1700-000000</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-lg bg-zinc-800 p-2 hover:bg-emerald-700"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></a>
              <a href="#" className="rounded-lg bg-zinc-800 p-2 hover:bg-emerald-700"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} SmartKhamar AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
