import React, { useState, useEffect, useRef } from 'react';
import { Calendar, TrendingUp, Users, MessageCircle, Zap, Filter } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'interaction' | 'milestone' | 'conflict' | 'collaboration' | 'achievement';
  title: string;
  description: string;
  participants: string[];
  impact: number;
  sentiment: number;
  category: string;
}

interface TimelineMetrics {
  totalInteractions: number;
  avgSentiment: number;
  collaborationScore: number;
  conflictResolved: number;
}

export default function InteractiveTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate mock timeline data
    const generateEvents = () => {
      const eventTypes = ['interaction', 'milestone', 'conflict', 'collaboration', 'achievement'] as const;
      const categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'General'];
      const participants = ['Alex Chen', 'Sarah Kim', 'Marcus Johnson', 'Emily Zhang', 'David Wilson', 'Priya Patel'];
      
      const mockEvents: TimelineEvent[] = [];
      
      for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const event: TimelineEvent = {
          id: `event-${i}`,
          timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          title: generateEventTitle(),
          description: generateEventDescription(),
          participants: participants.slice(0, Math.floor(Math.random() * 4) + 1),
          impact: Math.floor(Math.random() * 100),
          sentiment: Math.random(),
          category: categories[Math.floor(Math.random() * categories.length)]
        };
        mockEvents.push(event);
      }
      
      return mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    function generateEventTitle(): string {
      const titles = [
        'Team Collaboration Session',
        'Cross-Department Meeting',
        'Project Milestone Achieved',
        'Conflict Resolution Discussion',
        'Knowledge Sharing Workshop',
        'Sprint Planning Meeting',
        'Design Review Session',
        'Client Presentation',
        'Team Building Activity',
        'Innovation Brainstorm'
      ];
      return titles[Math.floor(Math.random() * titles.length)];
    }

    function generateEventDescription(): string {
      const descriptions = [
        'Productive discussion leading to better alignment',
        'Successfully resolved communication challenges',
        'Significant progress on key deliverables',
        'Enhanced team collaboration and understanding',
        'Breakthrough in project planning',
        'Improved cross-functional coordination',
        'Valuable insights shared across teams',
        'Strong positive feedback from participants',
        'New processes implemented for efficiency',
        'Innovation ideas generated for future projects'
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    setEvents(generateEvents());
  }, []);

  const filteredEvents = events.filter(event => {
    // Filter by type
    if (selectedType !== 'all' && event.type !== selectedType) return false;
    
    // Filter by time period
    const now = Date.now();
    const eventTime = event.timestamp.getTime();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000
    };
    
    return (now - eventTime) <= periodMs[selectedPeriod];
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interaction': return <MessageCircle className="text-cyan-400" size={16} />;
      case 'milestone': return <TrendingUp className="text-green-400" size={16} />;
      case 'conflict': return <Zap className="text-red-400" size={16} />;
      case 'collaboration': return <Users className="text-purple-400" size={16} />;
      case 'achievement': return <TrendingUp className="text-yellow-400" size={16} />;
      default: return <Calendar className="text-gray-400" size={16} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'interaction': return 'border-cyan-400 bg-cyan-400/10';
      case 'milestone': return 'border-green-400 bg-green-400/10';
      case 'conflict': return 'border-red-400 bg-red-400/10';
      case 'collaboration': return 'border-purple-400 bg-purple-400/10';
      case 'achievement': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffMinutes = Math.floor(diffMs / (60 * 1000));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const metrics: TimelineMetrics = {
    totalInteractions: filteredEvents.length,
    avgSentiment: Math.round(filteredEvents.reduce((sum, e) => sum + e.sentiment, 0) / filteredEvents.length * 100),
    collaborationScore: Math.round(filteredEvents.filter(e => e.type === 'collaboration').length / filteredEvents.length * 100),
    conflictResolved: filteredEvents.filter(e => e.type === 'conflict').length
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Calendar className="text-cyan-400" size={24} />
          <span>Interactive Timeline</span>
        </h2>
        
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Events</option>
            <option value="interaction">Interactions</option>
            <option value="milestone">Milestones</option>
            <option value="conflict">Conflicts</option>
            <option value="collaboration">Collaborations</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>
      </div>

      {/* Timeline Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <MessageCircle className="text-cyan-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{metrics.totalInteractions}</div>
          <div className="text-gray-400 text-sm">Total Events</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <TrendingUp className="text-green-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{metrics.avgSentiment}%</div>
          <div className="text-gray-400 text-sm">Avg Sentiment</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Users className="text-purple-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{metrics.collaborationScore}%</div>
          <div className="text-gray-400 text-sm">Collaboration</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Zap className="text-yellow-400 mx-auto mb-2" size={20} />
          <div className="text-white text-xl font-bold">{metrics.conflictResolved}</div>
          <div className="text-gray-400 text-sm">Conflicts</div>
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative max-h-96 overflow-y-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-transparent"></div>
          
          {/* Timeline Events */}
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="relative flex items-start space-x-4 hover:bg-gray-800/30 rounded-lg p-3 transition-all duration-200"
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Timeline Dot */}
                <div className={`relative z-10 w-6 h-6 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center`}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <span className="text-gray-400 text-sm">{formatRelativeTime(event.timestamp)}</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-gray-400">
                        Category: <span className="text-cyan-400">{event.category}</span>
                      </span>
                      <span className="text-gray-400">
                        Impact: <span className={`${event.impact > 70 ? 'text-green-400' : event.impact > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {event.impact}%
                        </span>
                      </span>
                      <span className="text-gray-400">
                        Sentiment: <span className={`${event.sentiment > 0.7 ? 'text-green-400' : event.sentiment > 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {Math.round(event.sentiment * 100)}%
                        </span>
                      </span>
                    </div>
                    
                    <div className="flex space-x-1">
                      {event.participants.slice(0, 3).map((participant, pIndex) => (
                        <span
                          key={pIndex}
                          className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                        >
                          {participant.split(' ')[0]}
                        </span>
                      ))}
                      {event.participants.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                          +{event.participants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Sentiment Bar */}
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-1 rounded-full"
                        style={{ width: `${event.sentiment * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Popup */}
      {hoveredEvent && (
        <div className="absolute bottom-4 right-4 z-20 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 max-w-sm border border-gray-700">
          <h4 className="text-white font-medium mb-2">{hoveredEvent.title}</h4>
          <p className="text-gray-300 text-sm mb-2">{hoveredEvent.description}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{hoveredEvent.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Participants:</span>
              <span className="text-white">{hoveredEvent.participants.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Impact Score:</span>
              <span className="text-cyan-400">{hoveredEvent.impact}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Analysis */}
      <div className="mt-4 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/20">
        <h4 className="text-cyan-400 font-medium mb-2 flex items-center space-x-2">
          <Filter size={16} />
          <span>Pattern Insights</span>
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-300">
              {metrics.collaborationScore > 80 
                ? 'High collaboration period with strong cross-team engagement.'
                : metrics.collaborationScore > 50
                ? 'Moderate collaboration levels. Consider more team activities.'
                : 'Low collaboration detected. Team building recommended.'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-300">
              {metrics.avgSentiment > 80
                ? 'Positive sentiment trend. Team morale is high.'
                : metrics.avgSentiment > 60
                ? 'Mixed sentiment. Monitor for potential issues.'
                : 'Declining sentiment. Attention needed for team wellbeing.'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}