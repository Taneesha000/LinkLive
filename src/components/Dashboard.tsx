import React, { useState } from 'react';
import NetworkVisualization from './NetworkVisualization';
import SocialWeather from './SocialWeather';
import CommunicationFlow from './CommunicationFlow';
import RelationshipHealth from './RelationshipHealth';
import SocialInfluence from './SocialInfluence';
import IsolationDetection from './IsolationDetection';
import TeamDynamics from './TeamDynamics';
import InteractiveTimeline from './InteractiveTimeline';

type DashboardView = 'network' | 'weather' | 'flow' | 'health' | 'influence' | 'isolation' | 'team' | 'timeline';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('network');

  const renderActiveView = () => {
    switch (activeView) {
      case 'network':
        return <NetworkVisualization />;
      case 'weather':
        return <SocialWeather />;
      case 'flow':
        return <CommunicationFlow />;
      case 'health':
        return <RelationshipHealth />;
      case 'influence':
        return <SocialInfluence />;
      case 'isolation':
        return <IsolationDetection />;
      case 'team':
        return <TeamDynamics />;
      case 'timeline':
        return <InteractiveTimeline />;
      default:
        return <NetworkVisualization />;
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Quick Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: 'network', label: 'Network', icon: '🌐' },
          { key: 'weather', label: 'Weather', icon: '🌤️' },
          { key: 'flow', label: 'Flow', icon: '💬' },
          { key: 'health', label: 'Health', icon: '❤️' },
          { key: 'influence', label: 'Influence', icon: '⭐' },
          { key: 'isolation', label: 'Isolation', icon: '🔍' },
          { key: 'team', label: 'Teams', icon: '👥' },
          { key: 'timeline', label: 'Timeline', icon: '📈' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveView(key as DashboardView)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === key
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 hover:text-white'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main View */}
      <div className="h-[calc(100vh-12rem)]">
        {renderActiveView()}
      </div>
    </div>
  );
}