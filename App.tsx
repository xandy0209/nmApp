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
    <div className="min-h-screen bg-gray-50 flex justify-center w-full">
      <div className={`w-full max-w-md bg-white shadow-xl min-h-screen relative ${currentView === 'HOME' ? 'pb-10' : ''}`}>
        
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
          <>
            <div className="relative">
              {/* Background Blue Extension */}
              <div className="absolute top-0 left-0 w-full h-16 bg-[#2ea2e6] z-0"></div>

              {/* Map Card */}
              <div className="relative z-10">
                <MapSection />
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="mt-0">
              <StatsDashboard />
            </div>

            {/* Menu Grid */}
            <div className="mt-6 px-4">
              <GridMenu onMenuClick={handleMenuClick} />
            </div>

            {/* Floating Chat Bubble (Bottom Right) */}
            <div className="fixed bottom-24 right-4 z-50">
              <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100">
                 <MessageCircleMore className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </>
        )}

        {currentView === 'IMS_QUERY' && (
          <IMSQuery />
        )}

      </div>
    </div>
  );
};

export default App;