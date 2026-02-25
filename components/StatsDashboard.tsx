import React from 'react';

// Helper component for the vertical separator
const Separator = () => (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/3 w-[1px] bg-blue-200/40"></div>
);

const StatsDashboard: React.FC = () => {
  return (
    <div className="relative">
      <div className="bg-[#4d86d6] text-white pt-2 pb-8 px-2">
        <div className="grid grid-cols-7 gap-y-4 items-center">
          
          {/* Row 1: Left Item (Special Line) */}
          <div className="col-span-1 text-center relative flex items-center justify-center h-full">
            <span className="text-sm font-medium">专线</span>
            <Separator />
          </div>

          {/* Row 1: Data Items */}
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">开通</div>
            <div className="text-lg font-bold">190</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">勘查</div>
            <div className="text-lg font-bold">75</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">变更</div>
            <div className="text-lg font-bold">410</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">故障</div>
            <div className="text-lg font-bold">30</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">投诉</div>
            <div className="text-lg font-bold">120</div>
            <Separator />
          </div>
          <div className="col-span-1 text-center relative">
            <div className="text-xs text-blue-100 mb-1">拆除</div>
            <div className="text-lg font-bold">0</div>
          </div>

        </div>
      </div>

      {/* The Tab Shape at the bottom */}
      <div className="absolute bottom-[-18px] left-0 w-full flex justify-center">
        <div className="relative">
            {/* The trapezoid shape created via borders or background clip. Using SVG for precision. */}
            <svg width="200" height="30" viewBox="0 0 200 30" className="drop-shadow-sm">
                <path d="M0,0 L20,30 L180,30 L200,0 Z" fill="#4d86d6" />
                <text x="100" y="20" fontSize="13" fill="white" textAnchor="middle" fontWeight="500">运维工单</text>
            </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;