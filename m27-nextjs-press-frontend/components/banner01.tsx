"use client";

import { useRef } from "react";
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
  Camera,
  Compass,
  Waves,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Expanded categories (8 tiles) with directional offsets for entrance
  const categories = [
    { icon: Bike, label: "Mountain Bikes", position: "top-[10%] left-[5%]", color: "text-emerald-500", from: { x: -80, y: -40 } },
    { icon: Tent, label: "Camping & Tents", position: "top-[22%] right-[6%]", color: "text-amber-500", from: { x: 80, y: -40 } },
    { icon: Mountain, label: "Climbing Gear", position: "bottom-[22%] left-[8%]", color: "text-indigo-500", from: { x: -80, y: 40 } },
    { icon: Dumbbell, label: "Fitness Equipment", position: "bottom-[16%] right-[10%]", color: "text-rose-500", from: { x: 80, y: 40 } },
    { icon: Flame, label: "Trekking & Hiking", position: "top-[12%] right-[30%]", color: "text-orange-500", from: { x: 0, y: -70 } },
    { icon: Camera, label: "Action Cameras", position: "top-[32%] left-[8%]", color: "text-sky-500", from: { x: -100, y: 0 } },
    { icon: Compass, label: "GPS & Nav", position: "bottom-[32%] right-[6%]", color: "text-teal-500", from: { x: 100, y: 0 } },
    { icon: Waves, label: "Water Sports", position: "bottom-[12%] left-[32%]", color: "text-cyan-500", from: { x: 0, y: 70 } },
  ];

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Hero Text & Buttons Entrance (Staggered)
      tl.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          ".hero-heading",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          ".hero-accent-text",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .from(
          ".hero-subtext",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.3"
        );

      // 2. Category Tiles Fly in from various directions
      tl.from(
        ".floating-tile",
        {
          x: (i) => categories[i].from.x,
          y: (i) => categories[i].from.y,
          opacity: 0,
          scale: 0.6,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // 3. Subtle floating loop idle animation for tiles
      gsap.to(".floating-tile", {
        y: "+=8",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.easeInOut",
        stagger: {
          amount: 1.5,
          from: "random",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-[70vh] w-full overflow-hidden bg-[#f8fafc]"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, #000 70%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      {/* Floating Interactive Pill Badges */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {categories.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`floating-tile absolute ${item.position} pointer-events-auto flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-xs backdrop-blur-md transition-shadow duration-300 hover:scale-105 hover:shadow-md`}
            >
              <IconComponent className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs font-semibold text-slate-700">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex min-h-[70vh] flex-col items-center justify-center px-4 pt-8 text-center sm:px-6">
        {/* Subtle Badge */}
        <div className="hero-badge mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-700 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Don&apos;t buy for a weekend. Rent it.</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl/tight">
          Need gear for a few days? <br />
          <span className="hero-accent-text inline-block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Just Rent It.
          </span>
        </h1>

        {/* <p className="hero-subtext mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Access high-end bikes, camping, fitness, and adventure gear without
          paying full price.
        </p> */}

        {/* Action Row */}
        <div className="hero-actions mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full px-7 text-sm font-semibold shadow-md"
          >
            <Link href="/products" className="flex items-center gap-2">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          
        </div>
      </div>
    </div>
  );
}