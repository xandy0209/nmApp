import React from 'react';
import { FileText } from 'lucide-react';

interface GroupTaskDetailActionProps {
  taskStatus: string;
  handleAccept: () => void;
}

const GroupTaskDetailAction: React.FC<GroupTaskDetailActionProps> = ({ taskStatus, handleAccept }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {taskStatus === '待受理' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">任务待受理</h3>
          <p className="text-sm text-gray-500 mb-6">请确认受理该任务后进行集中预约</p>
          <button onClick={handleAccept} className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium active:bg-blue-600 transition-colors">
            确认受理
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">集中预约</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
              <div className="text-xs text-blue-600 mb-1">上次预约时间</div>
              <div className="text-sm font-medium text-blue-800">2025-02-12 09:00 - 12:00</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">开始时间</label>
              <input type="datetime-local" className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">结束时间</label>
              <input type="datetime-local" className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
            </div>
          </div>
          
          <button className="w-full bg-[#2ea2e6] text-white py-2.5 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors">
            确认预约 / 改约
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">操作将更新本次任务下所有关联工单的预约时间</p>
        </div>
      )}
    </div>
  );
};

export default GroupTaskDetailAction;
