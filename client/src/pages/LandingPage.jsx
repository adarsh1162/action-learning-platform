import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Code2, Bug, Target, Shield, Gift, Briefcase, ArrowRight, Sparkles, Trophy, BookOpen, Brain, Flame, Zap, CheckCircle, TrendingUp, Award } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   AURORA BACKGROUND — animated color-shifting gradient background
   ═══════════════════════════════════════════════════════════════════ */
const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%]"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(108,92,231,0.15), transparent),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(239,159,39,0.08), transparent),
          radial-gradient(ellipse 50% 60% at 60% 80%, rgba(93,202,165,0.06), transparent)
        `,
        animation: 'aurora 15s ease-in-out infinite alternate',
      }}
    />
    <style>{`
      @keyframes aurora {
        0% { transform: translate(0, 0) rotate(0deg) scale(1); }
        33% { transform: translate(2%, -1%) rotate(1deg) scale(1.02); }
        66% { transform: translate(-1%, 2%) rotate(-0.5deg) scale(0.98); }
        100% { transform: translate(1%, -2%) rotate(0.5deg) scale(1.01); }
      }
    `}</style>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   GRID PATTERN — subtle dot grid overlay
   ═══════════════════════════════════════════════════════════════════ */
const GridPattern = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.03]"
    style={{
      backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   MOUSE GLOW CARD — card that tracks cursor and glows on hover
   ═══════════════════════════════════════════════════════════════════ */
const GlowCard = ({ children, className = '', glowColor = '108,92,231' }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`relative group ${className}`}
    >
      {/* Cursor glow */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor},0.12), transparent 40%)`,
          }}
        />
      )}
      {/* Border glow */}
      <div 
        className="absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor},0.25), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TEXT REVEAL — reveals text word-by-word on scroll
   ═══════════════════════════════════════════════════════════════════ */
const TextReveal = ({ children, className = '', as: Tag = 'div' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const words = children.split(' ');

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SECTION REVEAL
   ═══════════════════════════════════════════════════════════════════ */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════ */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseFloat(target);
    const isDecimal = target % 1 !== 0;
    const totalFrames = 120;
    const increment = end / totalFrames;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{typeof count === 'number' && count % 1 === 0 ? count.toLocaleString() : count}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════════════════ */
const Typewriter = ({ words }) => {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = words[idx];
    const speed = del ? 30 : 70;
    const t = setTimeout(() => {
      if (!del && chars < w.length) setChars(c => c + 1);
      else if (!del && chars === w.length) setTimeout(() => setDel(true), 2200);
      else if (del && chars > 0) setChars(c => c - 1);
      else { setDel(false); setIdx(i => (i + 1) % words.length); }
    }, speed);
    return () => clearTimeout(t);
  }, [chars, del, idx, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF9F27] to-[#F7DF1E] font-bold">
      {words[idx].substring(0, chars)}
      <span className="text-[#EF9F27] animate-pulse ml-0.5">|</span>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   HERO CODE WINDOW — premium code display with line-by-line reveal
   ═══════════════════════════════════════════════════════════════════ */
const HeroCodeWindow = () => {
  const codeLines = [
    { num: 1, tokens: [{ t: 'function ', c: '#C678DD' }, { t: 'solveProblem', c: '#61AFEF' }, { t: '(', c: '#ABB2BF' }, { t: 'challenge', c: '#E06C75' }, { t: ') {', c: '#ABB2BF' }] },
    { num: 2, tokens: [{ t: '  const ', c: '#C678DD' }, { t: 'skills', c: '#E06C75' }, { t: ' = ', c: '#56B6C2' }, { t: 'learn', c: '#61AFEF' }, { t: '(challenge);', c: '#ABB2BF' }] },
    { num: 3, tokens: [{ t: '  const ', c: '#C678DD' }, { t: 'bugs', c: '#E06C75' }, { t: ' = ', c: '#56B6C2' }, { t: 'findAndFix', c: '#61AFEF' }, { t: '(skills);', c: '#ABB2BF' }] },
    { num: 4, tokens: [{ t: '  const ', c: '#C678DD' }, { t: 'future', c: '#E06C75' }, { t: ' = ', c: '#56B6C2' }, { t: 'build', c: '#61AFEF' }, { t: '(bugs);', c: '#ABB2BF' }] },
    { num: 5, tokens: [{ t: '  return ', c: '#C678DD' }, { t: 'future', c: '#E06C75' }, { t: ';', c: '#ABB2BF' }] },
    { num: 6, tokens: [{ t: '}', c: '#ABB2BF' }] },
    { num: 7, tokens: [] },
    { num: 8, tokens: [{ t: 'solveProblem', c: '#61AFEF' }, { t: '(', c: '#ABB2BF' }, { t: '"your career"', c: '#98C379' }, { t: ');', c: '#ABB2BF' }] },
    { num: 9, tokens: [{ t: '// ✅ Output: job_ready === true', c: '#5C6370' }] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Multi-color glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#6C5CE7]/20 via-[#EF9F27]/10 to-[#5DCAA5]/20 rounded-3xl blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="relative bg-[#0c0d11]/90 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        {/* macOS chrome */}
        <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
          </div>
          <span className="text-[11px] text-white/20 font-mono">your-career.js</span>
          <div className="w-16" />
        </div>

        <div className="p-5 font-mono text-[13px] leading-[1.8]">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.12, duration: 0.4 }}
              className="flex"
            >
              <span className="w-8 text-right mr-5 text-white/10 select-none text-[12px]">{line.num}</span>
              <span className="min-h-[1.8em]">
                {line.tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MARQUEE — infinite scrolling logos/text
   ═══════════════════════════════════════════════════════════════════ */
const Marquee = ({ items, speed = 30 }) => (
  <div className="relative overflow-hidden py-6">
    <div className="flex animate-scroll gap-12" style={{ animationDuration: `${speed}s` }}>
      {[...items, ...items].map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-white/20 text-sm font-medium whitespace-nowrap">
          <span className="text-lg">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll { animation: scroll linear infinite; width: max-content; }
    `}</style>
    {/* Fade edges */}
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050506] to-transparent pointer-events-none z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050506] to-transparent pointer-events-none z-10" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
const LandingPage = ({ onOpenAuth }) => {
  const { scrollYProgress } = useScroll();
  
  // Progress bar at top
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const features = useMemo(() => [
    { icon: <BookOpen size={22} />, title: 'Structured JavaScript Roadmap', desc: 'From variables to async/await — a proven path that takes you from absolute zero to building full applications. No confusion, no dead ends.', color: '108,92,231', accent: '#6C5CE7' },
    { icon: <Target size={22} />, title: 'Real-World Problem Solving', desc: 'Build product filters, implement search, fix auth flows. Every challenge mirrors what companies actually need.', color: '239,159,39', accent: '#EF9F27' },
    { icon: <Bug size={22} />, title: 'Bug Hunting Missions', desc: 'Read broken production code. Find the bug. Fix it. This is the #1 skill that separates junior devs from senior devs.', color: '224,108,117', accent: '#E06C75' },
    { icon: <Brain size={22} />, title: 'AI-Powered Weakness Tracking', desc: 'Our AI analyzes every test you fail, maps your weak spots, and auto-schedules targeted revision into your Daily Warmup.', color: '97,175,239', accent: '#61AFEF' },
    { icon: <Shield size={22} />, title: 'Personalized Dashboard', desc: 'Track your streak, see your skill graph, monitor strong areas and weak spots — all in one command center.', color: '93,202,165', accent: '#5DCAA5' },
    { icon: <Briefcase size={22} />, title: 'Become Job-Ready', desc: 'Graduate with real projects, debugged codebases, and the confidence to ace any JavaScript interview.', color: '255,217,61', accent: '#FFD93D' },
  ], []);

  const reviews = useMemo(() => [
    { name: 'Aarav S.', role: 'Frontend Dev @ Razorpay', text: 'CodeCamp ka approach ekdum alag hai. Tutorials dekhne ki jagah seedha code mein haath gande karne padte hain. 3 mahine mein job mil gayi.', avatar: 'A' },
    { name: 'Priya P.', role: 'SDE-1 @ Flipkart', text: 'Bug-hunting missions are genius. No other platform teaches you to READ code before writing it. This single skill cracked my interview.', avatar: 'P' },
    { name: 'Rahul V.', role: 'Freelancer, Top Rated', text: 'Daily Warmup is addictive. 47-day streak and my JS confidence is through the roof. The AI Mentor is like having a senior dev on call 24/7.', avatar: 'R' },
    { name: 'Sneha K.', role: 'Full-Stack @ Zerodha', text: 'I tried FreeCodeCamp, Codecademy, YouTube — nothing stuck. CodeCamp made me actually CODE from day one. That made all the difference.', avatar: 'S' },
  ], []);

  const marqueeItems = useMemo(() => [
    { icon: '⚡', text: 'Real-World Challenges' },
    { icon: '🐛', text: 'Bug Hunting' },
    { icon: '🤖', text: 'AI Mentor' },
    { icon: '🔥', text: 'Daily Warmup' },
    { icon: '📊', text: 'Skill Tracking' },
    { icon: '🏆', text: 'Earn Rewards' },
    { icon: '🗺️', text: 'Structured Roadmap' },
    { icon: '💼', text: 'Job-Ready Portfolio' },
  ], []);

  return (
    <div className="relative bg-[#050506] text-white selection:bg-[#6C5CE7]/30">
      {/* Scroll progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6C5CE7] via-[#EF9F27] to-[#5DCAA5] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* ════════════════════════════════════════════════════════════
         HERO
         ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <AuroraBackground />
        <GridPattern />

        {/* Floating accent orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[15%] w-2 h-2 bg-[#6C5CE7] rounded-full shadow-[0_0_20px_rgba(108,92,231,0.6)]"
        />
        <motion.div 
          animate={{ y: [0, 15, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] left-[10%] w-1.5 h-1.5 bg-[#EF9F27] rounded-full shadow-[0_0_15px_rgba(239,159,39,0.6)]"
        />
        <motion.div 
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[30%] right-[25%] w-1 h-1 bg-[#5DCAA5] rounded-full shadow-[0_0_12px_rgba(93,202,165,0.6)]"
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto pt-16 pb-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl mb-10"
          >
            <div className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-pulse shadow-[0_0_8px_rgba(93,202,165,0.6)]" />
            <span className="text-[13px] font-medium text-white/50 tracking-wide">Action Learning Platform for JavaScript</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.03em] mb-8"
          >
            <span className="text-white">Stop watching</span>
            <br />
            <span className="text-white">tutorials.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c7ffa] via-[#6C5CE7] to-[#A78BFA]">
              Start building.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-white/35 mb-14 max-w-xl mx-auto leading-relaxed"
          >
            <span>Master JavaScript by </span>
            <Typewriter words={['debugging real code', 'building projects', 'solving challenges', 'hunting bugs', 'earning rewards']} />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={onOpenAuth}
              className="group relative px-10 py-4 bg-white text-black font-bold text-[15px] rounded-xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-[1.03]"
            >
              <span className="flex items-center gap-2.5">
                Start Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 text-white/50 font-medium text-[15px] rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:text-white/70 hover:bg-white/[0.02] transition-all duration-300"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Code Window */}
          <HeroCodeWindow />
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5"
          >
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2], height: [4, 8, 4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 bg-white/30 rounded-full" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         MARQUEE
         ════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.04] bg-[#050506]">
        <Marquee items={marqueeItems} speed={40} />
      </div>

      {/* ════════════════════════════════════════════════════════════
         STATS BAR
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#050506]">
        <Reveal className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Students', value: 10000, suffix: '+', color: '#6C5CE7' },
              { label: 'Challenges Completed', value: 250000, suffix: '+', color: '#EF9F27' },
              { label: 'Job Placements', value: 850, suffix: '+', color: '#5DCAA5' },
              { label: 'Student Rating', value: 4.9, suffix: '/5', color: '#FFD93D', isDecimal: true },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {stat.isDecimal ? `${stat.value}${stat.suffix}` : <Counter target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-[13px] text-white/25 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FEATURES — BENTO GRID
         ════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#6C5CE7]/[0.04] blur-[200px] rounded-full pointer-events-none" />
        <GridPattern />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-20">
            <p className="text-[13px] text-[#6C5CE7] font-semibold tracking-[0.2em] uppercase mb-4">Why CodeCamp</p>
            <TextReveal as="h2" className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Everything you need to become unstoppable
            </TextReveal>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {features.map((f, i) => {
              const spans = i === 0 ? 'md:col-span-4' : i === 1 ? 'md:col-span-2' : i === 2 ? 'md:col-span-2' : i === 3 ? 'md:col-span-4' : i === 4 ? 'md:col-span-3' : 'md:col-span-3';
              return (
                <Reveal key={i} delay={i * 0.08} className={spans}>
                  <GlowCard glowColor={f.color} className="rounded-2xl">
                    <div className="h-full bg-[#0a0b0e] border border-white/[0.04] rounded-2xl p-8 md:p-10">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                        style={{ background: `rgba(${f.color}, 0.08)`, color: f.accent }}
                      >
                        {f.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">{f.title}</h3>
                      <p className="text-[14px] text-white/30 leading-relaxed">{f.desc}</p>
                    </div>
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         ROADMAP — VISUAL TIMELINE
         ════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative bg-[#0a0b0e]/50">
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal className="text-center mb-20">
            <p className="text-[13px] text-[#F7DF1E] font-semibold tracking-[0.2em] uppercase mb-4">The Roadmap</p>
            <TextReveal as="h2" className="text-4xl md:text-6xl font-black tracking-tight text-white">
              From zero to job-ready in 6 steps
            </TextReveal>
          </Reveal>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {[
              { step: '01', title: 'JavaScript Fundamentals', desc: 'Variables, functions, loops, DOM — the foundation of everything.', color: '#6C5CE7' },
              { step: '02', title: 'Real-World Challenges', desc: 'Solve problems actual companies face every single day.', color: '#EF9F27' },
              { step: '03', title: 'Bug Hunting Missions', desc: 'Read broken code, diagnose the problem, ship the fix.', color: '#E06C75' },
              { step: '04', title: 'Project-Based Building', desc: 'Create portfolio-ready projects with real-world complexity.', color: '#5DCAA5' },
              { step: '05', title: 'AI-Powered Revision', desc: 'Our algorithm targets your exact weak spots. Nothing slips.', color: '#61AFEF' },
              { step: '06', title: 'Job-Ready Graduation', desc: 'Walk into interviews with proof of skill, not just certificates.', color: '#FFD93D' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block md:w-[45%]" />
                  {/* Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full border-2"
                      style={{ borderColor: item.color, boxShadow: `0 0 12px ${item.color}40` }}
                    />
                  </div>
                  {/* Content */}
                  <div className="ml-16 md:ml-0 md:w-[45%]">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2 block" style={{ color: item.color }}>
                      Step {item.step}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         MERCH
         ════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EF9F27]/[0.04] blur-[180px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <p className="text-[13px] text-[#EF9F27] font-semibold tracking-[0.2em] uppercase mb-4">Rewards</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                Code more.<br />Earn <span className="text-[#EF9F27]">real</span> rewards.
              </h2>
              <p className="text-white/30 text-[15px] leading-relaxed mb-10">
                Every challenge earns coins. Build streaks for multipliers. Redeem for exclusive CodeCamp merchandise delivered to your door. Learning was never this rewarding.
              </p>
              <div className="flex items-center gap-8 text-[13px] text-white/20">
                <span className="flex items-center gap-2"><Trophy size={14} className="text-[#EF9F27]" /> Solve → Earn</span>
                <span className="flex items-center gap-2"><Flame size={14} className="text-red-400" /> Streak → Multiply</span>
                <span className="flex items-center gap-2"><Gift size={14} className="text-[#5DCAA5]" /> Redeem → Flex</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '👕', name: 'Dev T-Shirt', coins: '1,500' },
                  { emoji: '☕', name: 'Coffee Mug', coins: '800' },
                  { emoji: '🧥', name: 'Dev Hoodie', coins: '3,000' },
                  { emoji: '🎒', name: 'Backpack', coins: '5,000' },
                ].map((item, i) => (
                  <GlowCard key={i} glowColor="239,159,39" className="rounded-2xl">
                    <div className="bg-[#0a0b0e] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center text-center h-full">
                      <span className="text-4xl mb-3">{item.emoji}</span>
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span className="text-[#EF9F27] text-xs mt-1 font-mono">{item.coins} 🪙</span>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         REVIEWS
         ════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0a0b0e]/50 relative">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#6C5CE7]/[0.03] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-[13px] text-white/20 font-semibold tracking-[0.2em] uppercase mb-4">Testimonials</p>
            <TextReveal as="h2" className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Real devs. Real results.
            </TextReveal>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <GlowCard glowColor="108,92,231" className="rounded-2xl h-full">
                  <div className="bg-[#0a0b0e] border border-white/[0.04] rounded-2xl p-7 h-full flex flex-col">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-[#EF9F27] fill-[#EF9F27]" />)}
                    </div>
                    <p className="text-[13px] text-white/40 leading-relaxed mb-6 flex-1">"{r.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8c7ffa] flex items-center justify-center text-[11px] font-bold">{r.avatar}</div>
                      <div>
                        <div className="text-[13px] font-semibold text-white">{r.name}</div>
                        <div className="text-[11px] text-white/20">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FINAL CTA
         ════════════════════════════════════════════════════════════ */}
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Massive centered glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#6C5CE7]/[0.08] blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EF9F27]/[0.04] blur-[150px] rounded-full pointer-events-none" />
        
        <Reveal className="relative z-10 text-center max-w-3xl mx-auto">
          <TextReveal as="h2" className="text-4xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[1.05]">
            Your career starts with one line of code.
          </TextReveal>
          <p className="text-xl text-white/25 mb-14">
            Join 10,000+ developers. Free forever. No credit card.
          </p>
          <button
            onClick={onOpenAuth}
            className="group relative px-14 py-5 bg-white text-black font-bold text-[16px] rounded-xl transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:scale-[1.04]"
          >
            <span className="flex items-center gap-3">
              Create Free Account
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </button>
          <p className="text-white/10 text-sm mt-8">100% free • No credit card • Cancel anytime</p>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FOOTER
         ════════════════════════════════════════════════════════════ */}
      <footer className="py-10 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-b from-[#8c7ffa] to-[#6C5CE7] flex items-center justify-center text-[10px] font-bold font-mono">&lt;/&gt;</div>
            <span className="font-bold text-white/60 text-sm">Code<span className="text-[#8c7ffa]">Camp</span></span>
          </div>
          <p className="text-white/10 text-[12px]">© 2025 CodeCamp. Built for developers who refuse to be average.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
