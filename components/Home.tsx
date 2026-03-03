import React from 'react';
import MapSection from './MapSection';
import StatsDashboard from './StatsDashboard';
import GridMenu from './GridMenu';

interface HomeProps {
  onMenuClick: (label: string) => void;
}

const Home: React.FC<HomeProps> = ({ onMenuClick }) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
      {/* Map Section - Reduced Height */}
      <div className="relative w-full h-[220px] shrink-0">
        {/* Background Blue Extension */}
        <div className="absolute top-0 left-0 w-full h-16 bg-[#2ea2e6] z-0"></div>

        {/* Map Card */}
        <div className="relative z-10 h-full">
          <MapSection />
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="shrink-0 mt-[-20px] relative z-20">
        <StatsDashboard />
      </div>

      {/* Menu Grid */}
      <div className="mt-4 px-4 shrink-0 pb-20">
        <GridMenu onMenuClick={onMenuClick} />
      </div>
    </div>
  );
};

export default Home;
