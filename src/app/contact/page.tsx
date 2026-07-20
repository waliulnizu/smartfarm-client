"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="text-4xl font-bold text-zinc-900">Contact Us</h1>
          <p className="mt-4 text-lg text-zinc-500">Have questions? We&apos;d love to hear from you.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">{"\uD83D\uDCE7"}</span>
              <h3 className="mt-2 font-semibold text-zinc-900">Email</h3>
              <p className="mt-1 text-sm text-zinc-500">hello@smartkhamar.com</p>
            </div>
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">{"\uD83D\uDCF1"}</span>
              <h3 className="mt-2 font-semibold text-zinc-900">Phone</h3>
              <p className="mt-1 text-sm text-zinc-500">+880 1700-000000</p>
            </div>
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">{"\uD83D\uDCCD"}</span>
              <h3 className="mt-2 font-semibold text-zinc-900">Address</h3>
              <p className="mt-1 text-sm text-zinc-500">Dhaka, Bangladesh</p>
            </div>
          </div>

          {sent ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center">
              <span className="text-4xl">{"\u2709\uFE0F"}</span>
              <p className="mt-3 text-lg font-semibold text-emerald-800">Message Sent!</p>
              <p className="text-sm text-emerald-600">We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-emerald-700 hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" required placeholder="Your Name" className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <input type="email" required placeholder="Your Email" className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <input type="text" placeholder="Subject" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              <textarea rows={5} required placeholder="Your Message" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              <button type="submit" className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Send Message</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
