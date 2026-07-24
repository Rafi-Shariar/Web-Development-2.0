import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bike,
  Tent,
  Mountain,
  Dumbbell,
  ArrowRight,
  Sparkles,
  Flame,
  Search,
} from "lucide-react";

export default async function HomePage() {
  const categories = [
    { icon: Bike, label: "Mountain Bikes", position: "top-[12%] left-[6%]", color: "text-emerald-500" },
    { icon: Tent, label: "Camping & Tents", position: "top-[28%] right-[8%]", color: "text-amber-500" },
    { icon: Mountain, label: "Climbing Gear", position: "bottom-[20%] left-[10%]", color: "text-indigo-500" },
    { icon: Dumbbell, label: "Fitness Equipment", position: "bottom-[18%] right-[12%]", color: "text-rose-500" },
    { icon: Flame, label: "Trekking & Hiking", position: "top-[15%] right-[28%]", color: "text-orange-500" },
  ];

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden bg-[#f8fafc]">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 70%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      {/* Floating Interactive Pill Badges */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {categories.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`absolute ${item.position} flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              <IconComponent className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex min-h-[70vh] flex-col items-center justify-center px-4 pt-8 text-center sm:px-6">
        {/* Subtle Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-700 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Don&apos;t buy for a weekend. Rent it.</span>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl/tight">
          Need gear for a few days? <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Just Rent It.
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Access high-end bikes, camping, fitness, and adventure gear without paying full price.
        </p>

        {/* Action Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild size="lg" className="h-12 rounded-full px-7 text-sm font-semibold shadow-md">
            <Link href="/products" className="flex items-center gap-2">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7 text-sm font-semibold border-slate-300">
            <Link href="/how-it-works" className="flex items-center gap-2 text-slate-700">
              <Search className="h-4 w-4 text-slate-500" />
              How Renting Works
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

