import React, { useEffect, useRef, useState } from 'react';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number;
  influence: number;
  health: number;
  group: string;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  lastInteraction: number;
}

export default function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'influence' | 'health' | 'activity'>('influence');

  // Generate mock social network data
  useEffect(() => {
    const generateNetwork = () => {
      const nodeNames = [
        'Alex Chen', 'Sarah Kim', 'Marcus Johnson', 'Emily Zhang', 'David Wilson',
        'Priya Patel', 'James Rodriguez', 'Maya Thompson', 'Kevin Lee', 'Zoe Adams',
        'Ryan Mitchell', 'Lisa Wang', 'Carlos Silva', 'Nina Foster', 'Tom Baker'
      ];

      const groups = ['Engineering', 'Design', 'Marketing', 'Sales', 'Leadership'];
      
      const newNodes: Node[] = nodeNames.map((name, index) => ({
        id: `node-${index}`,
        name,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
        radius: 8 + Math.random() * 12,
        connections: Math.floor(Math.random() * 8) + 2,
        influence: Math.random() * 100,
        health: 60 + Math.random() * 40,
        group: groups[Math.floor(Math.random() * groups.length)]
      }));

      const newConnections: Connection[] = [];
      for (let i = 0; i < newNodes.length; i++) {
        const connectionsCount = Math.floor(Math.random() * 4) + 2;
        for (let j = 0; j < connectionsCount; j++) {
          const targetIndex = Math.floor(Math.random() * newNodes.length);
          if (targetIndex !== i) {
            newConnections.push({
              source: newNodes[i].id,
              target: newNodes[targetIndex].id,
              strength: Math.random(),
              lastInteraction: Date.now() - Math.random() * 86400000 * 7
            });
          }
        }
      }

      setNodes(newNodes);
      setConnections(newConnections);
    };

    generateNetwork();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw connections
      connections.forEach(conn => {
        const source = nodes.find(n => n.id === conn.source);
        const target = nodes.find(n => n.id === conn.target);
        if (!source || !target) return;

        const opacity = conn.strength * 0.6;
        const recentActivity = (Date.now() - conn.lastInteraction) < 86400000;
        
        ctx.strokeStyle = recentActivity 
          ? `rgba(34, 211, 238, ${opacity})`
          : `rgba(107, 114, 128, ${opacity * 0.3})`;
        ctx.lineWidth = conn.strength * 3;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();

        // Add particle effect for active connections
        if (recentActivity && Math.random() < 0.3) {
          const t = Math.random();
          const x = source.x + (target.x - source.x) * t;
          const y = source.y + (target.y - source.y) * t;
          
          ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode?.id === node.id;
        let color, size;
        
        switch (selectedMetric) {
          case 'influence':
            const influenceIntensity = node.influence / 100;
            color = `rgba(147, 51, 234, ${0.3 + influenceIntensity * 0.7})`;
            size = node.radius + influenceIntensity * 8;
            break;
          case 'health':
            const healthIntensity = node.health / 100;
            color = node.health > 80 
              ? `rgba(34, 197, 94, ${0.3 + healthIntensity * 0.7})`
              : node.health > 60
              ? `rgba(234, 179, 8, ${0.3 + healthIntensity * 0.7})`
              : `rgba(239, 68, 68, ${0.3 + healthIntensity * 0.7})`;
            size = node.radius;
            break;
          default:
            color = 'rgba(34, 211, 238, 0.7)';
            size = node.radius;
        }

        // Outer glow
        if (isHovered) {
          ctx.fillStyle = color.replace(/[\d\.]+\)$/g, '0.2)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Apply forces for natural movement
        node.vx += (Math.random() - 0.5) * 0.1;
        node.vy += (Math.random() - 0.5) * 0.1;
        
        // Boundary forces
        if (node.x < size) node.vx += 0.5;
        if (node.x > rect.width - size) node.vx -= 0.5;
        if (node.y < size) node.vy += 0.5;
        if (node.y > rect.height - size) node.vy -= 0.5;

        // Apply velocity with damping
        node.vx *= 0.98;
        node.vy *= 0.98;
        node.x += node.vx;
        node.y += node.vy;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections, hoveredNode, selectedMetric]);

  // Handle mouse interactions
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius + 5;
    });

    setHoveredNode(hoveredNode || null);
  };

  const stats = {
    totalConnections: connections.length,
    avgHealth: Math.round(nodes.reduce((sum, n) => sum + n.health, 0) / nodes.length),
    topInfluencer: nodes.reduce((max, node) => node.influence > max.influence ? node : max, nodes[0]),
    activeToday: connections.filter(c => (Date.now() - c.lastInteraction) < 86400000).length
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => setSelectedMetric('influence')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedMetric === 'influence'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
          }`}
        >
          Influence
        </button>
        <button
          onClick={() => setSelectedMetric('health')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedMetric === 'health'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
          }`}
        >
          Health
        </button>
        <button
          onClick={() => setSelectedMetric('activity')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedMetric === 'activity'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
          }`}
        >
          Activity
        </button>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10 grid grid-cols-2 gap-3">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <Users size={16} className="text-cyan-400 mx-auto mb-1" />
          <div className="text-white font-bold">{stats.totalConnections}</div>
          <div className="text-gray-400 text-xs">Connections</div>
        </div>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <Activity size={16} className="text-green-400 mx-auto mb-1" />
          <div className="text-white font-bold">{stats.avgHealth}%</div>
          <div className="text-gray-400 text-xs">Avg Health</div>
        </div>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <TrendingUp size={16} className="text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold">{Math.round(stats.topInfluencer?.influence || 0)}</div>
          <div className="text-gray-400 text-xs">Top Influence</div>
        </div>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <AlertTriangle size={16} className="text-yellow-400 mx-auto mb-1" />
          <div className="text-white font-bold">{stats.activeToday}</div>
          <div className="text-gray-400 text-xs">Active Today</div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <h3 className="text-white font-bold mb-2">{hoveredNode.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Group:</span>
              <span className="text-white">{hoveredNode.group}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Connections:</span>
              <span className="text-white">{hoveredNode.connections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Influence:</span>
              <span className="text-purple-400">{Math.round(hoveredNode.influence)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className={`${
                hoveredNode.health > 80 ? 'text-green-400' :
                hoveredNode.health > 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {Math.round(hoveredNode.health)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}