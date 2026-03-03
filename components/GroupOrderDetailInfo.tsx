import React from 'react';
import { User, MapPin } from 'lucide-react';

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-900 text-sm font-medium">{value}</span>
  </div>
);

interface GroupOrderDetailInfoProps {
  id: string;
  orderInfo: any;
  orderStatus: string;
  workOrders: any[];
  woTab: string;
  setWoTab: (tab: string) => void;
}

const GroupOrderDetailInfo: React.FC<GroupOrderDetailInfoProps> = ({
  id,
  orderInfo,
  orderStatus,
  workOrders,
  woTab,
  setWoTab,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">基本信息</h3>
        <InfoRow label="团单编号" value={id} />
        <InfoRow label="团单名称" value={orderInfo.name} />
        <InfoRow label="团单等级" value={orderInfo.level} />
        <InfoRow label="交付经理" value={orderInfo.manager} />
        <InfoRow label="当前状态" value={orderStatus} />
        <InfoRow label="竣工率" value={orderInfo.completionRate} />
        <InfoRow label="在途/派单量" value={orderInfo.progress} />
        <InfoRow label="剩余时限" value={orderInfo.remainingTime} />
        <InfoRow label="收单时间" value={orderInfo.receiveTime} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">工单清单</h3>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setWoTab('ALL')} className={`px-3 py-1 text-xs rounded-full ${woTab === 'ALL' ? 'bg-[#2ea2e6] text-white' : 'bg-gray-100 text-gray-600'}`}>全部</button>
          <button onClick={() => setWoTab('UNASSIGNED')} className={`px-3 py-1 text-xs rounded-full ${woTab === 'UNASSIGNED' ? 'bg-[#2ea2e6] text-white' : 'bg-gray-100 text-gray-600'}`}>未分派</button>
        </div>
        <div className="space-y-3">
          {workOrders.filter(wo => woTab === 'ALL' || wo.status === '待分派').map(wo => (
            <div key={wo.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm text-gray-800">{wo.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${wo.status === '待分派' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{wo.status}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{wo.title}</div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1"><User size={12}/> {wo.manager}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {wo.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupOrderDetailInfo;
