import React, { useState, useEffect } from 'react';
import { AlertTriangle, Heart, Clock, MessageCircle, Users, TrendingDown } from 'lucide-react';

interface IsolatedPerson {
  id: string;
  name: string;
  avatar: string;
  isolationScore: number;
  lastInteraction: Date;
  interactionCount: number;
  department: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  missedConnections: number;
  suggestedActions: string[];
  potentialConnectors: string[];
}

export default function IsolationDetection() {
  const [isolatedPeople, setIsolatedPeople] = useState<IsolatedPerson[]>([]);
  const [filter, setFilter] = useState<'all' | 'high-risk' | 'recent'>('high-risk');

  useEffect(() => {
    // Generate mock isolation data
    const mockIsolatedPeople: IsolatedPerson[] = [
      {
        id: '1',
        name: 'Jordan Smith',
        avatar: '🧑‍💻',
        isolationScore: 85,
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        interactionCount: 2,
        department: 'Engineering',
        riskLevel: 'critical',
        trend: 'declining',
        missedConnections: 12,
        suggestedActions: [
          'Schedule 1:1 with team lead',
          'Invite to team coffee chat',
          'Include in next project discussion',
          'Pair programming session'
        ],
        potentialConnectors: ['Alex Chen', 'Sarah Kim', 'Dev Team']
      },
      {
        id: '2',
        name: 'Riley Chen',
        avatar: '👩‍🎨',
        isolationScore: 72,
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        interactionCount: 5,
        department: 'Design',
        riskLevel: 'high',
        trend: 'stable',
        missedConnections: 8,
        suggestedActions: [
          'Join design critique session',
          'Collaborate on UI project',
          'Attend design team standup'
        ],
        potentialConnectors: ['Marcus Johnson', 'Design Team', 'Emily Zhang']
      },
      {
        id: '3',
        name: 'Casey Johnson',
        avatar: '👨‍💼',
        isolationScore: 58,
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 18),
        interactionCount: 8,
        department: 'Sales',
        riskLevel: 'medium',
        trend: 'improving',
        missedConnections: 5,
        suggestedActions: [
          'Join sales team meeting',
          'Shadow senior sales rep',
          'Attend client presentation'
        ],
        potentialConnectors: ['Priya Patel', 'Sales Team', 'David Wilson']
      },
      {
        id: '4',
        name: 'Quinn Rodriguez',
        avatar: '👩‍🔬',
        isolationScore: 45,
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 12),
        interactionCount: 12,
        department: 'Data Science',
        riskLevel: 'medium',
        trend: 'stable',
        missedConnections: 3,
        suggestedActions: [
          'Present research findings',
          'Join cross-team analytics meeting',
          'Mentoring opportunity'
        ],
        potentialConnectors: ['Kevin Lee', 'Analytics Team', 'Maya Thompson']
      }
    ];

    setIsolatedPeople(mockIsolatedPeople);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setIsolatedPeople(prev => prev.map(person => ({
        ...person,
        isolationScore: Math.max(0, Math.min(100, person.isolationScore + (Math.random() - 0.5) * 5)),
        interactionCount: Math.max(0, person.interactionCount + Math.floor((Math.random() - 0.3) * 2))
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPeople = isolatedPeople.filter(person => {
    switch (filter) {
      case 'high-risk':
        return person.riskLevel === 'critical' || person.riskLevel === 'high';
      case 'recent':
        return (Date.now() - person.lastInteraction.getTime()) < (1000 * 60 * 60 * 48);
      default:
        return true;
    }
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="text-green-400 rotate-180" size={14} />;
      case 'declining': return <TrendingDown className="text-red-400" size={14} />;
      default: return <div className="w-3.5 h-0.5 bg-gray-400"></div>;
    }
  };

  const formatTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Recently';
  };

  const overallStats = {
    totalAtRisk: isolatedPeople.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
    avgIsolationScore: Math.round(isolatedPeople.reduce((sum, p) => sum + p.isolationScore, 0) / isolatedPeople.length),
    recentlyImproved: isolatedPeople.filter(p => p.trend === 'improving').length,
    needsAttention: isolatedPeople.filter(p => p.riskLevel === 'critical').length
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Heart className="text-red-400" size={24} />
          <span>Isolation Detection</span>
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            All ({isolatedPeople.length})
          </button>
          <button
            onClick={() => setFilter('high-risk')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'high-risk' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            High Risk ({overallStats.totalAtRisk})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'recent' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Recent Activity
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-2" size={20} />
          <div className="text-red-400 text-2xl font-bold">{overallStats.needsAttention}</div>
          <div className="text-gray-400 text-sm">Critical Risk</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Users className="text-orange-400 mx-auto mb-2" size={20} />
          <div className="text-orange-400 text-2xl font-bold">{overallStats.totalAtRisk}</div>
          <div className="text-gray-400 text-sm">Need Support</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <TrendingDown className="text-green-400 mx-auto mb-2 rotate-180" size={20} />
          <div className="text-green-400 text-2xl font-bold">{overallStats.recentlyImproved}</div>
          <div className="text-gray-400 text-sm">Improving</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <MessageCircle className="text-cyan-400 mx-auto mb-2" size={20} />
          <div className="text-cyan-400 text-2xl font-bold">{overallStats.avgIsolationScore}</div>
          <div className="text-gray-400 text-sm">Avg Isolation</div>
        </div>
      </div>

      {/* People at Risk */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPeople.map(person => (
          <div key={person.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{person.avatar}</span>
                <div>
                  <div className="text-white font-medium flex items-center space-x-2">
                    <span>{person.name}</span>
                    {getTrendIcon(person.trend)}
                  </div>
                  <div className="text-gray-400 text-sm">{person.department}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(person.riskLevel)}`}>
                  {person.riskLevel.toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="text-red-400 text-xl font-bold">{person.isolationScore}</div>
                  <div className="text-gray-400 text-xs">Isolation Score</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="text-gray-400" size={14} />
                <div>
                  <div className="text-gray-300">Last Contact</div>
                  <div className="text-gray-400">{formatTimeSince(person.lastInteraction)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-gray-400" size={14} />
                <div>
                  <div className="text-gray-300">Interactions</div>
                  <div className="text-gray-400">{person.interactionCount} this week</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-gray-400" size={14} />
                <div>
                  <div className="text-gray-300">Missed Connections</div>
                  <div className="text-gray-400">{person.missedConnections}</div>
                </div>
              </div>
            </div>

            {/* Isolation Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Isolation Level</span>
                <span className="text-red-400">{person.isolationScore}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full"
                  style={{ width: `${person.isolationScore}%` }}
                />
              </div>
            </div>

            {/* Suggested Actions */}
            <div className="bg-gray-700/30 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="text-cyan-400" size={14} />
                <span className="text-cyan-400 text-sm font-medium">Gentle Support Actions</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-xs">
                {person.suggestedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-2 text-gray-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Connectors */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Potential Connectors:</span>
              <div className="flex space-x-2">
                {person.potentialConnectors.map((connector, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                  >
                    {connector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Resources */}
      <div className="mt-4 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/20">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="text-cyan-400" size={16} />
          <span className="text-cyan-400 font-medium">Remember</span>
        </div>
        <p className="text-gray-300 text-sm">
          Isolation detection is designed to foster connection and support, not surveillance. 
          All interventions should be gentle, voluntary, and focused on creating opportunities 
          for meaningful engagement.
        </p>
      </div>
    </div>
  );
}