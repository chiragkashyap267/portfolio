// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Stronger 3D hero + amplified cyan glow + circular skill icons + full-height timeline glow.
 * Uses local hero image: /chirag.png
 */

export default function HomePage() {
  const marqueeSkills = [
    "Adobe Photoshop",
    "CorelDRAW",
    "MS Excel",
    "Adobe Illustrator",
    "Premiere Pro",
    "Canva",
    "After Effects",
    "Figma",
    "MS Word",
  ];

  const experienceFlow = [
    {
      company: "Kidcare Drugs Pvt Ltd",
      period: "2022 – 2023",
      desc: "Created packaging designs and pharma communication materials aligned with brand guidelines.",
    },
    {
      company: "Elem Consumer Tech Pvt Ltd",
      period: "2023 – 2025",
      desc: "Handled e-commerce visuals, A+ content and performance-driven creatives for consumer brands.",
    },
    {
      company: "Suvidha Foundation (NGO Internship)",
      period: "2 months",
      desc: "Designed awareness creatives and social campaigns to support NGO initiatives.",
    },
    {
      company: "Freelance Projects",
      period: "Ongoing",
      desc: "Working with clients on Fiverr, Upwork & PeoplePerHour for global branding and content.",
    },
  ];

  const skills = [
    "CorelDRAW",
    "MS Excel",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Premiere Pro",
    "Canva",
    "After Effects",
    "Figma",
    "MS Word",
  ];

  // Hero tilt + hover
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
  });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // stronger tilt for pronounced 3D
      const rotateY = (x - 0.5) * 24; // ±12deg
      const rotateX = (0.5 - y) * 24; // ±12deg
      const scale = hovered ? 1.08 : 1.045;
      setTiltStyle({
        transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      });
    }
    function onLeave() {
      setTiltStyle({ transform: "perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)" });
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [hovered]);

  return (
    <main className="bg-[#050506] text-slate-100 antialiased">
      <style>{`
        /* marquee */
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }

        /* vertical glow traveling down the timeline (covers full height) */
        @keyframes expGlow { 0% { transform: translateY(-30%); opacity:0 } 8% { opacity:1 } 100% { transform: translateY(120%); opacity:0 } }

        @keyframes subtleFadeUp { 0%{opacity:0; transform: translateY(8px);} 100%{opacity:1; transform: translateY(0);} }

        /* hero floating bloom */
        @keyframes slowFloat { 0%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} 100%{ transform: translateY(0);} }

        .glow-cyan { text-shadow: 0 0 14px rgba(6,182,212,0.18), 0 0 34px rgba(6,182,212,0.08); }

        /* stronger hero glow */
        .hero-glow-layer { filter: blur(80px); opacity: 0.9; will-change: transform, opacity; }

        /* hero hover extra rim */
        .hero:hover .hero-rim {
          box-shadow: 0 40px 140px rgba(6,182,212,0.20), inset 0 0 60px rgba(6,182,212,0.06);
        }

        /* experience card fade-in */
        .exp-card { opacity: 0; animation: subtleFadeUp 520ms ease-out forwards; }

        /* timeline line glow */
        .timeline-line { box-shadow: 0 0 90px rgba(6,182,212,0.06); }

        /* circular skill icon hover */
        .skill-circle { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
        .skill-circle:hover { transform: translateY(-8px) scale(1.06); box-shadow: 0 30px 80px rgba(6,182,212,0.10); border-color: rgba(6,182,212,0.25); }

        /* marquee skill hover effect */
        .marquee-skill { transition: all 350ms ease; }
        .marquee-skill:hover { 
          background: rgba(6,182,212,0.15); 
          border-color: rgba(6,182,212,0.5);
          transform: scale(1.15);
          box-shadow: 0 0 30px rgba(6,182,212,0.3);
        }
        .marquee-skill:hover .skill-dot { 
          background: rgb(34,211,238);
          box-shadow: 0 0 30px rgba(34,211,238,0.9);
        }
        .marquee-skill:hover span:last-child { 
          color: rgb(165,243,252);
        }

        /* honeycomb hexagon effect for stat boxes */
        .hex {
          background: linear-gradient(135deg, rgba(4,16,24,0.9), rgba(8,24,40,0.9));
          border: 1px solid rgba(100,116,139,0.3);
          position: relative;
          transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hex::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 180deg at 50% 50%, 
            rgba(6,182,212,0) 0deg,
            rgba(6,182,212,0.4) 90deg,
            rgba(59,130,246,0.4) 180deg,
            rgba(6,182,212,0.4) 270deg,
            rgba(6,182,212,0) 360deg
          );
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 400ms ease;
          z-index: -1;
          animation: rotateBorder 4s linear infinite paused;
        }
        .hex:hover::before {
          opacity: 1;
          animation-play-state: running;
        }
        .hex::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(6,182,212,0.05), rgba(59,130,246,0.05));
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 400ms ease;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }
        .hex:hover::after {
          opacity: 1;
        }
        .hex:hover {
          transform: translateY(-8px) scale(1.03);
          border-color: rgba(6,182,212,0.5);
          box-shadow: 0 20px 60px rgba(6,182,212,0.2), 0 0 80px rgba(6,182,212,0.1);
        }

        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#001219] via-[#001e2e] to-[#071018]" />

        {/* subtle background video (dev path) */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-5 -z-30 pointer-events-none"
          src={"public/chirag.png"}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <div className="text-sm text-slate-400 uppercase tracking-widest">Open to work • Graphic Designer</div>

              <h1 className="text-[3.2rem] md:text-[4.6rem] lg:text-[5.2rem] font-extrabold leading-none">
                <div>Chirag</div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 glow-cyan">Kashyap</div>
              </h1>

              <p className="text-slate-300 max-w-xl text-lg">Graphic designer / video editor</p>

              <p className="text-slate-300 max-w-2xl text-base">
                I design packaging, thumbnails, social media posts and A+ visuals that tell brand stories and boost conversion.
                Clean visuals, strong hierarchy, measurable results.
              </p>

              <div className="flex gap-4 mt-4">
                <Link href="/thumbnails" className="inline-flex items-center gap-2 bg-cyan-400 text-black px-6 py-3 rounded shadow-lg">
                  View Portfolio
                </Link>

                <a href="#" className="px-6 py-3 border border-slate-700 rounded text-slate-200 hover:border-cyan-400 transition">
                  Download CV
                </a>
              </div>
            </div>

            {/* Right: hero image + amplified multi-layer glow */}
            <div className="flex justify-center lg:justify-end relative">
              {/* bigger, multi-layered cyan glows behind image */}
              <div
                className="absolute -inset-20 z-0 rounded-full pointer-events-none"
                style={{
                  filter: "blur(120px)",
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(6,182,212,0.24), transparent 18%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.16), transparent 22%)",
                  width: "820px",
                  height: "820px",
                  transform: "translate3d(0,-30px,0)",
                  animation: "slowFloat 9s ease-in-out infinite",
                }}
              />

              <div
                className="absolute -inset-32 z-0 rounded-full pointer-events-none"
                style={{
                  filter: "blur(180px)",
                  background: "radial-gradient(circle at 60% 30%, rgba(6,182,212,0.12), transparent 30%)",
                  width: "980px",
                  height: "980px",
                  animation: "slowFloat 12s ease-in-out infinite",
                }}
              />

              <div
                ref={heroRef}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  ...tiltStyle,
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
                className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden bg-[#050815] border border-slate-800 shadow-2xl hero"
              >
                {/* strong rim that intensifies on hover (class hero-rim targeted by CSS) */}
                <div
                  className="absolute -inset-1 rounded-3xl hero-rim pointer-events-none"
                  style={{
                    boxShadow:
                      "0 30px 120px rgba(6,182,212,0.14), 0 60px 220px rgba(59,130,246,0.06), inset 0 0 60px rgba(0,0,0,0.6)",
                    transition: "box-shadow 260ms ease",
                  }}
                />

                {/* hero image uses uploaded local path */}
                <img
                  src="/chirag.png"
                  alt="Chirag Kashyap"
                  className="w-full h-full object-cover rounded-3xl transform transition-transform duration-700"
                  style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
                />

                {/* stronger cyan overlay on hover */}
                <div className="absolute inset-0 bg-cyan-400/12 opacity-0 hover:opacity-80 mix-blend-screen transition-opacity duration-350 pointer-events-none" />

                <div className="absolute -left-6 -bottom-6 rounded-full p-3 bg-[#020617] border border-cyan-600 shadow-lg text-cyan-300">
                  ★
                </div>
              </div>
            </div>
          </div>

          {/* MARQUEE */}
          <div className="mt-12 overflow-hidden border-t border-slate-800 pt-6">
            <div className="relative">
              <div className="whitespace-nowrap will-change-transform" style={{ animation: "marquee 28s linear infinite" }}>
                <div className="inline-flex items-center gap-6 pr-8">
                  {marqueeSkills.concat(marqueeSkills).map((s, i) => {
                    const emphasize = ["Adobe Photoshop", "MS Excel", "Canva"].includes(s);
                    return (
                      <div
                        key={i}
                        className={`marquee-skill inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#020819] border border-slate-700
                        text-base text-slate-200 mr-4 ${emphasize ? "scale-110 md:scale-125" : ""}`}
                      >
                        <span
                          className={`skill-dot w-3.5 h-3.5 rounded-full ${emphasize ? "bg-cyan-300 shadow-[0_0_26px_rgba(34,211,238,0.85)]" : "bg-slate-600"}`}
                        />
                        <span className={`${emphasize ? "font-semibold text-cyan-100" : ""}`}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* PROFESSIONAL EXPERIENCE (centered heading) */}
        <section>
          <h2 className="text-3xl font-extrabold text-center mb-8">
            Professional <span className="text-cyan-400">Experience</span>
          </h2>

          <div className="relative">
            {/* center vertical line spanning full section */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[4px] bg-slate-800 timeline-line rounded" />

            {/* moving glow element traveling full length */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0">
              <div className="w-2 h-[32vh] md:h-[28vh] lg:h-[30vh] rounded-full bg-gradient-to-b from-cyan-400 to-transparent opacity-95 animate-[expGlow_6s_linear_infinite]" />
            </div>

            {/* long wrapper so glow spans all items */}
            <div className="space-y-20 mt-6 min-h-[720px]">
              {experienceFlow.map((ex, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={ex.company}
                    className={`exp-card relative w-full md:flex md:items-start md:justify-between ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                    style={{ animationDelay: `${idx * 140}ms` }}
                  >
                    {/* Card */}
                    <div className="md:w-5/12 p-6 rounded-xl bg-[#041018] border border-slate-800 shadow-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{ex.company}</h3>
                        <div className="text-sm text-cyan-300">{ex.period}</div>
                      </div>
                      <p className="text-sm text-slate-300 mt-3">{ex.desc}</p>
                    </div>

                    {/* center marker */}
                    <div className="hidden md:block w-6 h-6 rounded-full bg-[#020617] border-2 border-cyan-400 absolute left-1/2 -translate-x-1/2 top-8 shadow-[0_0_24px_rgba(34,211,238,0.28)]" />

                    <div className="md:w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Honeycomb-like stat boxes (below timeline) */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hex p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-semibold mb-2">Experience</div>
            <div className="text-3xl md:text-4xl font-bold">5+ yrs</div>
            <div className="text-slate-400 mt-2">Packaging, branding and digital content for e-commerce.</div>
          </div>

          <div className="hex p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-semibold mb-2">Projects</div>
            <div className="text-3xl md:text-4xl font-bold">240+</div>
            <div className="text-slate-400 mt-2">Campaigns, infographics, thumbnails & A+ content.</div>
          </div>

          <div className="hex p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-semibold mb-2">Clients</div>
            <div className="text-3xl md:text-4xl font-bold">80+</div>
            <div className="text-slate-400 mt-2">Brands, sellers & startups.</div>
          </div>
        </section>

        {/* Skills — circular icon tiles */}
        <section>
          <h3 className="text-2xl font-semibold mb-8 text-center">Skills & Expertise</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 place-items-center max-w-5xl mx-auto">
            {skills.map((s) => (
              <div key={s} className="w-full max-w-[120px] text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#020617] to-[#041018] flex items-center justify-center mb-3 border-2 border-slate-700 skill-circle shadow-lg">
                  <span className="text-cyan-300 font-bold text-lg">{s.split(" ").map(x => x[0]).slice(0,2).join("")}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 leading-tight">{s}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-slate-400">
            © 2025 <span className="font-semibold text-slate-200">Chirag Kashyap</span> — GRAPHIXPERT
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex gap-3">
              <a href="#" className="hover:text-cyan-300">LinkedIn</a>
              <a href="#" className="hover:text-cyan-300">Behance</a>
            </div>

            <div className="text-xs md:text-sm text-cyan-300">BUSINESSWITHCHIRAG267@GMAIL.COM</div>
          </div>
        </div>
      </footer>

      <div className="h-24" />
    </main>
  );
}