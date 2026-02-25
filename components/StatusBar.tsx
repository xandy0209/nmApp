import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

const StatusBar: React.FC = () => {
  return (
    <div className="bg-[#2ea2e6] text-white px-4 py-2 flex items-center justify-between text-xs font-medium z-50 relative">
      <span>12:30</span>
      <div className="flex items-center space-x-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} />
      </div>
    </div>
  );
};

export default StatusBar;