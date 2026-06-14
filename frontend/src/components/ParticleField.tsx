import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
};

const PARTICLE_COUNT = 78;
const LINK_DISTANCE = 126;
const POINTER_RADIUS = 180;

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.navigator.userAgent.toLowerCase().includes('jsdom')) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const surface = canvas;
    const particles: Particle[] = [];

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        size: 1.2 + Math.random() * 1.8,
        hue: Math.random() > 0.38 ? 190 : 14
      };
    }

    function resize() {
      const rect = surface.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      surface.width = Math.floor(width * pixelRatio);
      surface.height = Math.floor(height * pixelRatio);
      ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (particles.length === 0) {
        for (let index = 0; index < PARTICLE_COUNT; index += 1) {
          particles.push(createParticle());
        }
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.hypot(dx, dy);
          if (distance < POINTER_RADIUS && distance > 0.01) {
            const pull = (1 - distance / POINTER_RADIUS) * 0.014;
            particle.vx += dx * pull;
            particle.vy += dy * pull;
          }
        }

        particle.vx *= 0.985;
        particle.vy *= 0.985;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a + 1; b < particles.length; b += 1) {
          const left = particles[a];
          const right = particles[b];
          const distance = Math.hypot(left.x - right.x, left.y - right.y);
          if (distance < LINK_DISTANCE) {
            const alpha = (1 - distance / LINK_DISTANCE) * 0.18;
            ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, POINTER_RADIUS);
        gradient.addColorStop(0, 'rgba(103, 232, 249, 0.12)');
        gradient.addColorStop(0.45, 'rgba(255, 90, 61, 0.06)');
        gradient.addColorStop(1, 'rgba(103, 232, 249, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, POINTER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const particle of particles) {
        ctx.fillStyle = particle.hue === 190 ? 'rgba(103, 232, 249, 0.72)' : 'rgba(255, 90, 61, 0.62)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    }

    function updatePointer(event: PointerEvent) {
      const rect = surface.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true
      };
    }

    function clearPointer() {
      pointerRef.current.active = false;
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', updatePointer);
    window.addEventListener('pointerleave', clearPointer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', clearPointer);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}
