import React from 'react';
import { FileText } from 'lucide-react';

interface GroupOrderDetailActionProps {
  orderStatus: string;
  handleAccept: () => void;
}

const GroupOrderDetailAction: React.FC<GroupOrderDetailActionProps> = ({ orderStatus, handleAccept }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {orderStatus === '待受理' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">团单待受理</h3>
          <p className="text-sm text-gray-500 mb-6">请确认受理该团单后进行任务分派</p>
          <button onClick={handleAccept} className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium active:bg-blue-600 transition-colors">
            确认受理
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">任务分派</h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">分派层级</label>
              <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                <option>地市级</option>
                <option>旗县级</option>
                <option>网格级</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">交付经理</label>
              <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                <option>李明 (呼和浩特市)</option>
                <option>王坤鹏 (包头市)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">分派说明</label>
              <textarea className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 h-20" placeholder="请输入分派说明..."></textarea>
            </div>
          </div>
          <button className="w-full bg-[#2ea2e6] text-white py-2.5 rounded-lg font-medium active:bg-blue-600 transition-colors text-sm">
            确认分派
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupOrderDetailAction;
