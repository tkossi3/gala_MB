import { useEffect, useRef } from "react";

export default function ParticleBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, dpr, particles, rafId;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const density = window.innerWidth < 640 ? 45 : 90;

    function particleRGB() {
      return getComputedStyle(document.documentElement).getPropertyValue("--particle-color").trim() || "252, 246, 186";
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.8,
        baseAlpha: 0.15 + Math.random() * 0.5,
        speedY: 0.08 + Math.random() * 0.22,
        driftX: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2
      }));
    }

    let t = 0;
    function draw() {
      const rgb = particleRGB();
      ctx.clearRect(0, 0, width, height);
      t += 0.016;
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.driftX + Math.sin(t + p.phase) * 0.06;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = 0.6 + 0.4 * Math.sin(t * 1.4 + p.phase);
        const alpha = p.baseAlpha * twinkle;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!reducedMotion) rafId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    function onResize() { resize(); createParticles(); }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [theme]);

  return (
    <>
      <canvas id="particles-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
