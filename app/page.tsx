"use client";

import { useEffect, useRef, useState } from "react";

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

  // Hero tilt + hover / touch-friendly
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
  });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    if (isCoarse) {
      setTiltStyle({
        transform: "perspective(1400px) rotateX(8deg) rotateY(-10deg) scale(1.04)",
      });
      return;
    }

    // Desktop: idle floating animation even without hover
    let frameId: number;
    const start = performance.now();

    const animate = (time: number) => {
      if (!hovered) {
        const t = (time - start) / 1000;
        const idleX = Math.sin(t * 0.8) * 6;
        const idleY = Math.cos(t * 0.9) * 6;
        setTiltStyle({
          transform: `perspective(1400px) rotateX(${idleX}deg) rotateY(${idleY}deg) scale(1.06)`,
        });
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    function onMove(e: MouseEvent) {
      const current = heroRef.current;
      if (!current) return;

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
      cancelAnimationFrame(frameId);
    };
  }, [hovered]);

  return (
    <main className="bg-[#050506] text-slate-100 antialiased">
<style>{`
  /* marquee animation */
  @keyframes marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }

  .marquee-clip {
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 16px 0;
    position: relative;
  }
  .marquee-clip::-webkit-scrollbar { display: none; }

  /* base marquee speed (desktop) */
  .marquee-track { animation: marquee 28s linear infinite; }

  /* smoother vertical glow for the central line (used as separate element) */
  @keyframes expGlow {
    0%   { transform: translateY(-120%); opacity: 0; filter: blur(20px); }
    15%  { opacity: 0.85; filter: blur(14px); }
    45%  { transform: translateY(10%); opacity: 1; filter: blur(10px); }
    78%  { opacity: 0.75; filter: blur(16px); }
    100% { transform: translateY(220%); opacity: 0; filter: blur(22px); }
  }

  @keyframes subtleFadeUp { 0%{opacity:0; transform: translateY(8px);} 100%{opacity:1; transform: translateY(0);} }

  .glow-cyan { text-shadow: 0 0 14px rgba(6,182,212,0.18), 0 0 34px rgba(6,182,212,0.08); }
  .hero-glow-layer { filter: blur(80px); opacity: 0.9; will-change: transform, opacity; }

  .hero:hover .hero-rim {
    box-shadow: 0 40px 140px rgba(6,182,212,0.20), inset 0 0 60px rgba(6,182,212,0.06);
  }

  .exp-card { opacity: 0; animation: subtleFadeUp 520ms ease-out forwards; }
  .timeline-line { box-shadow: 0 0 90px rgba(6,182,212,0.06); }

  .skill-circle { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
  .skill-circle:hover { transform: translateY(-8px) scale(1.06); box-shadow: 0 30px 80px rgba(6,182,212,0.10); border-color: rgba(6,182,212,0.25); }

  /* marquee pills */
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
  .marquee-skill .skill-dot { transition: background 260ms ease, box-shadow 260ms ease; }
  .marquee-skill:hover .skill-dot {
    background: rgb(34,211,238);
    box-shadow: 0 0 18px rgba(34,211,238,0.55);
  }
  .marquee-skill:focus,
  .marquee-skill:active { outline: none; box-shadow: 0 12px 26px rgba(6,182,212,0.12); }

  /* hex stats */
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

  /* node pulse animation */
  @keyframes nodePulse {
    0% { transform: scale(1); opacity: 0.75; }
    40% { transform: scale(1.6); opacity: 0.18; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  /* hero mobile orbit + skill bob */
  @keyframes heroMobileOrbit {
    0% { transform: perspective(1400px) rotateX(8deg) rotateY(-10deg) translateY(0) scale(1.04); }
    50% { transform: perspective(1400px) rotateX(4deg) rotateY(-2deg) translateY(-10px) scale(1.06); }
    100% { transform: perspective(1400px) rotateX(8deg) rotateY(-10deg) translateY(0) scale(1.04); }
  }
  @keyframes skillBob {
    0% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }

  /* ---------- Layout behaviour ---------- */

  /* make the experience-wrapper the positioned container for nodes / line */
  .experience-wrapper { position: relative; }

  /* default (mobile-first) stacked layout */
  .exp-card { position: relative; }
  .exp-card-content { margin-left: 0; margin-right: 0; width: auto; }

  /* center line default: left side on mobile */
  .timeline-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.4rem;
    width: 2px;
    border-radius: 6px;
    background: linear-gradient(to bottom, rgba(34,211,238,0.95), rgba(30,41,59,0.85));
    box-shadow: 0 0 36px rgba(34,211,238,0.18);
    z-index: 10;
    transform: none;
  }

  /* the node (center dot) — single element per card */
  .timeline-node {
    position: absolute;
    top: 16px; /* entry default, overridden for desktop vertical centering */
    left: 1.4rem; /* mobile alignment */
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: radial-gradient(circle at 30% 30%, rgba(34,211,238,1), rgba(6,182,212,0.95));
    box-shadow: 0 6px 24px rgba(6,182,212,0.36), inset 0 -4px 8px rgba(0,0,0,0.35);
    border: 2px solid rgba(2,6,8,0.9);
    z-index: 30;
    transform: translate(-50%, -50%);
  }

  /* static outer ring built from ::before (keeps exact centering) */
  .timeline-node::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 22px);
    height: calc(100% + 22px);
    border-radius: 9999px;
    border: 2px solid rgba(34,211,238,0.12);
    pointer-events: none;
    mix-blend-mode: screen;
    filter: blur(0.6px);
    opacity: 0.95;
  }

  /* pulsing glow using ::after (only one pulse, matching center) */
  .timeline-node::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 40px);
    height: calc(100% + 40px);
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(34,211,238,0.18), transparent 40%);
    pointer-events: none;
    opacity: 0.9;
    animation: nodePulse 2300ms linear infinite;
    filter: blur(6px);
    z-index: 20;
  }

  /* mobile specifics */
  @media (max-width: 767px) {
    .marquee-track { animation-duration: 14s; }
    .hero-card { animation: heroMobileOrbit 10s ease-in-out infinite; }
    .skill-circle { animation: skillBob 4s ease-in-out infinite; }

    .timeline-line { left: 1.4rem; width: 2px; }
    .timeline-node { left: 1.4rem; width: 12px; height: 12px; }
    .exp-card-content { margin-left: 3.2rem !important; } /* indent content from line */
  }

  /* desktop layout (>= 768px) */
  @media (min-width: 768px) {
    /* center the main line */
    .timeline-line {
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      box-shadow: 0 0 80px rgba(34,211,238,0.14);
      background: linear-gradient(to bottom, #22d3ee 0%, #334155 45%, #0f172a 100%);
    }

    /* node centered on the center line */
    .timeline-node {
      left: 50% !important;
      width: 16px;
      height: 16px;
      transform: translate(-50%, -50%) !important;
    }

    /* SHIFT CARDS AWAY FROM CENTER so line remains visible */
    .exp-card { position: relative; }
    .exp-card:nth-child(odd) .exp-card-content {
      width: 45%;
      margin-left: 0;
      margin-right: auto;
      transform: translateX(-48px); /* pull left card away from center line */
    }
    .exp-card:nth-child(even) .exp-card-content {
      width: 45%;
      margin-left: auto;
      margin-right: 0;
      transform: translateX(48px); /* pull right card away from center */
    }

    /* vertical node placement: place node at card middle for better alignment */
    .exp-card .timeline-node {
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .experience-wrapper { padding: 0 2rem; }
  }
`}</style>




      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#001219] via-[#001e2e] to-[#071018]" />

        <video
          className="absolute inset-0 w-full h-full object-cover opacity-5 -z-30 pointer-events-none"
          src={"/chirag.png"}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left */}
            <div className="space-y-5 text-center lg:text-left animate-[subtleFadeUp_700ms_ease-out]">
              <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest">
                Open to work • Graphic Designer
              </div>

              <h1 className="text-[2.4rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-extrabold leading-[1.1] pb-1">
                <div>Chirag</div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 glow-cyan">
                  Kashyap
                </div>
              </h1>

              <p className="text-slate-300 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg font-medium">
                Graphic designer / video editor
              </p>

              <p className="text-slate-300 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed">
                I design packaging, thumbnails, social media posts and A+ visuals that tell brand stories and boost conversion.
                Clean visuals, strong hierarchy, measurable results.
              </p>

              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 mt-5 justify-center lg:justify-start">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg shadow-lg font-semibold hover:shadow-cyan-400/50 transition-all hover:scale-105"
                >
                  View Portfolio
                </a>

                <a
                  href="/cv.pdf"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 border-2 border-slate-700 rounded-lg text-slate-200 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all font-medium"
                >
                  Download CV
                </a>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="flex justify-center lg:justify-end relative mt-10 lg:mt-0">
              <div
                className="absolute -inset-24 sm:-inset-20 z-0 rounded-full pointer-events-none"
                style={{
                  filter: "blur(120px)",
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(6,182,212,0.24), transparent 18%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.16), transparent 22%)",
                  width: "820px",
                  height: "820px",
                }}
              />

              <div
                className="absolute -inset-32 z-0 rounded-full pointer-events-none"
                style={{
                  filter: "blur(180px)",
                  background: "radial-gradient(circle at 60% 30%, rgba(6,182,212,0.12), transparent 30%)",
                  width: "980px",
                  height: "980px",
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
                  transition: "transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                }}
                className="hero-card relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden bg-[#050815] border border-slate-800 shadow-2xl"
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

                <div className="absolute -left-5 -bottom-5 sm:-left-6 sm:-bottom-6 rounded-full p-2.5 sm:p-3 bg-[#020617] border border-cyan-600 shadow-lg text-cyan-300">
                  ★
                </div>
              </div>
            </div>
          </div>

          {/* MARQUEE */}
          <div className="mt-12 sm:mt-14 border-t border-slate-800 pt-6 sm:pt-8">
            <div className="relative marquee-clip">
              <div className="whitespace-nowrap will-change-transform marquee-track">
                <div className="inline-flex items-center gap-4 sm:gap-6 pr-6 sm:pr-8">
                  {marqueeSkills.concat(marqueeSkills).map((s, i) => {
                    const emphasize = ["Adobe Photoshop", "MS Excel", "Canva"].includes(s);
                    return (
                      <div
                        key={i}
                        tabIndex={0}
                        className={`marquee-skill inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-[#020819] border border-slate-700 text-xs sm:text-sm md:text-base text-slate-200 mr-3 sm:mr-4 ${
                          emphasize ? "scale-105 md:scale-110" : ""
                        }`}
                      >
                        <span
                          className={`skill-dot w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${
                            emphasize ? "bg-cyan-300" : "bg-slate-600"
                          }`}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 space-y-16 sm:space-y-20">
        {/* EXPERIENCE */}
        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-10">
            Professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              Experience
            </span>
          </h2>

          <div className="relative">
            {/* central line */}
            <div className="absolute left-1/2 md:left-1/2 max-md:left-4 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] md:w-[3px] bg-gradient-to-b from-cyan-400 via-slate-700 to-slate-900 timeline-line rounded" />

            {/* moving glow (smoother feel) */}
            <div className="absolute left-1/2 md:left-1/2 max-md:left-4 md:-translate-x-1/2 top-0 pointer-events-none">
              <div 
                className="w-[3px] h-[80px] rounded-full bg-gradient-to-b from-cyan-300 via-cyan-400 to-transparent opacity-90"
                style={{
                  animation: 'expGlow 12s ease-in-out infinite',
                  filter: 'blur(14px)',
                  boxShadow: '0 0 40px rgba(34,211,238,0.6), 0 0 80px rgba(34,211,238,0.3)'
                }}
              />
            </div>

            <div className="experience-wrapper space-y-12 sm:space-y-16 mt-6">
              {experienceFlow.map((ex, idx) => {
                return (
                  <div
                    key={ex.company}
                    className="exp-card relative w-full"
                    style={{ animationDelay: `${idx * 140}ms` }}
                  >
                    <div className="exp-card-content p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#041018] to-[#020a10] border border-slate-800 shadow-xl hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-300 hover:border-slate-700">
                      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-100">{ex.company}</h3>
                        <div className="text-xs sm:text-sm text-cyan-300 font-medium whitespace-nowrap">
                          {ex.period}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ex.desc}</p>
                    </div>

                    {/* node circle */}
                    <div className="timeline-node timeline-node-pulse" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="hex p-8 sm:p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3">
              EXPERIENCE
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              4+ yrs
            </div>
            <div className="text-slate-400 mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed">
              Packaging, branding and digital content for e-commerce.
            </div>
          </div>

          <div className="hex p-8 sm:p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3">
              PROJECTS
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              240+
            </div>
            <div className="text-slate-400 mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed">
              Campaigns, infographics, thumbnails & A+ content.
            </div>
          </div>

          <div className="hex p-8 sm:p-10 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="text-cyan-300 font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3">
              CLIENTS
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              80+
            </div>
            <div className="text-slate-400 mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed">
              Brands, sellers & startups.
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-8 sm:mb-10 text-center">
            Skills &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              Expertise
            </span>
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 sm:gap-8 place-items-center max-w-5xl mx-auto">
            {skills.map((s, idx) => (
              <div key={s} className="w-full max-w-[110px] sm:max-w-[120px] text-center">
                <div
                  className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#020617] to-[#041018] flex items-center justify-center mb-2.5 sm:mb-3 border-2 border-slate-700 skill-circle shadow-xl"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <span className="text-cyan-300 font-bold text-base sm:text-lg">
                    {s
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
                <div className="text-[0.65rem] sm:text-xs font-medium text-slate-200 leading-tight">
                  {s}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 mt-14 bg-gradient-to-b from-transparent to-[#020a10]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div className="text-xs sm:text-sm text-slate-400 text-center md:text-left">
            © 2025{" "}
            <span className="font-bold text-slate-200">Chirag Kashyap</span> —{" "}
            <span className="text-cyan-400">GRAPHIXPERT</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex gap-4">
              <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                LinkedIn
              </a>
              <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                Behance
              </a>
            </div>

            <div className="text-[0.7rem] sm:text-xs md:text-sm text-cyan-300 font-medium text-center">
              busineswithchirag267@gmail.com
            </div>
          </div>
        </div>
      </footer>

      <div className="h-20" />
    </main>
  );
}