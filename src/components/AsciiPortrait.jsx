import { useEffect, useRef, useState } from 'react';

const CHARACTERS = ' .:-=+*#%@';
const PLACEHOLDER = '/assets/placeholders/portrait.svg';
const calculateSize = () => Math.min(360, Math.max(180, window.innerWidth - 80));

function sampleImage(image, size) {
  const buffer = document.createElement('canvas');
  buffer.width = size;
  buffer.height = size;
  const context = buffer.getContext('2d', { willReadFrequently: true });
  if (!context) return [];

  const scale = Math.min((size * 0.8) / image.width, (size * 0.8) / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
  const { data } = context.getImageData(0, 0, size, size);
  const fontSize = size <= 280 ? 5 : 7;
  const particles = [];

  for (let y = 0; y < size; y += fontSize * 1.1) {
    for (let x = 0; x < size; x += fontSize * 0.7) {
      const index = (Math.floor(y) * size + Math.floor(x)) * 4;
      if (data[index + 3] < 100) continue;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 765;
      particles.push({
        targetX: x,
        targetY: y,
        x: x + (Math.random() - 0.5) * size,
        y: y + (Math.random() - 0.5) * size,
        vx: 0,
        vy: 0,
        char: CHARACTERS[Math.max(1, Math.floor(brightness * (CHARACTERS.length - 1)))],
        alpha: ((0.4 + brightness * 0.6) * data[index + 3]) / 255,
      });
    }
  }
  return particles;
}

export default function AsciiPortrait({ src, alt }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState(calculateSize);

  useEffect(() => {
    const resize = () => setSize(calculateSize());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    context.scale(ratio, ratio);
    context.font = `${size <= 280 ? 5 : 7}px monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    let disposed = false;
    let animationId;
    let particles = [];
    let startedAt = 0;
    let settleUntil = 0;
    const mouse = { x: -1000, y: -1000, active: false };
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const draw = () => {
      if (disposed) return;
      context.clearRect(0, 0, size, size);
      const elapsed = (performance.now() - startedAt) / 1000;
      const reducedMotion = motionPreference.matches;
      const progress = reducedMotion ? 1 : Math.min(1, elapsed / 1.5);

      particles.forEach((particle) => {
        if (reducedMotion) {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
        } else {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (mouse.active && distance > 0 && distance < size * 0.2) {
            const force = (1 - distance / (size * 0.2)) * 3;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
          particle.vx = (particle.vx + (particle.targetX - particle.x) * 0.06) * 0.86;
          particle.vy = (particle.vy + (particle.targetY - particle.y) * 0.06) * 0.86;
          particle.x += particle.vx;
          particle.y += particle.vy;
        }
        context.fillStyle = `rgba(100, 255, 218, ${particle.alpha * progress})`;
        context.fillText(particle.char, particle.x, particle.y);
      });
      animationId =
        !reducedMotion && (performance.now() < settleUntil || mouse.active)
          ? requestAnimationFrame(draw)
          : undefined;
    };

    const start = () => {
      if (animationId !== undefined) cancelAnimationFrame(animationId);
      startedAt = performance.now();
      settleUntil = startedAt + 4000;
      animationId = requestAnimationFrame(draw);
    };
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (disposed) return;
      try {
        particles = sampleImage(image, size);
        start();
      } catch {
        if (image.getAttribute('src') !== PLACEHOLDER) image.src = PLACEHOLDER;
      }
    };
    image.onerror = () => {
      if (!disposed && image.getAttribute('src') !== PLACEHOLDER) image.src = PLACEHOLDER;
    };
    image.src = src || PLACEHOLDER;

    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) * size) / rect.width;
      mouse.y = ((event.clientY - rect.top) * size) / rect.height;
      mouse.active = true;
      if (animationId === undefined) animationId = requestAnimationFrame(draw);
    };
    const leave = () => {
      mouse.active = false;
      settleUntil = performance.now() + 2000;
      if (animationId === undefined) animationId = requestAnimationFrame(draw);
    };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    motionPreference.addEventListener('change', start);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      image.onload = null;
      image.onerror = null;
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      motionPreference.removeEventListener('change', start);
    };
  }, [src, size]);

  return (
    <canvas
      ref={canvasRef}
      className="simulation-container"
      role="img"
      aria-label={alt}
      style={{ width: size, height: 'auto' }}
    >
      {alt}
    </canvas>
  );
}
