import React, { useMemo } from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

export default function SentimentAnalysis() {
  const sentiments = useMemo(() => {
    const positive = 62 + Math.floor(Math.random() * 8);
    const neutral = 25 + Math.floor(Math.random() * 6);
    const negative = 100 - positive - neutral;
    return { positive, neutral, negative };
  }, []);

  const segments = [
    { label: 'Positive', value: sentiments.positive, color: 'bg-green-400', icon: Smile },
    { label: 'Neutral', value: sentiments.neutral, color: 'bg-yellow-400', icon: Meh },
    { label: 'Negative', value: sentiments.negative, color: 'bg-red-400', icon: Frown }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="text-2xl font-bold text-white mb-6">Sentiment Analysis</div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {segments.map(s => (
          <div key={s.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
            <s.icon className="mx-auto mb-2" size={20} />
            <div className="text-white text-xl font-bold">{s.value}%</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        <div className="h-3 bg-green-400" style={{ width: `${sentiments.positive}%` }} />
        <div className="h-3 bg-yellow-400" style={{ width: `${sentiments.neutral}%` }} />
        <div className="h-3 bg-red-400" style={{ width: `${sentiments.negative}%` }} />
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        Team mood leans positive with moderate neutrality and low negative sentiment.
      </div>
    </div>
  );
}


