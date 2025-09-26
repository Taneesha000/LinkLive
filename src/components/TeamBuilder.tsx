import React, { useMemo, useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

interface Person { id: string; name: string; dept: string; }

export default function TeamBuilder() {
  const candidates = useMemo<Person[]>(() => [
    'Alex Chen','Sarah Kim','Marcus Johnson','Emily Zhang','David Wilson','Priya Patel','Maya Thompson','Kevin Lee','Zoe Adams','Ryan Mitchell','Lisa Wang','Carlos Silva','Nina Foster','Tom Baker'
  ].map((n, i) => ({ id: `p-${i}`, name: n, dept: ['Eng','Design','Mkt','Sales','Ops'][i%5] })), []);

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 10 ? [...prev, id] : prev);
  };

  const canCreate = selected.length >= 5 && selected.length <= 10;

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex items-center space-x-3 mb-4">
        <Users className="text-cyan-400" size={24} />
        <div className="text-2xl font-bold text-white">Team Builder</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/40 rounded-lg p-4">
          <div className="text-white font-medium mb-2">Candidates</div>
          <div className="max-h-72 overflow-y-auto space-y-2">
            {candidates.map(p => (
              <button key={p.id} onClick={() => toggle(p.id)} className={`w-full flex items-center justify-between p-2 rounded border ${selected.includes(p.id) ? 'border-cyan-400 text-cyan-400' : 'border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50'}`}>
                <div>
                  <div>{p.name}</div>
                  <div className="text-xs text-gray-500">{p.dept}</div>
                </div>
                {selected.includes(p.id) ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white font-medium">Selected ({selected.length}/10)</div>
            <div className={`text-xs ${canCreate ? 'text-green-400' : 'text-yellow-400'}`}>{canCreate ? 'Ready to create' : 'Pick 5-10 members'}</div>
          </div>
          <div className="space-y-2">
            {selected.map(id => {
              const p = candidates.find(c => c.id === id)!;
              return (
                <div key={id} className="flex items-center justify-between p-2 rounded border border-gray-700 text-gray-300">
                  <div>{p.name}</div>
                  <div className="text-xs text-gray-500">{p.dept}</div>
                </div>
              );
            })}
          </div>
          <button disabled={!canCreate} className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded py-2">Create Team</button>
        </div>
      </div>
    </div>
  );
}


