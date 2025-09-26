import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, Link2, Activity } from 'lucide-react';

interface Metrics {
  activeUsers: number;
  messages: number;
  connections: number;
  activityIndex: number;
}

export default function SocialMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({ activeUsers: 0, messages: 0, connections: 0, activityIndex: 0 });

  useEffect(() => {
    const seed: Metrics = {
      activeUsers: 128,
      messages: 2314,
      connections: 842,
      activityIndex: 76
    };
    setMetrics(seed);
    const t = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: Math.max(90, prev.activeUsers + Math.floor((Math.random() - 0.5) * 8)),
        messages: prev.messages + Math.floor(Math.random() * 30),
        connections: prev.connections + Math.floor(Math.random() * 10),
        activityIndex: Math.min(100, Math.max(0, prev.activityIndex + Math.floor((Math.random() - 0.5) * 5)))
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const cards = [
    { label: 'Active Users', value: metrics.activeUsers, icon: Users, tone: 'text-cyan-400' },
    { label: 'Messages', value: metrics.messages, icon: MessageCircle, tone: 'text-yellow-400' },
    { label: 'Connections', value: metrics.connections, icon: Link2, tone: 'text-purple-400' },
    { label: 'Activity Index', value: `${metrics.activityIndex}%`, icon: Activity, tone: 'text-green-400' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="text-2xl font-bold text-white mb-6">Social Metrics</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(c => (
          <div key={c.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
            <c.icon className={`${c.tone} mx-auto mb-2`} size={20} />
            <div className="text-white text-xl font-bold">{c.value}</div>
            <div className="text-gray-400 text-xs">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/30 rounded-lg p-4">
        <div className="text-gray-300 text-sm">Overview</div>
        <div className="mt-2 text-gray-400 text-sm">
          Engagement is trending moderately upward. Active users and connections show healthy growth.
        </div>
      </div>
    </div>
  );
}


