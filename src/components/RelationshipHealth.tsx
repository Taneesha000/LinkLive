import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';

interface Relationship {
  id: string;
  person1: string;
  person2: string;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  lastInteraction: Date;
  interactionFrequency: number;
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  avatar1: string;
  avatar2: string;
}

export default function RelationshipHealth() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [filter, setFilter] = useState<'all' | 'risk' | 'strong'>('all');

  useEffect(() => {
    // Generate mock relationship data
    const mockRelationships: Relationship[] = [
      {
        id: '1',
        person1: 'Alex Chen',
        person2: 'Sarah Kim',
        healthScore: 92,
        trend: 'up',
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 2),
        interactionFrequency: 15,
        sentimentScore: 0.8,
        riskLevel: 'low',
        recommendations: ['Continue regular check-ins', 'Share project updates'],
        avatar1: '🧑‍💻',
        avatar2: '👩‍🎨'
      },
      {
        id: '2',
        person1: 'Marcus Johnson',
        person2: 'Emily Zhang',
        healthScore: 45,
        trend: 'down',
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        interactionFrequency: 3,
        sentimentScore: 0.2,
        riskLevel: 'high',
        recommendations: ['Schedule 1:1 meeting', 'Address communication gaps', 'Find common ground'],
        avatar1: '👨‍💼',
        avatar2: '👩‍💻'
      },
      {
        id: '3',
        person1: 'David Wilson',
        person2: 'Priya Patel',
        healthScore: 78,
        trend: 'stable',
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 8),
        interactionFrequency: 8,
        sentimentScore: 0.6,
        riskLevel: 'low',
        recommendations: ['Maintain current collaboration', 'Explore joint projects'],
        avatar1: '👨‍🔬',
        avatar2: '👩‍🚀'
      },
      {
        id: '4',
        person1: 'James Rodriguez',
        person2: 'Maya Thompson',
        healthScore: 65,
        trend: 'down',
        lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        interactionFrequency: 5,
        sentimentScore: 0.4,
        riskLevel: 'medium',
        recommendations: ['Increase casual interactions', 'Clarify expectations', 'Team building activities'],
        avatar1: '👨‍🎤',
        avatar2: '👩‍🏫'
      },
      {
        id: '5',
        person1: 'Kevin Lee',
        person2: 'Zoe Adams',
        healthScore: 88,
        trend: 'up',
        lastInteraction: new Date(Date.now() - 1000 * 60 * 30),
        interactionFrequency: 12,
        sentimentScore: 0.75,
        riskLevel: 'low',
        recommendations: ['Leverage strong partnership', 'Mentor others'],
        avatar1: '👨‍💻',
        avatar2: '👩‍🔧'
      }
    ];

    setRelationships(mockRelationships);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRelationships(prev => prev.map(rel => ({
        ...rel,
        healthScore: Math.max(0, Math.min(100, rel.healthScore + (Math.random() - 0.5) * 5)),
        sentimentScore: Math.max(0, Math.min(1, rel.sentimentScore + (Math.random() - 0.5) * 0.1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredRelationships = relationships.filter(rel => {
    switch (filter) {
      case 'risk':
        return rel.riskLevel === 'high' || rel.riskLevel === 'medium';
      case 'strong':
        return rel.healthScore >= 80;
      default:
        return true;
    }
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-green-400 bg-green-400/10 border-green-400/30';
    }
  };

  const formatTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  const overallStats = {
    avgHealth: Math.round(relationships.reduce((sum, rel) => sum + rel.healthScore, 0) / relationships.length),
    atRisk: relationships.filter(rel => rel.riskLevel === 'high' || rel.riskLevel === 'medium').length,
    strong: relationships.filter(rel => rel.healthScore >= 80).length,
    total: relationships.length
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Heart className="text-pink-400" size={24} />
          <span>Relationship Health</span>
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            All ({relationships.length})
          </button>
          <button
            onClick={() => setFilter('risk')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'risk' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            At Risk ({overallStats.atRisk})
          </button>
          <button
            onClick={() => setFilter('strong')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'strong' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Strong ({overallStats.strong})
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-cyan-400 text-2xl font-bold">{overallStats.avgHealth}%</div>
          <div className="text-gray-400 text-sm">Avg Health</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-green-400 text-2xl font-bold">{overallStats.strong}</div>
          <div className="text-gray-400 text-sm">Strong Bonds</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-red-400 text-2xl font-bold">{overallStats.atRisk}</div>
          <div className="text-gray-400 text-sm">Need Attention</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-purple-400 text-2xl font-bold">{overallStats.total}</div>
          <div className="text-gray-400 text-sm">Total Tracked</div>
        </div>
      </div>

      {/* Relationships List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredRelationships.map(relationship => (
          <div key={relationship.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{relationship.avatar1}</span>
                  <span className="text-gray-400">↔</span>
                  <span className="text-2xl">{relationship.avatar2}</span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {relationship.person1} ↔ {relationship.person2}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{formatTimeSince(relationship.lastInteraction)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{relationship.interactionFrequency}/week</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Trend */}
                <div className="flex items-center space-x-1">
                  {relationship.trend === 'up' && <TrendingUp className="text-green-400" size={16} />}
                  {relationship.trend === 'down' && <TrendingDown className="text-red-400" size={16} />}
                  {relationship.trend === 'stable' && <div className="w-4 h-0.5 bg-gray-400"></div>}
                </div>

                {/* Health Score */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${getHealthColor(relationship.healthScore)}`}>
                    {relationship.healthScore}%
                  </div>
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthBgColor(relationship.healthScore)}`}
                      style={{ width: `${relationship.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(relationship.riskLevel)}`}>
                  {relationship.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {relationship.riskLevel !== 'low' && (
              <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="text-yellow-400" size={16} />
                  <span className="text-yellow-400 text-sm font-medium">Recommendations</span>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  {relationship.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sentiment Bar */}
            <div className="mt-3 flex items-center space-x-3">
              <span className="text-gray-400 text-sm">Sentiment:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${relationship.sentimentScore * 100}%` }}
                />
              </div>
              <span className="text-gray-400 text-sm">{Math.round(relationship.sentimentScore * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}