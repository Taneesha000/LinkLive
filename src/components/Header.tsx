import { Menu, Settings, User, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-xl font-bold text-white">SocialCanvas</h1>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search visualizations, patterns, or connections..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-gray-400 hover:text-cyan-400 transition-colors duration-200">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
          <Settings size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-white font-medium">Alex Chen</span>
        </div>
      </div>
    </header>
  );
}