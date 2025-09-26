import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Clock, MessageCircle, Users, Filter } from 'lucide-react';

interface HeatmapCell {
  day: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  value: number; // interactions count
}

interface PatternMetric {
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'cyan' | 'purple' | 'yellow' | 'green';
}

export default function InteractionPatterns() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [filter, setFilter] = useState<'all' | 'dm' | 'channels' | 'meetings'>('all');
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);

  useEffect(() => {
    const generate = () => {
      const cells: HeatmapCell[] = [];
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const base = 10 + 40 * Math.max(0, Math.cos((hour - 14) / 24 * Math.PI * 2));
          const weekdayBoost = day >= 1 && day <= 5 ? 1.0 : 0.6;
          const noise = Math.random() * 12;
          const channelBias = filter === 'channels' ? 1.2 : filter === 'dm' ? 0.9 : filter === 'meetings' ? (hour >= 9 && hour <= 17 ? 1.3 : 0.7) : 1.0;
          const periodScale = period === 'week' ? 0.8 : period === 'quarter' ? 1.2 : 1.0;
          const value = Math.max(0, Math.round((base * weekdayBoost * channelBias * periodScale) + noise));
          cells.push({ day, hour, value });
        }
      }
      return cells;
    };
    setHeatmap(generate());
  }, [period, filter]);

  const maxVal = useMemo(() => heatmap.reduce((m, c) => Math.max(m, c.value), 0) || 1, [heatmap]);
  const avgVal = useMemo(() => Math.round(heatmap.reduce((s, c) => s + c.value, 0) / Math.max(1, heatmap.length)), [heatmap]);

  const metrics: PatternMetric[] = [
    { label: 'Avg/hr', value: avgVal, sub: 'Typical activity', tone: 'cyan' },
    { label: 'Peak hour', value: `${heatmap.sort((a,b)=>b.value-a.value)[0]?.hour || 0}:00`, sub: 'Most active', tone: 'yellow' },
    { label: 'Busiest day', value: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][heatmap.reduce((best, c, i, arr) => {
        const sums = new Array(7).fill(0);
        arr.forEach(cell => { sums[cell.day] += cell.value; });
        return sums.indexOf(Math.max(...sums));
      }, 0)], sub: 'Highest volume', tone: 'purple' },
    { label: 'Max/hr', value: maxVal, sub: 'Heatmap peak', tone: 'green' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <BarChart3 className="text-cyan-400" size={24} />
          <span>Interaction Patterns</span>
        </h2>
        <div className="flex space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All</option>
            <option value="dm">Direct Messages</option>
            <option value="channels">Channels</option>
            <option value="meetings">Meetings</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className={`text-${m.tone}-400 text-xl font-bold`}>{m.value}</div>
            <div className="text-gray-400 text-sm">{m.label}</div>
            {m.sub && <div className="text-gray-500 text-xs mt-1">{m.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-3">
        <div className="text-gray-400 text-xs space-y-2 pt-6">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
            <div key={d} className="h-6 flex items-center">{d}</div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-24 gap-[6px]">
              {[...Array(24)].map((_, h) => (
                <div key={h} className="text-center text-[10px] text-gray-500">{h}</div>
              ))}
            </div>
            <div className="grid grid-rows-7 gap-[6px] mt-2">
              {[0,1,2,3,4,5,6].map(day => (
                <div key={day} className="grid grid-cols-24 gap-[6px] h-6">
                  {[...Array(24)].map((_, hour) => {
                    const cell = heatmap.find(c => c.day === day && c.hour === hour);
                    const intensity = (cell?.value || 0) / maxVal;
                    const bg = `rgba(34,211,238,${0.1 + intensity * 0.9})`;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        title={`${cell?.value || 0} interactions at ${hour}:00`}
                        className="rounded"
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-white">
            <Clock size={16} />
            <span>Quiet Hours</span>
          </div>
          <div className="text-gray-300 text-sm">Most quiet: 2:00 - 6:00, Sat-Sun</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-white">
            <Users size={16} />
            <span>Cross-team Peak</span>
          </div>
          <div className="text-gray-300 text-sm">Highest collaboration Tue 11:00 - 14:00</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-white">
            <MessageCircle size={16} />
            <span>Channel Load</span>
          </div>
          <div className="text-gray-300 text-sm">Channels carry ~{Math.round(avgVal * 1.4)} msgs/hr at peak</div>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/20">
        <h4 className="text-cyan-400 font-medium mb-2 flex items-center space-x-2">
          <Filter size={16} />
          <span>Pattern Insights</span>
        </h4>
        <div className="text-gray-300 text-sm">
          {filter === 'meetings' ? 'Meeting-heavy afternoons detected. Consider clustering syncs.' :
           filter === 'channels' ? 'Channels dominate daytime activity. Encourage thread usage.' :
           filter === 'dm' ? 'DMs spike at start/end of day. Promote async updates.' :
           'Balanced interaction profile with midday peak.'}
        </div>
      </div>
    </div>
  );
}


