import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 70 : 140;

    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number };
    const particles: P[] = [];

    const spawn = (initial = false): P => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.9,
      r: 0.8 + Math.random() * 2.4,
      life: initial ? Math.random() * 300 : 0,
      max: 250 + Math.random() * 350,
      hue: 220 + Math.random() * 70, // blue → violet
    });

    for (let i = 0; i < particleCount; i++) particles.push(spawn(true));

    // Slow-drifting larger glow orbs
    type Orb = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    const orbs: Orb[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 80 + Math.random() * 140,
      hue: 230 + Math.random() * 60,
    }));

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // orbs
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = width + o.r;
        if (o.x > width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = height + o.r;
        if (o.y > height + o.r) o.y = -o.r;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(${o.hue}, 90%, 60%, 0.18)`);
        grad.addColorStop(1, `hsla(${o.hue}, 90%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const t = p.life / p.max;
        const alpha = Math.max(0, 1 - t) * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${alpha})`;
        ctx.fill();
        if (p.life >= p.max || p.y < -20) particles[i] = spawn();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
