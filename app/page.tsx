"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { SprintDemo } from '@/components/sprint-demo';
import { HeroDemo } from '@/components/hero-demo';
import { SkillPath } from '@/components/skill-path';

import {
  Sparkles, Flame, ArrowRight,
  Snowflake,
} from "lucide-react";
import { HowItWorks } from "@/components/how-it-work";
import { features, testimonials, stats, leaderboard } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function SprintIoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });


  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: string;
    duration: string;
    delay: string;
    fontSize: string;
  }>>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`,
      delay: `${Math.random() * 5}s`,
      fontSize: `${15 + Math.random() * 20}px`,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-10">

      {/* Snowfall Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
              fontSize: flake.fontSize,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(217,91%,60%,0.08)] blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(199,89%,48%,0.08)] blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(217,91%,60%,0.03)] blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Content */}
            <motion.div
              className="text-left lg:max-w-xl"
            >

              <motion.h1
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-[hsl(215,25%,15%)]"
              >
                Cool Mind,
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 font-black italic">
                  Sharp Skills.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-[hsl(215,15%,45%)] text-lg md:text-xl mb-10 leading-relaxed font-bold tracking-tight opacity-80"
              >
                Transform your learning into an exhilarating sprint. Earn XP, maintain streaks, unlock rewards, and compete with learners worldwide.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full sm:w-auto bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-base px-10 py-5 rounded-2xl font-black inline-flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95"
                >
                  Get started <ArrowRight size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => window.location.href = "/paths"}
                  className="w-full sm:w-auto border-2 border-[hsl(210,20%,88%)] bg-white/50 backdrop-blur-sm text-[hsl(215,25%,15%)] text-base px-10 py-5 rounded-2xl font-black hover:bg-white transition-all active:scale-95"
                >
                  Explore Paths
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="mt-14 inline-flex items-center gap-3"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-4 border-white bg-blue-${i * 100 + 100} shadow-sm flex items-center justify-center text-[10px] font-bold text-white`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">+2M</div>
                </div>
                <span className="text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider">Join millions learning now</span>
              </motion.div>
            </motion.div>

            {/* Right: Code Animation */}
            <motion.div
              className="relative lg:block"
            >
              <HeroDemo />
            </motion.div>
          </div>
        </div>

        {/* Decorations */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[5%] hidden xl:block opacity-20"
        >
          <div className="w-32 h-32 bg-indigo-500 rounded-full blur-[80px]" />
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">Core Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-4">
              Everything to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Fuel Your Journey</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[hsl(215,15%,45%)] text-lg max-w-xl mx-auto font-medium">
              A complete gamification engine designed to make learning irresistible.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center">
                    <f.icon className="text-[hsl(217,91%,60%)]" size={22} />
                  </div>
                  {f.xp && <span className="text-sm font-bold text-[hsl(217,91%,60%)] bg-[hsl(217,91%,60%,0.1)] rounded-full px-3 py-1 font-bold">{f.xp}</span>}
                  {f.streak && <span className="text-sm font-bold bg-[hsl(199,89%,48%,0.1)] text-[hsl(199,89%,48%)] rounded-full px-3 py-1">{f.streak}</span>}
                  {f.badge && <span className="text-sm font-bold bg-[hsl(217,91%,60%,0.1)] text-[hsl(217,91%,60%)] rounded-full px-3 py-1">{f.badge}</span>}
                </div>
                <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-2">{f.title}</h3>
                <p className="text-[hsl(215,15%,45%)] leading-relaxed font-medium">{f.desc}</p>
                {f.progress && (
                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[hsl(215,15%,45%)] font-semibold">Mastery Progress</span>
                      <span className="text-[hsl(217,91%,60%)] font-bold">{f.progress}%</span>
                    </div>
                    <div className="h-2 bg-[hsl(210,20%,90%)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <HowItWorks />
      <SkillPath />
      <SprintDemo />

      {/* ─── LEADERBOARD ─── */}
      <section id="leaderboard" className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-12">
            <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">Competition</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-4">
              Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Sprinters</span>
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-2xl overflow-hidden">
            {leaderboard.map((user, i) => (
              <motion.div
                key={user.rank}
                variants={fadeUp}
                custom={i}
                className="flex items-center justify-between px-8 py-5 border-b border-[hsl(210,20%,88%,0.3)] last:border-0 hover:bg-[hsl(217,91%,60%,0.05)] transition-colors"
              >
                <div className="flex items-center gap-5">
                  <span className={`text-2xl font-black w-8 ${user.rank <= 3 ? "text-[hsl(217,91%,60%)]" : "text-[hsl(215,15%,45%)]"}`}>
                    {user.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center text-sm font-bold text-[hsl(217,91%,60%)]">
                    {user.name.slice(0, 2)}
                  </div>
                  <span className="font-bold text-[hsl(215,25%,15%)]">{user.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[hsl(215,15%,45%)] flex items-center gap-1 font-semibold">
                    <Flame size={14} className="text-[hsl(199,89%,48%)]" /> {user.streak}d
                  </span>
                  <span className="font-extrabold text-[hsl(217,91%,60%)]">{user.xp} XP</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(215,25%,15%)]">
              Loved by <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] font-extrabold">Learners</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-white/60 backdrop-blur-sm border border-[hsl(210,20%,88%,0.5)] rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center text-sm font-bold text-[hsl(217,91%,60%)]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[hsl(215,25%,15%)] text-sm">{t.name}</p>
                    <p className="text-xs font-semibold text-[hsl(215,15%,45%)]">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-[hsl(215,15%,45%)] mb-3 font-medium leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Sparkles size={12} className="text-[hsl(217,91%,60%)]" />
                  <span className="font-bold text-[hsl(217,91%,60%)]">{t.xp}</span>
                  <span className="font-medium text-[hsl(215,15%,45%)]">earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[hsl(217,91%,60%)] mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-[hsl(215,15%,45%)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-3xl p-12 md:p-16 text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="w-16 h-16 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-[hsl(217,91%,60%)]" size={28} />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-[hsl(215,25%,15%)] mb-4">
              Ready to Start Your Sprint?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[hsl(215,15%,45%)] text-lg mb-8 max-w-lg mx-auto font-medium">
              Join millions of learners who&apos;ve transformed their habits. Your first Sprint is free.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <button onClick={() => window.location.href = "/dashboard"} className="bg-[hsl(217,91%,60%)] text-white text-base px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_60px_hsl(217,91%,60%,0.2)]">
                Begin Your Journey <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}