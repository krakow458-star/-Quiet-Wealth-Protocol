import React, { useEffect, useRef } from 'react';

export const BgCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: BgParticle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class BgParticle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedY: number = 0;
      speedX: number = 0;
      opacity: number = 0;
      pulse: number = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.1 + 0.3;
        this.speedY = Math.random() * 0.22 + 0.06;
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.opacity = Math.random() * 0.22 + 0.04;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.pulse += 0.014;
        if (this.y < -10 || this.x < -10 || this.x > canvas!.width + 10) this.reset();
      }

      draw() {
        const o = this.opacity + Math.sin(this.pulse) * 0.07;
        ctx!.fillStyle = `rgba(212, 175, 55, ${Math.max(0, o)})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 95) * 0.05})`;
            ctx.lineWidth = 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 55; i++) particles.push(new BgParticle());
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      id="bg-canvas"
    />
  );
};
