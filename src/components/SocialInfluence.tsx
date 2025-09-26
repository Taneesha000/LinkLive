import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Zap, Crown, Award } from 'lucide-react';

interface InfluencerNode {
  id: string;
  name: string;
  avatar: string;
  influenceScore: number;
  connectionsCount: number;
  engagement: number;
  reachability: number;
  category: 'connector' | 'expert' | 'amplifier' | 'bridge';
  department: string;
  recentActivity: string[];
}

export default function SocialInfluence() {
  const [influencers, setInfluencers] = useState<InfluencerNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'influence' | 'connections' | 'engagement'>('influence');

  useEffect(() => {
    // Generate mock influencer data
    const mockInfluencers: InfluencerNode[] = [
      {
        id: '1',
        name: 'Sarah Kim',
        avatar: '👩‍🎨',
        influenceScore: 95,
        connectionsCount: 47,
        engagement: 92,
        reachability: 89,
        category: 'connector',
        department: 'Design',
        recentActivity: ['Led design workshop', 'Mentored 3 junior designers', 'Cross-team collaboration']
      },
      {
        id: '2',
        name: 'Alex Chen',
        avatar: '🧑‍💻',
        influenceScore: 88,
        connectionsCount: 42,
        engagement: 85,
        reachability: 91,
        category: 'expert',
        department: 'Engineering',
        recentActivity: ['Tech talk presentation', 'Code review champion', 'Architecture decisions']
      },
      {
        id: '3',
        name: 'Marcus Johnson',
        avatar: '👨‍💼',
        influenceScore: 91,
        connectionsCount: 38,
        engagement: 94,
        reachability: 87,
        category: 'amplifier',
        department: 'Marketing',
        recentActivity: ['Campaign strategy', 'Team motivation', 'Client presentations']
      },
      {
        id: '4',
        name: 'Emily Zhang',
        avatar: '👩‍💻',
        influenceScore: 82,
        connectionsCount: 35,
        engagement: 78,
        reachability: 85,
        category: 'bridge',
        department: 'Product',
        recentActivity: ['Cross-functional meetings', 'Requirements gathering', 'Stakeholder alignment']
      },
      {
        id: '5',
        name: 'David Wilson',
        avatar: '👨‍🔬',
        influenceScore: 79,
        connectionsCount: 31,
        engagement: 81,
        reachability: 76,
        category: 'expert',
        department: 'Data Science',
        recentActivity: ['Research publication', 'ML model deployment', 'Data insights sharing']
      },
      {
        id: '6',
        name: 'Priya Patel',
        avatar: '👩‍🚀',
        influenceScore: 86,
        connectionsCount: 44,
        engagement: 88,
        reachability: 82,
        category: 'connector',
        department: 'Operations',
        recentActivity: ['Process optimization', 'Team coordination', 'Efficiency initiatives']
      }
    ];

    setInfluencers(mockInfluencers);
  }, []);

  const filteredAndSortedInfluencers = influencers
    .filter(inf => selectedCategory === 'all' || inf.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'connections':
          return b.connectionsCount - a.connectionsCount;
        case 'engagement':
          return b.engagement - a.engagement;
        default:
          return b.influenceScore - a.influenceScore;
      }
    });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'connector': return <Users className="text-cyan-400" size={20} />;
      case 'expert': return <Star className="text-yellow-400" size={20} />;
      case 'amplifier': return <Zap className="text-purple-400" size={20} />;
      case 'bridge': return <TrendingUp className="text-green-400" size={20} />;
      default: return <Crown className="text-orange-400" size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'connector': return 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400';
      case 'expert': return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400';
      case 'amplifier': return 'bg-purple-400/10 border-purple-400/30 text-purple-400';
      case 'bridge': return 'bg-green-400/10 border-green-400/30 text-green-400';
      default: return 'bg-orange-400/10 border-orange-400/30 text-orange-400';
    }
  };

  const networkStats = {
    totalInfluencers: influencers.length,
    avgInfluence: Math.round(influencers.reduce((sum, inf) => sum + inf.influenceScore, 0) / influencers.length),
    topConnector: influencers.reduce((max, inf) => inf.connectionsCount > max.connectionsCount ? inf : max, influencers[0]),
    categories: {
      connector: influencers.filter(inf => inf.category === 'connector').length,
      expert: influencers.filter(inf => inf.category === 'expert').length,
      amplifier: influencers.filter(inf => inf.category === 'amplifier').length,
      bridge: influencers.filter(inf => inf.category === 'bridge').length
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Crown className="text-yellow-400" size={24} />
          <span>Social Influence Mapping</span>
        </h2>
        
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Categories</option>
            <option value="connector">Connectors</option>
            <option value="expert">Experts</option>
            <option value="amplifier">Amplifiers</option>
            <option value="bridge">Bridges</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="influence">Sort by Influence</option>
            <option value="connections">Sort by Connections</option>
            <option value="engagement">Sort by Engagement</option>
          </select>
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Crown className="text-yellow-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{networkStats.totalInfluencers}</div>
          <div className="text-gray-400 text-xs">Key Players</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <TrendingUp className="text-green-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{networkStats.avgInfluence}%</div>
          <div className="text-gray-400 text-xs">Avg Influence</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Users className="text-cyan-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{networkStats.categories.connector}</div>
          <div className="text-gray-400 text-xs">Connectors</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Star className="text-yellow-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{networkStats.categories.expert}</div>
          <div className="text-gray-400 text-xs">Experts</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Zap className="text-purple-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{networkStats.categories.amplifier}</div>
          <div className="text-gray-400 text-xs">Amplifiers</div>
        </div>
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredAndSortedInfluencers.map((influencer, index) => (
          <div key={influencer.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <span className="text-3xl">{influencer.avatar}</span>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1">
                      {index === 0 && <Crown className="text-yellow-400" size={16} />}
                      {index === 1 && <Award className="text-gray-300" size={16} />}
                      {index === 2 && <Award className="text-orange-400" size={16} />}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium flex items-center space-x-2">
                    <span>{influencer.name}</span>
                    {index < 3 && <span className="text-xs text-yellow-400">#{index + 1}</span>}
                  </div>
                  <div className="text-gray-400 text-sm">{influencer.department}</div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getCategoryColor(influencer.category)}`}>
                    {getCategoryIcon(influencer.category)}
                    <span>{influencer.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">{influencer.influenceScore}</div>
                <div className="text-gray-400 text-xs">Influence Score</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-cyan-400 font-bold">{influencer.connectionsCount}</div>
                <div className="text-gray-400 text-xs">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">{influencer.engagement}%</div>
                <div className="text-gray-400 text-xs">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{influencer.reachability}%</div>
                <div className="text-gray-400 text-xs">Reachability</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 mb-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Influence</span>
                  <span className="text-yellow-400">{influencer.influenceScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${influencer.influenceScore}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-green-400">{influencer.engagement}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${influencer.engagement}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-2">Recent Impact</div>
              <ul className="text-gray-300 text-xs space-y-1">
                {influencer.recentActivity.slice(0, 2).map((activity, actIndex) => (
                  <li key={actIndex} className="flex items-start space-x-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Category Legend */}
      <div className="mt-4 bg-gray-800/30 rounded-lg p-4">
        <div className="text-white font-medium mb-3">Influence Categories</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="text-cyan-400" size={16} />
            <div>
              <div className="text-cyan-400 font-medium">Connectors</div>
              <div className="text-gray-400 text-xs">Bridge different groups</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-400" size={16} />
            <div>
              <div className="text-yellow-400 font-medium">Experts</div>
              <div className="text-gray-400 text-xs">Domain knowledge leaders</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="text-purple-400" size={16} />
            <div>
              <div className="text-purple-400 font-medium">Amplifiers</div>
              <div className="text-gray-400 text-xs">Boost message reach</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-400" size={16} />
            <div>
              <div className="text-green-400 font-medium">Bridges</div>
              <div className="text-gray-400 text-xs">Connect departments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}