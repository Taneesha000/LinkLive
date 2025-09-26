import React, { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';

export default function EngagementTrends() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Axes
      ctx.strokeStyle = 'rgba(75,85,99,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 10);
      ctx.lineTo(40, rect.height - 30);
      ctx.lineTo(rect.width - 10, rect.height - 30);
      ctx.stroke();

      // Trend line
      const points = Array.from({ length: 24 }, (_, i) => ({
        x: 40 + (i * (rect.width - 60)) / 23,
        y: rect.height - 30 - (Math.sin(i / 3) * 20 + i * 2 + Math.random() * 8)
      }));
      ctx.strokeStyle = 'rgba(34,211,238,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      // Fill gradient
      const grad = ctx.createLinearGradient(0, 0, 0, rect.height);
      grad.addColorStop(0, 'rgba(34,211,238,0.25)');
      grad.addColorStop(1, 'rgba(34,211,238,0.02)');
      ctx.fillStyle = grad;
      ctx.lineTo(rect.width - 10, rect.height - 30);
      ctx.lineTo(40, rect.height - 30);
      ctx.closePath();
      ctx.fill();
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex items-center space-x-3 mb-4">
        <TrendingUp className="text-cyan-400" size={24} />
        <div className="text-2xl font-bold text-white">Engagement Trends</div>
      </div>
      <div className="h-64 bg-gray-800/30 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-4 text-gray-400 text-sm">
        Engagement shows an upward trend with periodic spikes during collaboration hours.
      </div>
    </div>
  );
}


