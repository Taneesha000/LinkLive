import { 
  BarChart3, 
  Network, 
  Waves, 
  Zap, 
  Users, 
  MessageCircle, 
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['visualizations']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: 'visualizations',
      title: 'Visualizations',
      icon: Waves,
      items: [
        { name: 'Network Graph', icon: Network, active: true },
        { name: 'Communication Flow', icon: MessageCircle },
        { name: 'Interaction Patterns', icon: BarChart3 },
        { name: 'Real-time Feed', icon: Zap }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: TrendingUp,
      items: [
        { name: 'Social Metrics', icon: Users },
        { name: 'Engagement Trends', icon: TrendingUp },
        { name: 'Sentiment Analysis', icon: MessageCircle }
      ]
    }
  ];

  return (
    <aside className={`
      bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-16'} flex flex-col h-screen
    `}>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {menuItems.map((section) => (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 transition-all duration-200
                  ${isOpen ? 'px-3' : 'px-2 justify-center'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <section.icon size={20} />
                  {isOpen && <span className="font-medium">{section.title}</span>}
                </div>
                {isOpen && (
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                      expandedSections.includes(section.id) ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </button>
              
              {isOpen && expandedSections.includes(section.id) && (
                <div className="ml-4 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      className={`
                        w-full flex items-center space-x-3 p-2 rounded-lg text-sm transition-all duration-200
                        ${item.active 
                          ? 'text-cyan-400 bg-cyan-400/10 border-l-2 border-cyan-400' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                    >
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className={`
          w-full flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200
          ${isOpen ? 'justify-start' : 'justify-center'}
        `}>
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </button>
        <button className={`
          w-full flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200
          ${isOpen ? 'justify-start' : 'justify-center'}
        `}>
          <HelpCircle size={20} />
          {isOpen && <span>Help</span>}
        </button>
      </div>
    </aside>
  );
}