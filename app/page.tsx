"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
    "Photoshop",
    "Illustrator",
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
    const current = heroRef.current;
    if (!current) return; // ✅ TS is happy now

    const rect = current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 24;
    const rotateX = (0.5 - y) * 24;
    const scale = hovered ? 1.08 : 1.045;

    setTiltStyle({
      transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    });
  }

  function onLeave() {
    setTiltStyle({
      transform: "perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
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
        /* marquee animation */
        @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }

        /* FIXED: Added padding to prevent marquee clipping */
        .marquee-clip {
          overflow-x: hidden;
          overflow-y: hidden;
          padding: 16px 0;
          position: relative;
        }
        .marquee-clip::-webkit-scrollbar { display: none; }

        /* vertical glow traveling down the timeline */
        @keyframes expGlow { 0% { transform: translateY(-30%); opacity:0 } 8% { opacity:1 } 100% { transform: translateY(120%); opacity:0 } }
        @keyframes subtleFadeUp { 0%{opacity:0; transform: translateY(8px);} 100%{opacity:1; transform: translateY(0);} }
        @keyframes slowFloat { 0%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} 100%{ transform: translateY(0);} }

        .glow-cyan { text-shadow: 0 0 14px rgba(6,182,212,0.18), 0 0 34px rgba(6,182,212,0.08); }
        .hero-glow-layer { filter: blur(80px); opacity: 0.9; will-change: transform, opacity; }

        .hero:hover .hero-rim {
          box-shadow: 0 40px 140px rgba(6,182,212,0.20), inset 0 0 60px rgba(6,182,212,0.06);
        }

        .exp-card { opacity: 0; animation: subtleFadeUp 520ms ease-out forwards; }
        .timeline-line { box-shadow: 0 0 90px rgba(6,182,212,0.06); }

        .skill-circle { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
        .skill-circle:hover { transform: translateY(-8px) scale(1.06); box-shadow: 0 30px 80px rgba(6,182,212,0.10); border-color: rgba(6,182,212,0.25); }

        /* FIXED: Better marquee skill hover with proper spacing */
        .marquee-skill { 
          transition: transform 260ms ease, box-shadow 260ms ease, background 260ms ease; 
          -webkit-tap-highlight-color: transparent;
        }
        .marquee-skill:hover {
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.35);
          transform: scale(1.12);
          box-shadow: 0 18px 40px rgba(6,182,212,0.18);
        }
        .marquee-skill .skill-dot {
          transition: background 260ms ease, box-shadow 260ms ease;
        }
        .marquee-skill:hover .skill-dot {
          background: rgb(34,211,238);
          box-shadow: 0 0 18px rgba(34,211,238,0.55);
        }
        .marquee-skill:focus,
        .marquee-skill:active { outline: none; box-shadow: 0 12px 26px rgba(6,182,212,0.12); }

        /* FIXED: Honeycomb boxes - subtle cyan glow effect on hover */
        .hex {
          background: linear-gradient(135deg, rgba(4,16,24,0.95), rgba(8,24,40,0.95));
          border: 1px solid rgba(100,116,139,0.35);
          position: relative;
          transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        .hex:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: rgba(6,182,212,0.5);
          box-shadow: 
            0 0 40px rgba(6,182,212,0.3),
            0 0 80px rgba(6,182,212,0.15),
            0 20px 60px rgba(6,182,212,0.2),
            inset 0 0 60px rgba(6,182,212,0.05);
          background: linear-gradient(135deg, rgba(4,16,24,0.95), rgba(8,24,40,0.95), rgba(6,182,212,0.08));
        }

      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#001219] via-[#001e2e] to-[#071018]" />

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

              {/* FIXED: Added line-height and padding to prevent text clipping */}
              <h1 className="text-[3.2rem] md:text-[4.6rem] lg:text-[5.2rem] font-extrabold leading-[1.1] pb-2">
                <div>Chirag</div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 glow-cyan">
                  Kashyap
                </div>
              </h1>

              <p className="text-slate-300 max-w-xl text-lg font-medium">Graphic designer / video editor</p>

              <p className="text-slate-300 max-w-2xl text-base leading-relaxed">
                I design packaging, thumbnails, social media posts and A+ visuals that tell brand stories and boost conversion.
                Clean visuals, strong hierarchy, measurable results.
              </p>

              <div className="flex gap-4 mt-6">
                <Link href="/thumbnails" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-7 py-3.5 rounded-lg shadow-lg font-semibold hover:shadow-cyan-400/50 transition-all hover:scale-105">
                  View Portfolio
                </Link>

                <a href="#" className="px-7 py-3.5 border-2 border-slate-700 rounded-lg text-slate-200 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all font-medium">
                  Download CV
                </a>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="flex justify-center lg:justify-end relative">
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
                <div
                  className="absolute -inset-1 rounded-3xl hero-rim pointer-events-none"
                  style={{
                    boxShadow:
                      "0 30px 120px rgba(6,182,212,0.14), 0 60px 220px rgba(59,130,246,0.06), inset 0 0 60px rgba(0,0,0,0.6)",
                    transition: "box-shadow 260ms ease",
                  }}
                />

                <img
                  src="/chirag.png"
                  alt="Chirag Kashyap"
                  className="w-full h-full object-cover rounded-3xl transform transition-transform duration-700"
                  style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
                />

                <div className="absolute inset-0 bg-cyan-400/12 opacity-0 hover:opacity-80 mix-blend-screen transition-opacity duration-350 pointer-events-none" />

                <div className="absolute -left-6 -bottom-6 rounded-full p-3 bg-[#020617] border border-cyan-600 shadow-lg text-cyan-300">★</div>
              </div>
            </div>
          </div>

          {/* MARQUEE - FIXED with proper padding */}
          <div className="mt-16 border-t border-slate-800 pt-8">
            <div className="relative marquee-clip">
              <div className="whitespace-nowrap will-change-transform" style={{ animation: "marquee 28s linear infinite" }}>
                <div className="inline-flex items-center gap-6 pr-8">
                  {marqueeSkills.concat(marqueeSkills).map((s, i) => {
                    const emphasize = ["Adobe Photoshop", "MS Excel", "Canva"].includes(s);
                    return (
                      <div
                        key={i}
                        tabIndex={0}
                        className={`marquee-skill inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#020819] border border-slate-700 text-base text-slate-200 mr-4 ${emphasize ? "scale-110 md:scale-125" : ""}`}
                      >
                        <span className={`skill-dot w-3.5 h-3.5 rounded-full ${emphasize ? "bg-cyan-300" : "bg-slate-600"}`} />
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
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        <section>
          <h2 className="text-4xl font-extrabold text-center mb-12">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">Experience</span>
          </h2>

          <div className="relative">
            {/* FIXED: Cyan line goes all the way to bottom */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-[4px] bg-gradient-to-b from-cyan-400 via-slate-700 to-slate-800 timeline-line rounded shadow-[0_0_20px_rgba(6,182,212,0.3)]" />

            <div className="absolute left-1/2 -translate-x-1/2 top-0">
              <div className="w-2 h-[32vh] md:h-[28vh] lg:h-[30vh] rounded-full bg-gradient-to-b from-cyan-300 to-transparent opacity-95 animate-[expGlow_6s_linear_infinite]" />
            </div>

            <div className="space-y-20 mt-6 min-h-[720px]">
              {experienceFlow.map((ex, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={ex.company}
                    className={`exp-card relative w-full md:flex md:items-start md:justify-between ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    style={{ animationDelay: `${idx * 140}ms` }}
                  >
                    <div className="md:w-5/12 p-6 rounded-xl bg-gradient-to-br from-[#041018] to-[#020a10] border border-slate-800 shadow-xl hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-300 hover:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-100">{ex.company}</h3>
                        <div className="text-sm text-cyan-300 font-medium">{ex.period}</div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{ex.desc}</p>
                    </div>

                    <div className="hidden md:block w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 absolute left-1/2 -translate-x-1/2 top-8 shadow-[0_0_28px_rgba(34,211,238,0.4)] ring-4 ring-[#020617]" />

                    <div className="md:w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FIXED: Stats boxes with improved hover effect */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hex p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-sm tracking-wide mb-3">EXPERIENCE</div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">5+ yrs</div>
            <div className="text-slate-400 mt-3 text-sm leading-relaxed">Packaging, branding and digital content for e-commerce.</div>
          </div>

          <div className="hex p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-sm tracking-wide mb-3">PROJECTS</div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">240+</div>
            <div className="text-slate-400 mt-3 text-sm leading-relaxed">Campaigns, infographics, thumbnails & A+ content.</div>
          </div>

          <div className="hex p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-sm tracking-wide mb-3">CLIENTS</div>
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">80+</div>
            <div className="text-slate-400 mt-3 text-sm leading-relaxed">Brands, sellers & startups.</div>
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-extrabold mb-12 text-center">Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">Expertise</span></h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 place-items-center max-w-5xl mx-auto">
            {skills.map((s) => (
              <div key={s} className="w-full max-w-[120px] text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#020617] to-[#041018] flex items-center justify-center mb-3 border-2 border-slate-700 skill-circle shadow-xl">
                  <span className="text-cyan-300 font-bold text-lg">{s.split(" ").map(x => x[0]).slice(0,2).join("")}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 leading-tight">{s}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-800 mt-16 bg-gradient-to-b from-transparent to-[#020a10]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-sm text-slate-400">© 2025 <span className="font-bold text-slate-200">Chirag Kashyap</span> — <span className="text-cyan-400">GRAPHIXPERT</span></div>

          <div className="flex items-center gap-8 text-sm text-slate-400">
            <div className="flex gap-4">
              <a href="#" className="hover:text-cyan-300 transition-colors font-medium">LinkedIn</a>
              <a href="#" className="hover:text-cyan-300 transition-colors font-medium">Behance</a>
            </div>

            <div className="text-xs md:text-sm text-cyan-300 font-medium">BUSINESSWITHCHIRAG267@GMAIL.COM</div>
          </div>
        </div>
      </footer>

      <div className="h-24" />
    </main>
  );
}