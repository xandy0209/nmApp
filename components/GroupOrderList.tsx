import React from 'react';
import { Star, User, Activity, CheckCircle2, AlertCircle, Clock, ChevronRight, FileText } from 'lucide-react';

interface GroupOrderListProps {
  data: any[];
  onItemClick?: (type: 'ORDER' | 'TASK', id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '待受理': return 'text-amber-500 bg-amber-50 border-amber-200';
    case '处理中': return 'text-blue-500 bg-blue-50 border-blue-200';
    case '待回单': return 'text-purple-500 bg-purple-50 border-purple-200';
    case '已完成': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    case '撤单': return 'text-red-500 bg-red-50 border-red-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case '省级': return 'bg-red-100 text-red-600';
    case '地市级': return 'bg-orange-100 text-orange-600';
    case '旗县级': return 'bg-blue-100 text-blue-600';
    case '网格级': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const GroupOrderList: React.FC<GroupOrderListProps> = ({ data, onItemClick }) => {
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
        <div 
          key={item.id} 
          onClick={() => onItemClick && onItemClick('ORDER', item.id)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors cursor-pointer"
        >
          {/* Header: ID and Status */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <Star 
                className={`w-4 h-4 shrink-0 ${item.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
              <span className="text-sm font-medium text-gray-900">{item.id}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          
          {/* Title & Level */}
          <div className="mb-3">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] mr-2 align-middle ${getLevelColor(item.level)}`}>
              {item.level}
            </span>
            <span className="text-sm font-bold text-gray-800 align-middle leading-tight">
              {item.name}
            </span>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 gap-y-2 mb-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">交付经理:</span>
              <span className="text-xs text-gray-800">{item.manager}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">竣工率:</span>
              <span className="text-xs text-gray-800">{item.completionRate}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">进度:</span>
              <span className="text-xs text-gray-800">{item.progress}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">剩余:</span>
              <span className={`text-xs font-medium ${item.remainingTime === '-' ? 'text-gray-800' : 'text-red-500'}`}>
                {item.remainingTime}
              </span>
            </div>
          </div>

          {/* Footer: Time and Action */}
          <div className="pt-2 flex justify-between items-center">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-400">{item.receiveTime}</span>
            </div>
            <div className="flex items-center text-[#2ea2e6] text-sm font-medium">
              {item.status === '已完成' ? '查看' : '处理'}
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupOrderList;
