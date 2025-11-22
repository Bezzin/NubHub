import React, { useEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const colors = ['#fda4af', '#93c5fd', '#fcd34d', '#c4b5fd', '#ffffff'];
    const particles: any[] = [];

    // Create particles
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        velocity: {
          x: (Math.random() - 0.5) * 25,
          y: (Math.random() - 1) * 20
        },
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        friction: 0.95,
        gravity: 0.5,
        opacity: 1
      });
    }

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.velocity.x *= p.friction;
        p.velocity.y *= p.friction;
        p.velocity.y += p.gravity;
        
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.opacity <= 0 || p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50" 
      style={{ width: '100%', height: '100%' }}
    />
  );
};