import React from 'react';
import { FileText } from 'lucide-react';

interface ManagerListProps {
  data: any[];
}

const getLevelColor = (level: string) => {
  switch (level) {
    case '省级': return 'bg-red-100 text-red-600';
    case '地市级': return 'bg-orange-100 text-orange-600';
    case '旗县级': return 'bg-blue-100 text-blue-600';
    case '网格级': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const ManagerList: React.FC<ManagerListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">暂无相关数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item: any) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {item.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  {item.name}
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.phone}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-y-2 gap-x-4">
            <div className="text-xs text-gray-500 flex justify-between">
              <span>管辖:</span> <span className="text-gray-800 font-medium">{(item.jurisdiction && item.jurisdiction.length > 0) ? item.jurisdiction.join('、') : '-'}</span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>地市:</span> <span className="text-gray-800 font-medium">{item.city}</span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>旗县:</span> <span className="text-gray-800 font-medium">{item.county || '-'}</span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>网格:</span> <span className="text-gray-800 font-medium">{item.grid || '-'}</span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>公司:</span> <span className="text-gray-800 font-medium">{item.company || '-'}</span>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
            <button className="text-sm text-blue-500 font-medium px-2 py-1 active:bg-blue-50 rounded">编辑</button>
            <button className="text-sm text-red-500 font-medium px-2 py-1 active:bg-red-50 rounded">删除</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManagerList;
