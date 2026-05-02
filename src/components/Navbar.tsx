import { useEffect, useState } from "react";
import logo from "@/assets/ignis-logo.png";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Support", href: "#support" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-strong py-3" : "py-5"
      }`}
    >
      <nav className="w-full px-6 sm:px-10 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt=""
            className="w-7 h-7 transition-transform group-hover:rotate-12"
            style={{ filter: "drop-shadow(0 0 8px oklch(0.70 0.22 260 / 0.8))" }}
          />
          <span className="text-shimmer font-black text-lg tracking-tight">
            Ignis Launcher
          </span>
        </a>
        <ul className="hidden sm:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="relative transition-colors hover:text-foreground after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-brand after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
