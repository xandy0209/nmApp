import React from 'react';

interface GroupTaskDetailProcessProps {
  logs: any[];
}

const GroupTaskDetailProcess: React.FC<GroupTaskDetailProcessProps> = ({ logs }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">流程进度</h3>
        <div className="flex justify-between items-center px-2">
          {['分派', '受理', '处理', '完成'].map((step, idx) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${idx <= 1 ? 'bg-[#2ea2e6] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                {idx + 1}
              </div>
              <span className={`text-xs ${idx <= 1 ? 'text-[#2ea2e6] font-medium' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
          {/* Connecting lines background */}
          <div className="absolute left-10 right-10 h-0.5 bg-gray-200 top-8 z-0"></div>
          <div className="absolute left-10 w-1/3 h-0.5 bg-[#2ea2e6] top-8 z-0"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">操作记录</h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {logs.map((log, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#2ea2e6] text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 text-sm">{log.action}</span>
                  <span className="text-xs text-gray-500">{log.user}</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">{log.desc}</div>
                <div className="text-[10px] text-gray-400">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupTaskDetailProcess;
