"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ANIMAL_THEMES, AnimalType, useAnimalType } from "@/context/AnimalTypeContext";
import { getMe, UserProfile } from "@/services/api";
import api from "@/services/api";
import { SkeletonBlock } from "@/components/dashboard/Skeleton";

const NAV_ITEMS: { type: AnimalType; href: string }[] = [
  { type: "Cow", href: "/dashboard/cow" },
  { type: "Goat", href: "/dashboard/goat" },
  { type: "Hen", href: "/dashboard/hen" },
  { type: "Duck", href: "/dashboard/duck" },
];

const TYPE_COLOR: Record<AnimalType, { active: string; hover: string; ring: string }> = {
  Cow: { active: "bg-emerald-100 text-emerald-800 border-emerald-400", hover: "hover:bg-emerald-50", ring: "ring-emerald-200" },
  Goat: { active: "bg-amber-100 text-amber-800 border-amber-400", hover: "hover:bg-amber-50", ring: "ring-amber-200" },
  Hen: { active: "bg-yellow-100 text-yellow-800 border-yellow-400", hover: "hover:bg-yellow-50", ring: "ring-yellow-200" },
  Duck: { active: "bg-sky-100 text-sky-800 border-sky-400", hover: "hover:bg-sky-50", ring: "ring-sky-200" },
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setSelectedType } = useAnimalType();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    getMe()
      .then((profile) => {
        setUser(profile);
        setIsLoaded(true);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        router.replace("/login");
      });
  }, [router]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/cow")) setSelectedType("Cow");
    else if (pathname.startsWith("/dashboard/goat")) setSelectedType("Goat");
    else if (pathname.startsWith("/dashboard/hen")) setSelectedType("Hen");
    else if (pathname.startsWith("/dashboard/duck")) setSelectedType("Duck");
  }, [pathname, setSelectedType]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    api.post("/auth/logout").catch(() => {});
    router.replace("/login");
  }

  if (!isLoaded) {
    return (
      <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white p-4">
        <SkeletonBlock className="mb-6 h-8 w-40" />
        <div className="space-y-3">
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>
      </aside>
    );
  }

  const isValuation = pathname.startsWith("/dashboard/valuation");
  const isTeam = pathname.startsWith("/dashboard/user-management");

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <img src="/animals/cow.svg" alt="SmartKhamar" className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold text-zinc-900">SmartKhamar</h1>
            <p className="text-[10px] text-zinc-400">Farm Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Animals
        </p>
        {NAV_ITEMS.map(({ type, href }) => {
          const theme = ANIMAL_THEMES[type];
          const isActive = pathname.startsWith(href);
          const colors = TYPE_COLOR[type];

          return (
            <button
              key={type}
              onClick={() => router.push(href)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isActive
                  ? `${colors.active} border-current ring-2 ${colors.ring}`
                  : `border-transparent text-zinc-600 ${colors.hover} hover:text-zinc-900`
              }`}
            >
              <img src={theme.image} alt={type} className="h-6 w-6 object-contain" />
              <span>{theme.emoji} {type}</span>
            </button>
          );
        })}

        <div className="my-3 border-t border-zinc-100" />

        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Analytics
        </p>
        {user?.role === "Admin" && (
          <>
            <button
              onClick={() => router.push("/dashboard/valuation")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isValuation
                  ? "border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-200"
                  : "border-transparent text-zinc-600 hover:bg-violet-50 hover:text-violet-800"
              }`}
            >
              <span className="text-lg">{"\uD83D\uDCB0"}</span>
              <span>Asset & Valuation</span>
            </button>

            <div className="my-3 border-t border-zinc-100" />
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Admin
            </p>
            <button
              onClick={() => router.push("/dashboard/user-management")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isTeam
                  ? "border-red-400 bg-red-50 text-red-800 ring-2 ring-red-200"
                  : "border-transparent text-zinc-600 hover:bg-red-50 hover:text-red-800"
              }`}
            >
              <span className="text-lg">{"\uD83D\uDC65"}</span>
              <span>User Management</span>
            </button>
          </>
        )}
      </nav>

      <div className="border-t border-zinc-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 truncate">
            {user?.name || "..."}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
