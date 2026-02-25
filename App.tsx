import React, { useState } from 'react';
import Header from './components/Header';
import MapSection from './components/MapSection';
import StatsDashboard from './components/StatsDashboard';
import GridMenu from './components/GridMenu';
import StatusBar from './components/StatusBar';
import IMSQuery from './components/IMSQuery';
import { MessageCircleMore } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'IMS_QUERY'>('HOME');

  const handleMenuClick = (label: string) => {
    if (label === 'IMS固话查询') {
      setCurrentView('IMS_QUERY');
    }
    // Handle other menu items if needed
  };

  const handleBack = () => {
    setCurrentView('HOME');
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center w-full overflow-hidden">
      <div className="w-full h-full sm:h-[844px] sm:max-h-[95vh] sm:max-w-[390px] bg-white shadow-2xl flex flex-col relative sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 overflow-hidden">
        
        {/* Mobile Status Bar */}
        <StatusBar />

        {/* Top Header */}
        <Header 
          title={currentView === 'HOME' ? '首页' : 'IMS固话查询'}
          showBack={currentView !== 'HOME'}
          showRightIcon={currentView === 'HOME'}
          onBack={handleBack}
        />

        {currentView === 'HOME' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="relative flex-1 min-h-0">
              {/* Background Blue Extension */}
              <div className="absolute top-0 left-0 w-full h-16 bg-[#2ea2e6] z-0"></div>

              {/* Map Card */}
              <div className="relative z-10 h-full">
                <MapSection />
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="mt-0 flex-none">
              <StatsDashboard />
            </div>

            {/* Menu Grid */}
            <div className="mt-6 px-4 flex-none pb-6">
              <GridMenu onMenuClick={handleMenuClick} />
            </div>

            {/* Floating Chat Bubble (Bottom Right) */}
            <div className="absolute bottom-6 right-4 z-50">
              <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100">
                 <MessageCircleMore className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {currentView === 'IMS_QUERY' && (
          <div className="flex-1 overflow-y-auto">
            <IMSQuery />
          </div>
        )}

      </div>
    </div>
  );
};

export default App;