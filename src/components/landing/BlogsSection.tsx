"use client";

import Link from "next/link";

const BLOGS = [
  { title: "10 Tips for Maximizing Milk Production", excerpt: "Learn how proper nutrition, regular scheduling, and health monitoring can boost your dairy yield by up to 40%.", date: "Jul 15, 2026", readTime: "5 min read" },
  { title: "Understanding Cow Pregnancy Cycles", excerpt: "A complete guide to cow gestation, calving preparation, and post-delivery care for healthy calves.", date: "Jun 28, 2026", readTime: "7 min read" },
  { title: "How AI is Changing Livestock Farming", excerpt: "From automated health alerts to predictive ROI analytics, discover how AI helps farmers make better decisions.", date: "Jun 10, 2026", readTime: "6 min read" },
];

export default function BlogsSection() {
  return (
    <section id="blog" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Latest from Our Blog</h2>
          <p className="mt-3 text-lg text-zinc-500">Farming tips, guides, and industry insights</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOGS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:shadow-md">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{b.date}</span>
                <span>&middot;</span>
                <span>{b.readTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{b.excerpt}</p>
              <Link href="#" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">Read More &rarr;</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
