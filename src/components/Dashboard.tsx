import React from 'react';
import NetworkVisualization from './NetworkVisualization';
import SocialWeather from './SocialWeather';
import CommunicationFlow from './CommunicationFlow';
import RelationshipHealth from './RelationshipHealth';
import SocialInfluence from './SocialInfluence';
import IsolationDetection from './IsolationDetection';
import TeamDynamics from './TeamDynamics';
import InteractiveTimeline from './InteractiveTimeline';
import InteractionPatterns from './InteractionPatterns';
import RealTimeFeed from './RealTimeFeed';
import SocialMetrics from './SocialMetrics';
import EngagementTrends from './EngagementTrends';
import SentimentAnalysis from './SentimentAnalysis';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ContactSupport from './ContactSupport';
import TeamBuilder from './TeamBuilder';

export type DashboardView =
  | 'network' | 'weather' | 'flow' | 'health' | 'influence' | 'isolation' | 'team' | 'timeline' | 'patterns' | 'feed'
  | 'socialMetrics' | 'engagement' | 'sentiment'
  | 'login' | 'signup' | 'forgot' | 'contact' | 'teamBuilder';

interface DashboardProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export default function Dashboard({ activeView, onViewChange }: DashboardProps) {

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
      case 'patterns':
        return <InteractionPatterns />;
      case 'feed':
        return <RealTimeFeed />;
      case 'socialMetrics':
        return <SocialMetrics />;
      case 'engagement':
        return <EngagementTrends />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'login':
        return <Login onSuccess={() => onViewChange('network')} />;
      case 'signup':
        return <Signup onSuccess={() => onViewChange('login')} />;
      case 'forgot':
        return <ForgotPassword />;
      case 'contact':
        return <ContactSupport />;
      case 'teamBuilder':
        return <TeamBuilder />;
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
          { key: 'patterns', label: 'Patterns', icon: '📊' },
          { key: 'feed', label: 'Real-time', icon: '⚡' },
          { key: 'health', label: 'Health', icon: '❤️' },
          { key: 'influence', label: 'Influence', icon: '⭐' },
          { key: 'isolation', label: 'Isolation', icon: '🔍' },
          { key: 'team', label: 'Teams', icon: '👥' },
          { key: 'timeline', label: 'Timeline', icon: '📈' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onViewChange(key as DashboardView)}
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