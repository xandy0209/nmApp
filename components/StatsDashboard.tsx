import React from 'react';

// Helper component for the vertical separator
const Separator = () => (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/3 w-[1px] bg-blue-200/40"></div>
);

const StatsDashboard: React.FC = () => {
  return (
    <div className="relative">
      <div className="bg-[#4d86d6] text-white pt-2 pb-6 px-2 shadow-md">
        <div className="grid grid-cols-7 gap-y-2 items-center">
          
          {/* Row 1: Left Item (Special Line) */}
          <div className="col-span-1 text-center relative flex items-center justify-center h-full">
            <span className="text-xs font-medium">专线</span>
            <Separator />
          </div>

          {/* Row 1: Data Items */}
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">开通</div>
            <div className="text-base font-bold">190</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">勘查</div>
            <div className="text-base font-bold">75</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">变更</div>
            <div className="text-base font-bold">410</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">故障</div>
            <div className="text-base font-bold">30</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">投诉</div>
            <div className="text-base font-bold">120</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-[10px] text-blue-100 mb-0.5">拆除</div>
            <div className="text-base font-bold">0</div>
          </div>

        </div>
      </div>

      {/* The Tab Shape at the bottom */}
      <div className="absolute bottom-[-16px] left-0 w-full flex justify-center z-10">
        <div className="relative">
            {/* The trapezoid shape created via borders or background clip. Using SVG for precision. */}
            <svg width="160" height="24" viewBox="0 0 160 24" className="drop-shadow-sm">
                <path d="M0,0 L16,24 L144,24 L160,0 Z" fill="#4d86d6" />
                <text x="80" y="16" fontSize="11" fill="white" textAnchor="middle" fontWeight="500">运维工单</text>
            </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;