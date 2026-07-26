'use client'; // Required for GSAP to work in the App Router

import Image from 'next/image';
import React, { useRef, useEffect } from 'react';
import { Camera, Mountain, Bike, Tent, Dumbbell, Umbrella, GlassWater, BookOpenText } from 'lucide-react';
import gsap from 'gsap';
import { Button } from './ui/button';

const Hero = () => {
    // Reference for GSAP animation
    const gearUpRef = useRef<HTMLSpanElement>(null);

    // GSAP Animation: subtle vertical float on "GearUp"
    useEffect(() => {
    if (gearUpRef.current) {
        gsap.fromTo(
            gearUpRef.current,
            { 
                y: 60,         // Start 60px lower
                opacity: 0     // Start invisible
            },
            {
                y: 0,          // Move to original position
                opacity: 1,    // Fade in completely
                duration: 1.2, // Duration of the entrance animation
                ease: 'power3.out', // Smooth deceleration effect
                delay: 0.3,    // Slight delay after load for smoother feel
            }
        );
    }
}, []);

    // Configuration for product icons spread across the banner
    const icons = [
        { Icon: Mountain, className: "top-[15%] left-[10%] text-blue-300 w-10 h-10" },
        { Icon: Camera, className: "top-[40%] left-[8%] text-amber-200 w-8 h-8 rotate-12" },
        { Icon: Bike, className: "top-[70%] left-[15%] text-teal-300 w-12 h-12 -rotate-15" },
        { Icon: Tent, className: "top-[15%] right-[10%] text-green-300 w-10 h-10" },
        { Icon: BookOpenText, className: "top-[45%] left-[20%] text-green-300 w-9 h-9" },
        { Icon: Umbrella, className: "top-[35%] right-[12%] text-red-200 w-8 h-8 -rotate-12" },
        { Icon: Dumbbell, className: "top-[65%] right-[16%] text-purple-300 w-10 h-10 rotate-15" },
        { Icon: GlassWater, className: "top-[75%] right-[26%] text-purple-300 w-10 h-10 rotate-15" },
    ];

    return (
        <section className="relative w-full max-w-7xl mx-auto min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden rounded-3xl my-6 bg-[#0a1122] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            {/* Background Image: using 'priority' for LCP, no scaling, full cover */}
            <Image
                src="/b1.jpg"
                alt="Premium Outdoor Gear Background"
                fill
                priority
                unoptimized // Use this if not serving via Next.js optimized paths
                className="object-cover object-center"
            />

            {/* Optimized Gradient Overlay: subtle and modern */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70 mix-blend-multiply" />

            {/* Floating Product Icons ( Lucide React ) */}
            {icons.map(({ Icon, className }, index) => (
                <div key={index} className={`absolute ${className} z-0 opacity-80 backdrop-blur-sm p-1.5 rounded-full bg-white/25`}>
                    <Icon strokeWidth={1.5} className="w-full h-full" />
                </div>
            ))}

            {/* Hero Content (Centered) */}
            <div className="relative z-10 max-w-4xl px-8 py-16 text-center text-white flex flex-col items-center">
                
                {/* Headline: Less aggressive bolding, clear visual hierarchy */}
                <h1 className="text-xl md:text-3xl font-extralight tracking-tight leading-tight max-w-3xl">
                    Need a gear for a few days? Don&apos;t want to buy it?
                </h1>

                {/* The main focus: largest, animated text */}
                <div className="my-8 md:my-6 perspective-midrange">
                    <span
                        ref={gearUpRef}
                        className="block text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-teal-500 via-white to-white leading-none shadow-glow-teal"
                    >
                        ShareGear
                    </span>
                </div>

                {/* Minimal, professional supporting paragraph */}
                <p className="text-lg md:text-base text-gray-400 font-light max-w-2xl mb-12">
                    Instant access to premium hiking, camping, and sports equipment. Rent the best gear without the ownership cost. Easy, flexible, and always ready.
                </p>

                {/* Explore Button: Modern, animated CTA */}
                <Button> Explore Products</Button>
                
            </div>
        </section>
    );
};

export default Hero;