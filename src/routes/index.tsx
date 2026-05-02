import { useEffect, useRef, useState } from "react";
import {
  Download,
  ExternalLink,
  Users,
  Layers,
  Package,
  Shield,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Navbar } from "@/components/Navbar";
import logo from "@/assets/ignis-logo.png";
import { supabase } from "@/integrations/supabase/client";

const DOWNLOAD_URL =
  "https://github.com/axolot12/traing/releases/download/v1.0/launcher.exe";
const PREVIEW_URL = "http://node1.ignismc.fun:25567";
const DISCORD_URL = "https://discord.gg/xrsRcBmFub";

const FEATURES = [
  {
    icon: Layers,
    title: "Multi-Version Support",
    desc: "Play any Minecraft version — from classic releases to the latest snapshots — all from one launcher.",
  },
  {
    icon: Package,
    title: "Modrinth Built-In",
    desc: "Browse, install and manage thousands of mods, modpacks and resource packs without ever leaving the app.",
  },
  {
    icon: Users,
    title: "Friends System",
    desc: "Add friends, see who's online, and join their world with a single click. It just works.",
  },
  {
    icon: Shield,
    title: "Cracked & Premium",
    desc: "Full support for both Microsoft accounts and offline play — your choice, your way.",
  },
  {
    icon: Sparkles,
    title: "Smooth & Lightweight",
    desc: "Built for performance. Minimal RAM usage, instant launches, zero bloat.",
  },
  {
    icon: Sparkles,
    title: "Premium Tab Logo",
    desc: "Tab logo are visible for all the users that are using our Ignis Launcher.",
  },
];

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [pulsing, setPulsing] = useState(false);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const [shrunk, setShrunk] = useState(false);

  // Load + subscribe to live download count
  useEffect(() => {
    let mounted = true;
    supabase
      .from("download_stats")
      .select("count")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (mounted && data) setCount(Number(data.count));
      });

    const channel = supabase
      .channel("download_stats")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "download_stats" },
        (payload) => {
          const next = (payload.new as { count: number }).count;
          if (typeof next === "number") setCount(next);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Detect when hero logo scrolls out
  useEffect(() => {
    const el = heroLogoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShrunk(!entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleDownloadClick = async () => {
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 500);
    const { data } = await supabase.rpc("increment_downloads");
    if (typeof data === "number") setCount(data);
  };

  return (
    <div id="top" className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Glow accents */}
      <div className="pointer-events-none absolute top-[-12rem] left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-gradient-brand opacity-20 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] w-[28rem] h-[28rem] rounded-full bg-gradient-brand opacity-15 blur-3xl animate-drift" />

      <main className="relative z-10 w-full px-6 sm:px-10 pt-32 pb-12 sm:pt-40 sm:pb-20">
        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <div ref={heroLogoRef}>
            <img
              src={logo}
              alt="Ignis Launcher logo"
              className={`animate-breathe w-32 h-32 sm:w-44 sm:h-44 mb-8 select-none transition-opacity ${
                shrunk ? "opacity-30" : "opacity-100"
              }`}
              draggable={false}
            />
          </div>

          <AnimatedTitle text="IGNIS LAUNCHER" />

          <p
            className="mt-6 max-w-xl text-base sm:text-lg text-foreground/80 animate-float-up"
            style={{ animationDelay: "1.2s" }}
          >
            The fastest, most beautiful Minecraft launcher — forged by{" "}
            <span className="text-gradient-brand font-semibold">IgnisTeam</span>.
          </p>

          {/* Download counter */}
          <div className="mt-10 animate-float-up" style={{ animationDelay: "1.4s" }}>
            <div className="glass rounded-2xl px-10 py-7 shadow-glow flex flex-col items-center min-w-[280px]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/70">
                <Download className="w-3.5 h-3.5" />
                Total Downloads
              </div>
              <div
                className={`mt-2 text-5xl sm:text-6xl font-black text-gradient-brand tabular-nums ${
                  pulsing ? "animate-count" : ""
                }`}
                aria-live="polite"
              >
                {count.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-foreground/60">Community downloads</div>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 animate-float-up"
            style={{ animationDelay: "1.6s" }}
          >
            <a
              href={DOWNLOAD_URL}
              onClick={handleDownloadClick}
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-4 font-bold text-primary-foreground shadow-glow animate-pulse-glow transition-transform hover:scale-105 active:scale-95"
            >
              <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
              Download Now
            </a>
            <a
              href={PREVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl glass px-8 py-4 font-semibold text-foreground transition hover:bg-secondary hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-5 h-5" />
              Live Preview
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-32 sm:mt-40 scroll-mt-24">
          <h2 className="text-center text-3xl sm:text-5xl font-black text-gradient-brand">
            PROVIDED FEATURES
          </h2>
          <p className="mt-4 text-center text-foreground/70 max-w-xl mx-auto">
            Every feature you need to play, mod, and connect — wrapped in a launcher that just works.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-primary/50 animate-float-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-brand mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Discord CTA */}
        <section id="support" className="mt-28 sm:mt-36 mb-12 scroll-mt-24">
          <div className="glass rounded-3xl p-10 sm:p-14 text-center shadow-glow">
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-brand">
              Need Support?
            </h2>
            <p className="mt-3 text-foreground/75 max-w-md mx-auto">
              Join our Discord — the IgnisTeam and the community are there to help, share builds, and shape what's next.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-4 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Join Discord
            </a>
          </div>

          <p className="mt-10 text-center text-xs text-foreground/60">
            © {new Date().getFullYear()} IgnisTeam. All rights reserved.
          </p>
        </section>
      </main>

      {/* Floating mini logo (appears after hero scrolls out) */}
      <div
        className={`fixed z-30 bottom-6 right-6 transition-all duration-700 ease-out pointer-events-none ${
          shrunk ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-50"
        }`}
        aria-hidden="true"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-brand blur-xl opacity-70" />
          <div className="relative glass rounded-full p-3 shadow-glow">
            <img
              src={logo}
              alt=""
              className="w-10 h-10 animate-breathe"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
