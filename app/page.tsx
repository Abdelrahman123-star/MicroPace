"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

import {
  Sparkles, Zap, Flame, Target, Trophy, Star, ArrowRight,
  Snowflake, Shield, BarChart3, Globe,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const features = [
  { icon: Zap, title: "XP System", desc: "Earn experience points for every lesson, quiz, and challenge you complete.", xp: "+250 XP" },
  { icon: Flame, title: "Daily Streaks", desc: "Keep your streak alive with consistent daily learning. Don't break the chain.", streak: "🔥 47 days" },
  { icon: Trophy, title: "Rewards & Badges", desc: "Unlock exclusive badges and climb the leaderboard as you master new skills.", badge: "⭐ Elite" },
  { icon: Target, title: "Skill Paths", desc: "Follow curated learning paths designed by experts to master any subject.", progress: 78 },
];

// Add this with your other data arrays
const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineer",
    text: "This platform turned my random studying into a structured journey. 200-day streak and counting! The gamification is genuinely addictive.",
    xp: "45,200 XP",
    avatar: "AC"
  },
  {
    name: "Sarah Kim",
    role: "Product Designer",
    text: "The Sprint feature is addictive in the best way. I've never been this consistent with learning. It's transformed my career.",
    xp: "32,800 XP",
    avatar: "SK"
  },
  {
    name: "Marcus Rivera",
    role: "Data Scientist",
    text: "Leaderboard competition with friends keeps me going. Best investment in myself I've ever made.",
    xp: "28,400 XP",
    avatar: "MR"
  },
  {
    name: "Priya Sharma",
    role: "UX Researcher",
    text: "The skill paths are brilliantly designed. Each lesson builds on the last perfectly. I've gone from beginner to advanced in months.",
    xp: "38,100 XP",
    avatar: "PS"
  },
];

const stats = [
  { value: "2M+", label: "Active Learners" },
  { value: "500K+", label: "Sprints Completed" },
  { value: "98%", label: "Completion Rate" },
  { value: "4.9★", label: "User Rating" },
];

const leaderboard = [
  { rank: 1, name: "NovaCoder", xp: "52,340", streak: 186 },
  { rank: 2, name: "PixelMind", xp: "48,920", streak: 142 },
  { rank: 3, name: "ZenLearner", xp: "45,200", streak: 127 },
  { rank: 4, name: "ByteQuest", xp: "41,800", streak: 98 },
  { rank: 5, name: "SkillForge", xp: "38,500", streak: 89 },
];

// ─── Skill Paths Data ───
const skillPaths = [
  { name: "Frontend Mastery", progress: 82, modules: 24, icon: Globe },
  { name: "Data Science", progress: 65, modules: 32, icon: BarChart3 },
  { name: "System Design", progress: 43, modules: 18, icon: Shield },
  { name: "Database Design", progress: 28, modules: 28, icon: Sparkles },
];

// ─── Horizontal Scroll Component with Smooth Animation ───
function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Use a spring animation for smoother movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,    // Lower = smoother but slower
    damping: 25,      // Higher = less bounce
    mass: 0.8,        // Lower = faster response
    restDelta: 0.001  // When to stop animating
  });

  const x = useTransform(smoothProgress, [0, 1], ["10%", "-30%"]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div
        style={{ x }}
        className="flex gap-6 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
export default function ArcticFrostV1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Add spring for smooth progress bar animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  // ✅ FIX: Add state for snowflakes
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: string;
    duration: string;
    delay: string;
    fontSize: string;
  }>>([]);

  // ✅ FIX: Generate snowflakes only on client
  useEffect(() => {
    const flakes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`, // Faster falling
      delay: `${Math.random() * 5}s`,
      fontSize: `${15 + Math.random() * 20}px`, // Bigger flakes
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden">

      {/* ─── SCROLL PROGRESS BAR ─── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] z-[60] origin-left"
      />
      {/* ─── FLOATING NAV ─── */}
      <motion.nav
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 0.5, 1]),
          y: useTransform(scrollYProgress, [0, 0.05, 0.1], [-20, -10, 0]),
          backgroundColor: useTransform(
            scrollYProgress,
            [0, 0.05, 0.1],
            ['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)']
          ),
          backdropFilter: useTransform(
            scrollYProgress,
            [0, 0.05, 0.1],
            ['blur(0px)', 'blur(4px)', 'blur(12px)']
          ),
          borderColor: useTransform(
            scrollYProgress,
            [0, 0.05, 0.1],
            ['rgba(210,220,230,0)', 'rgba(210,220,230,0.3)', 'rgba(210,220,230,0.6)']
          )
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b shadow-lg pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <Snowflake className="text-[hsl(217,91%,60%)]" size={20} />
            <span className="font-bold text-[hsl(215,25%,15%)]">Arctic Sprint</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[hsl(215,15%,45%)]">
            <a href="#features" className="hover:text-[hsl(217,91%,60%)] transition-colors">Features</a>
            <a href="#paths" className="hover:text-[hsl(217,91%,60%)] transition-colors">Paths</a>
            <a href="#leaderboard" className="hover:text-[hsl(217,91%,60%)] transition-colors">Leaderboard</a>
            <a href="#testimonials" className="hover:text-[hsl(217,91%,60%)] transition-colors">Reviews</a>
          </div>
          <button className="bg-[hsl(217,91%,60%)] text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-[hsl(217,91%,55%)] transition-colors">
            Start Sprint
          </button>
        </div>
      </motion.nav>
      {/* Snowfall particles - FIXED */}
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-15">
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[hsl(217,91%,60%,0.1)] blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[hsl(199,89%,48%,0.1)] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(217,91%,60%,0.05)] blur-[150px]" />
        </motion.div>
        <motion.div style={{ y: heroY }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center justify-center gap-2 mb-8">
            <Snowflake className="text-[hsl(217,91%,60%)]" size={18} />
            <span className="text-xs uppercase tracking-[0.3em] text-[hsl(215,15%,45%)] font-bold">Gamified Learning Platform</span>
            <Snowflake className="text-[hsl(217,91%,60%)]" size={18} />
          </motion.div>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-6xl md:text-8xl font-bold mb-8 leading-[0.95] tracking-tight"
          >
            <span className="text-[hsl(215,25%,15%)]">Cool Mind,</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Sharp Skills.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-[hsl(215,15%,45%)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Transform your learning into an exhilarating sprint. Earn XP, maintain streaks, unlock rewards, and compete with learners worldwide.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[hsl(217,91%,60%)] text-white text-base px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_60px_hsl(217,91%,60%,0.2)]">
              Start a Sprint <ArrowRight size={18} />
            </button>
            <button className="border border-[hsl(210,20%,88%)] bg-[hsl(210,25%,96%)] text-[hsl(215,25%,15%)] text-base px-8 py-4 rounded-xl font-semibold hover:bg-[hsl(199,89%,48%,0.05)] transition-colors">
              Explore Paths
            </button>
          </motion.div>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-16 inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-full px-6 py-3"
          >
            <Sparkles className="text-[hsl(217,91%,60%)]" size={16} />
            <span className="text-sm font-semibold text-[hsl(215,25%,15%)]">Join 2M+ learners earning <span className="text-[hsl(217,91%,60%)] font-extrabold">50,000+ XP</span> daily</span>
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-16 hidden lg:block"
        >
          <div className="w-24 h-24 bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] rounded-2xl rotate-45 shadow-[inset_0_0_0_1px_hsl(217,91%,60%,0.15)]" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -15, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-16 hidden lg:block"
        >
          <div className="w-16 h-16 bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] rounded-xl rotate-12 shadow-[inset_0_0_0_1px_hsl(217,91%,60%,0.15)]" />
        </motion.div>
      </section>
      {/* ─── STATS BAR ─── */}
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



      {/* ─── SKILL PATHS (Choose Your Path) ─── */}
      <section id="paths" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">Learning Tracks</p>
            <h2 className="text-5xl md:text-6xl font-bold text-[hsl(215,25%,15%)]">
              Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Path</span>
            </h2>
          </div>
        </div>

        <HorizontalScroll>
          {[...skillPaths, ...skillPaths].map((path, i) => (
            <motion.div
              key={`${path.name}-${i}`}
              whileHover={{ y: -10, scale: 1.03 }}
              className="min-w-[320px] bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-3xl p-8 shadow-[inset_0_0_0_1px_hsl(217,91%,60%,0.15)] cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <path.icon className="text-[hsl(217,91%,60%)]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-2">{path.name}</h3>
              <p className="text-sm text-[hsl(215,15%,45%)] mb-1 font-semibold">{path.modules} Modules</p>
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[hsl(215,15%,45%)] font-semibold">Progress</span>
                  <span className="text-[hsl(217,91%,60%)] font-extrabold">{path.progress}%</span>
                </div>
                <div className="h-2 bg-[hsl(210,20%,90%)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${path.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + (i % 4) * 0.15, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </HorizontalScroll>
      </section>






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

      {/* ─── CTA ─── */}

      <section className="relative z-10 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-3xl p-12 md:p-16 text-center shadow-[0_0_60px_hsl(217,91%,60%,0.2)]"
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
              <button className="bg-[hsl(217,91%,60%)] text-white text-base px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_60px_hsl(217,91%,60%,0.2)]">
                Begin Your Journey <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Snowflake className="text-primary" size={22} />
                <span className="text-xl font-bold text-foreground">Arctic Sprint</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                The world&apos;s most engaging gamified learning platform.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Paths", "API"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Connect", links: ["Twitter", "Discord", "GitHub", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-bold text-foreground text-sm mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-medium">© 2026 Arctic Sprint. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-muted-foreground font-medium">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}