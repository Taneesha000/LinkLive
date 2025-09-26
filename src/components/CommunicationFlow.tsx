import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Send, Users, TrendingUp } from 'lucide-react';

interface FlowParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'message' | 'reaction' | 'mention';
}

interface CommunicationHub {
  id: string;
  name: string;
  x: number;
  y: number;
  activity: number;
  type: 'person' | 'channel' | 'team';
}

export default function CommunicationFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [hubs, setHubs] = useState<CommunicationHub[]>([]);
  const [flowMetrics, setFlowMetrics] = useState({
    messagesPerHour: 147,
    activeChannels: 12,
    responseTime: '2.3m',
    engagement: 89
  });

  // Initialize communication hubs
  useEffect(() => {
    const newHubs: CommunicationHub[] = [
      { id: 'general', name: 'General', x: 200, y: 150, activity: 85, type: 'channel' },
      { id: 'dev-team', name: 'Dev Team', x: 400, y: 100, activity: 92, type: 'team' },
      { id: 'design', name: 'Design', x: 600, y: 200, activity: 78, type: 'channel' },
      { id: 'sarah', name: 'Sarah K.', x: 150, y: 300, activity: 95, type: 'person' },
      { id: 'alex', name: 'Alex C.', x: 350, y: 350, activity: 88, type: 'person' },
      { id: 'marketing', name: 'Marketing', x: 550, y: 300, activity: 71, type: 'team' },
      { id: 'updates', name: 'Updates', x: 300, y: 450, activity: 45, type: 'channel' }
    ];
    setHubs(newHubs);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleId = 0;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Generate new particles
      if (Math.random() < 0.3 && hubs.length > 0) {
        const sourceHub = hubs[Math.floor(Math.random() * hubs.length)];
        const targetHub = hubs[Math.floor(Math.random() * hubs.length)];
        
        if (sourceHub.id !== targetHub.id) {
          const types: FlowParticle['type'][] = ['message', 'reaction', 'mention'];
          const colors = ['#22d3ee', '#a855f7', '#f59e0b'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          const newParticle: FlowParticle = {
            id: particleId++,
            x: sourceHub.x,
            y: sourceHub.y,
            vx: (targetHub.x - sourceHub.x) * 0.02,
            vy: (targetHub.y - sourceHub.y) * 0.02,
            life: 100,
            maxLife: 100,
            size: type === 'message' ? 4 : type === 'reaction' ? 2 : 3,
            color: colors[types.indexOf(type)],
            type
          };

          setParticles(prev => [...prev.slice(-100), newParticle]);
        }
      }

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          vx: particle.vx * 0.99,
          vy: particle.vy * 0.99
        })).filter(particle => particle.life > 0);

        // Draw particles
        updatedParticles.forEach(particle => {
          const opacity = particle.life / particle.maxLife;
          ctx.fillStyle = particle.color.replace(')', `, ${opacity})`).replace('#', 'rgba(').replace(/^rgba\((.{6})/, (_, hex) => {
            const r = parseInt(hex.substr(0,2), 16);
            const g = parseInt(hex.substr(2,2), 16);
            const b = parseInt(hex.substr(4,2), 16);
            return `rgba(${r}, ${g}, ${b}`;
          });

          if (particle.type === 'message') {
            ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
          } else {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }

          // Trail effect
          if (particle.type === 'message') {
            ctx.fillStyle = particle.color.replace(')', `, ${opacity * 0.3})`).replace('#', 'rgba(');
            for (let i = 1; i <= 3; i++) {
              ctx.beginPath();
              ctx.arc(
                particle.x - particle.vx * i * 5,
                particle.y - particle.vy * i * 5,
                particle.size * (1 - i * 0.2),
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        });

        return updatedParticles;
      });

      // Draw connection lines between hubs
      hubs.forEach((hub, i) => {
        hubs.slice(i + 1).forEach(otherHub => {
          const distance = Math.sqrt(
            Math.pow(hub.x - otherHub.x, 2) + Math.pow(hub.y - otherHub.y, 2)
          );
          
          if (distance < 250) {
            const opacity = Math.max(0, (250 - distance) / 250) * 0.1;
            ctx.strokeStyle = `rgba(107, 114, 128, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hub.x, hub.y);
            ctx.lineTo(otherHub.x, otherHub.y);
            ctx.stroke();
          }
        });
      });

      // Draw hubs
      hubs.forEach(hub => {
        const pulseIntensity = (hub.activity / 100) * 0.3 + 0.7;
        const radius = hub.type === 'person' ? 12 : hub.type === 'team' ? 16 : 10;
        
        // Outer glow based on activity
        ctx.fillStyle = `rgba(34, 211, 238, ${hub.activity / 400})`;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, radius * 2 * pulseIntensity, 0, Math.PI * 2);
        ctx.fill();

        // Main hub circle
        const colors = {
          person: '#a855f7',
          team: '#22d3ee', 
          channel: '#f59e0b'
        };
        
        ctx.fillStyle = colors[hub.type];
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Hub border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Activity indicator
        if (hub.activity > 70) {
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(hub.x + radius * 0.6, hub.y - radius * 0.6, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hubs]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowMetrics(prev => ({
        messagesPerHour: prev.messagesPerHour + Math.floor((Math.random() - 0.5) * 20),
        activeChannels: Math.max(8, Math.min(16, prev.activeChannels + Math.floor((Math.random() - 0.5) * 2))),
        responseTime: `${(2.3 + (Math.random() - 0.5) * 1).toFixed(1)}m`,
        engagement: Math.max(70, Math.min(95, prev.engagement + Math.floor((Math.random() - 0.5) * 10)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <MessageCircle className="text-cyan-400" size={24} />
          <span>Communication Flow</span>
        </h2>
        
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-cyan-400 text-xl font-bold">{flowMetrics.messagesPerHour}</div>
            <div className="text-gray-400 text-xs">Messages/Hour</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 text-xl font-bold">{flowMetrics.activeChannels}</div>
            <div className="text-gray-400 text-xs">Active Channels</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-xl font-bold">{flowMetrics.responseTime}</div>
            <div className="text-gray-400 text-xs">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold">{flowMetrics.engagement}%</div>
            <div className="text-gray-400 text-xs">Engagement</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 rounded-lg"
          style={{ width: '100%', height: '400px' }}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/70 backdrop-blur-sm rounded-lg p-3">
          <div className="text-white text-sm font-medium mb-2">Flow Types</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded"></div>
              <span className="text-gray-300">Messages</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Reactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Mentions</span>
            </div>
          </div>
        </div>

        {/* Hub info */}
        <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm rounded-lg p-3">
          <div className="text-white text-sm font-medium mb-2">Hub Types</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">People</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span className="text-gray-300">Teams</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Channels</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Send size={16} className="text-cyan-400 mx-auto mb-1" />
          <div className="text-white font-bold">24</div>
          <div className="text-gray-400 text-xs">Active Threads</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Users size={16} className="text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold">67</div>
          <div className="text-gray-400 text-xs">Participants</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <MessageCircle size={16} className="text-yellow-400 mx-auto mb-1" />
          <div className="text-white font-bold">312</div>
          <div className="text-gray-400 text-xs">Total Messages</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <TrendingUp size={16} className="text-green-400 mx-auto mb-1" />
          <div className="text-white font-bold">+18%</div>
          <div className="text-gray-400 text-xs">vs Yesterday</div>
        </div>
      </div>
    </div>
  );
}