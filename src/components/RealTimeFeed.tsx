import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Zap, Filter, Hash, AtSign, MessageCircle, Loader2 } from 'lucide-react';

type FeedType = 'all' | 'message' | 'mention' | 'reaction';

interface FeedItem {
  id: string;
  type: FeedType;
  author: string;
  channel: string;
  content: string;
  timestamp: number;
}

export default function RealTimeFeed() {
  const [filter, setFilter] = useState<FeedType>('all');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const streamRef = useRef<number | null>(null);

  useEffect(() => {
    const authors = ['Alex', 'Sarah', 'Marcus', 'Emily', 'David', 'Priya', 'Maya', 'Kevin'];
    const channels = ['general', 'design', 'dev', 'marketing', 'sales', 'random'];
    const contents = [
      'Pushed a new update to the repo',
      'Meeting notes are uploaded',
      'Can someone review PR #42?',
      'Great job on the launch! 🎉',
      'Drafted Q4 roadmap',
      'Any blockers for today?',
      'Designs ready for feedback',
      'Syncing with the client at 3 PM'
    ];

    const startStream = () => {
      stopStream();
      streamRef.current = window.setInterval(() => {
        const typePool: FeedType[] = ['message', 'mention', 'reaction'];
        const type = typePool[Math.floor(Math.random() * typePool.length)];
        const item: FeedItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          author: authors[Math.floor(Math.random() * authors.length)],
          channel: channels[Math.floor(Math.random() * channels.length)],
          content: contents[Math.floor(Math.random() * contents.length)],
          timestamp: Date.now()
        };
        setItems(prev => [item, ...prev].slice(0, 200));
      }, 1500);
    };

    const stopStream = () => {
      if (streamRef.current) {
        clearInterval(streamRef.current);
        streamRef.current = null;
      }
    };

    if (isStreaming) startStream();
    else stopStream();

    return () => stopStream();
  }, [isStreaming]);

  const filteredItems = useMemo(() => {
    return items.filter(i => filter === 'all' || i.type === filter);
  }, [items, filter]);

  const typeBadge = (type: FeedType) => {
    switch (type) {
      case 'message': return <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">Message</span>;
      case 'mention': return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">Mention</span>;
      case 'reaction': return <span className="px-2 py-0.5 rounded-full text-xs bg-purple-400/10 text-purple-400 border border-purple-400/30">Reaction</span>;
      default: return null;
    }
  };

  const iconFor = (type: FeedType) => {
    switch (type) {
      case 'message': return <MessageCircle size={16} className="text-cyan-400" />;
      case 'mention': return <AtSign size={16} className="text-yellow-400" />;
      case 'reaction': return <Zap size={16} className="text-purple-400" />;
      default: return <MessageCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Zap className="text-purple-400" size={24} />
          <span>Real-time Feed</span>
        </h2>
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FeedType)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All</option>
            <option value="message">Messages</option>
            <option value="mention">Mentions</option>
            <option value="reaction">Reactions</option>
          </select>
          <button
            onClick={() => setIsStreaming(s => !s)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${isStreaming ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            {isStreaming ? 'Streaming' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <MessageCircle className="text-cyan-400 mx-auto mb-2" size={18} />
          <div className="text-white text-xl font-bold">{items.filter(i => i.type === 'message').length}</div>
          <div className="text-gray-400 text-xs">Messages</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <AtSign className="text-yellow-400 mx-auto mb-2" size={18} />
          <div className="text-white text-xl font-bold">{items.filter(i => i.type === 'mention').length}</div>
          <div className="text-gray-400 text-xs">Mentions</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Zap className="text-purple-400 mx-auto mb-2" size={18} />
          <div className="text-white text-xl font-bold">{items.filter(i => i.type === 'reaction').length}</div>
          <div className="text-gray-400 text-xs">Reactions</div>
        </div>
      </div>

      <div className="relative h-[calc(100%-9rem)]">
        <div className="absolute inset-0 overflow-y-auto space-y-2 pr-1">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {iconFor(item.type)}
                  <div className="text-white font-medium">{item.author}</div>
                  <div className="text-gray-400 text-xs">• {new Date(item.timestamp).toLocaleTimeString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {typeBadge(item.type)}
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-gray-700/40 text-gray-300">
                    <Hash size={12} />
                    <span>{item.channel}</span>
                  </span>
                </div>
              </div>
              <div className="text-gray-300 text-sm mt-2">{item.content}</div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={16} />
              Waiting for events...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


