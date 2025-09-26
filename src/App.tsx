import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard, { DashboardView } from './components/Dashboard';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('network');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} activeView={activeView} onViewChange={(v) => setActiveView(v as DashboardView)} />
          <Dashboard activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>
    </UserProvider>
  );
}

export default App;