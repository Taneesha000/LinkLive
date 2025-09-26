import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Zap, Target, Award, AlertCircle } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  members: number;
  cohesionScore: number;
  productivityIndex: number;
  communicationHealth: number;
  conflictLevel: number;
  collaborationRating: number;
  recentTrends: {
    cohesion: 'up' | 'down' | 'stable';
    productivity: 'up' | 'down' | 'stable';
    communication: 'up' | 'down' | 'stable';
  };
  insights: string[];
  strengths: string[];
  areas: string[];
  topPerformers: string[];
  department: string;
  lastUpdated: Date;
}

export default function TeamDynamics() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  useEffect(() => {
    // Generate mock team data
    const mockTeams: Team[] = [
      {
        id: 'engineering',
        name: 'Engineering Team',
        members: 12,
        cohesionScore: 88,
        productivityIndex: 92,
        communicationHealth: 85,
        conflictLevel: 15,
        collaborationRating: 91,
        recentTrends: { cohesion: 'up', productivity: 'up', communication: 'stable' },
        insights: [
          'High collaboration on recent sprint',
          'Strong knowledge sharing culture',
          'Effective daily standups'
        ],
        strengths: ['Technical expertise', 'Problem-solving', 'Innovation'],
        areas: ['Cross-team communication', 'Documentation'],
        topPerformers: ['Alex Chen', 'Sarah Kim'],
        department: 'Technology',
        lastUpdated: new Date()
      },
      {
        id: 'design',
        name: 'Design Team',
        members: 6,
        cohesionScore: 94,
        productivityIndex: 87,
        communicationHealth: 96,
        conflictLevel: 8,
        collaborationRating: 93,
        recentTrends: { cohesion: 'stable', productivity: 'up', communication: 'up' },
        insights: [
          'Excellent creative collaboration',
          'Strong mentor-mentee relationships',
          'Regular design critiques boost quality'
        ],
        strengths: ['Creativity', 'User empathy', 'Visual communication'],
        areas: ['Technical constraints understanding'],
        topPerformers: ['Marcus Johnson', 'Emily Zhang'],
        department: 'Product',
        lastUpdated: new Date()
      },
      {
        id: 'marketing',
        name: 'Marketing Team',
        members: 8,
        cohesionScore: 76,
        productivityIndex: 82,
        communicationHealth: 78,
        conflictLevel: 22,
        collaborationRating: 74,
        recentTrends: { cohesion: 'down', productivity: 'stable', communication: 'down' },
        insights: [
          'Some tension around campaign priorities',
          'Need better alignment on messaging',
          'Strong individual contributors'
        ],
        strengths: ['Creativity', 'Market insight', 'Brand awareness'],
        areas: ['Internal alignment', 'Process clarity', 'Conflict resolution'],
        topPerformers: ['Priya Patel'],
        department: 'Marketing',
        lastUpdated: new Date()
      },
      {
        id: 'sales',
        name: 'Sales Team',
        members: 10,
        cohesionScore: 81,
        productivityIndex: 89,
        communicationHealth: 83,
        conflictLevel: 18,
        collaborationRating: 79,
        recentTrends: { cohesion: 'up', productivity: 'up', communication: 'stable' },
        insights: [
          'Strong competitive drive',
          'Good knowledge sharing on leads',
          'Regular team celebrations boost morale'
        ],
        strengths: ['Results-driven', 'Customer focus', 'Resilience'],
        areas: ['Long-term relationship building', 'Process adherence'],
        topPerformers: ['David Wilson', 'Maya Thompson'],
        department: 'Sales',
        lastUpdated: new Date()
      }
    ];

    setTeams(mockTeams);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTeams(prev => prev.map(team => ({
        ...team,
        cohesionScore: Math.max(50, Math.min(100, team.cohesionScore + (Math.random() - 0.5) * 4)),
        productivityIndex: Math.max(50, Math.min(100, team.productivityIndex + (Math.random() - 0.5) * 3)),
        communicationHealth: Math.max(50, Math.min(100, team.communicationHealth + (Math.random() - 0.5) * 5)),
        conflictLevel: Math.max(0, Math.min(50, team.conflictLevel + (Math.random() - 0.5) * 3))
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const selectedTeamData = teams.find(team => team.id === selectedTeam);
  const displayTeams = selectedTeam === 'all' ? teams : selectedTeamData ? [selectedTeamData] : teams;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-400" size={14} />;
      case 'down': return <TrendingUp className="text-red-400 rotate-180" size={14} />;
      default: return <div className="w-3.5 h-0.5 bg-gray-400"></div>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const overallStats = {
    totalMembers: teams.reduce((sum, team) => sum + team.members, 0),
    avgCohesion: Math.round(teams.reduce((sum, team) => sum + team.cohesionScore, 0) / teams.length),
    highPerforming: teams.filter(team => team.cohesionScore >= 85 && team.productivityIndex >= 85).length,
    needsAttention: teams.filter(team => team.conflictLevel > 20 || team.cohesionScore < 70).length
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Users className="text-cyan-400" size={24} />
          <span>Team Dynamics</span>
        </h2>
        
        <div className="flex space-x-3">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          
          <div className="flex rounded-lg bg-gray-800 p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'overview' ? 'bg-cyan-600 text-white' : 'text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'detailed' ? 'bg-cyan-600 text-white' : 'text-gray-300'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Organization Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Users className="text-cyan-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{overallStats.totalMembers}</div>
          <div className="text-gray-400 text-sm">Total Members</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Target className="text-green-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{overallStats.avgCohesion}%</div>
          <div className="text-gray-400 text-sm">Avg Cohesion</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Award className="text-yellow-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{overallStats.highPerforming}</div>
          <div className="text-gray-400 text-sm">High Performing</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <AlertCircle className="text-red-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{overallStats.needsAttention}</div>
          <div className="text-gray-400 text-sm">Need Attention</div>
        </div>
      </div>

      {/* Teams Display */}
      <div className={`${viewMode === 'overview' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-6'} max-h-96 overflow-y-auto`}>
        {displayTeams.map(team => (
          <div key={team.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-lg font-medium">{team.name}</h3>
                <p className="text-gray-400 text-sm">{team.members} members • {team.department}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(team.cohesionScore)}`}>
                  {team.cohesionScore}%
                </div>
                <div className="text-gray-400 text-xs">Team Cohesion</div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className={`text-sm font-bold ${getScoreColor(team.productivityIndex)}`}>
                    {team.productivityIndex}%
                  </div>
                  {getTrendIcon(team.recentTrends.productivity)}
                </div>
                <div className="text-gray-400 text-xs">Productivity</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className={`text-sm font-bold ${getScoreColor(team.communicationHealth)}`}>
                    {team.communicationHealth}%
                  </div>
                  {getTrendIcon(team.recentTrends.communication)}
                </div>
                <div className="text-gray-400 text-xs">Communication</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-bold text-purple-400">{team.collaborationRating}%</div>
                <div className="text-gray-400 text-xs">Collaboration</div>
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-bold ${team.conflictLevel > 20 ? 'text-red-400' : team.conflictLevel > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {team.conflictLevel}%
                </div>
                <div className="text-gray-400 text-xs">Conflict</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Cohesion</span>
                  <span className={getScoreColor(team.cohesionScore)}>{team.cohesionScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getScoreBg(team.cohesionScore)}`}
                    style={{ width: `${team.cohesionScore}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Productivity</span>
                  <span className={getScoreColor(team.productivityIndex)}>{team.productivityIndex}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getScoreBg(team.productivityIndex)}`}
                    style={{ width: `${team.productivityIndex}%` }}
                  />
                </div>
              </div>
            </div>

            {viewMode === 'detailed' && (
              <>
                {/* Insights */}
                <div className="mb-4">
                  <h4 className="text-white text-sm font-medium mb-2 flex items-center space-x-1">
                    <Zap className="text-cyan-400" size={14} />
                    <span>Recent Insights</span>
                  </h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    {team.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths & Areas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-green-400 text-sm font-medium mb-2">Strengths</h4>
                    <ul className="text-gray-300 text-xs space-y-1">
                      {team.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-0.5">+</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 text-sm font-medium mb-2">Focus Areas</h4>
                    <ul className="text-gray-300 text-xs space-y-1">
                      {team.areas.map((area, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-0.5">→</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* Top Performers */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Top Contributors:</span>
              <div className="flex space-x-2">
                {team.topPerformers.map((performer, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-full text-xs text-cyan-400 border border-cyan-400/30"
                  >
                    {performer}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {selectedTeam !== 'all' && selectedTeamData && (
        <div className="mt-4 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/20">
          <h4 className="text-cyan-400 font-medium mb-2 flex items-center space-x-2">
            <Target size={16} />
            <span>Optimization Recommendations</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">
                {selectedTeamData.cohesionScore < 75 
                  ? 'Focus on team building activities and regular check-ins to improve cohesion.'
                  : selectedTeamData.conflictLevel > 20
                  ? 'Consider conflict resolution workshops and clearer communication protocols.'
                  : 'Team is performing well. Consider cross-team collaboration opportunities.'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-300">
                {selectedTeamData.productivityIndex < 75
                  ? 'Review workflows and remove blockers to boost productivity.'
                  : selectedTeamData.communicationHealth < 80
                  ? 'Implement better communication tools and practices.'
                  : 'Leverage this high-performing team to mentor other teams.'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}