import React, { useState } from 'react';
import { ShieldCheck, Clock, Tag, Box, Hash, AlertCircle, Search, MapPin, ChevronLeft } from 'lucide-react';

interface RemoteDisposalEvent {
  id: string;
  title: string;
  number: string;
  time: string;
  status: string;
  businessType: string;
  productIdentifier: string;
  city: string;
  customerName: string;
}

const mockEvents: RemoteDisposalEvent[] = [
  {
    id: '1',
    title: '内蒙古一机集团-互联网专线-20969199081-时延-质差',
    number: 'EVT-20240415-001',
    time: '2024-04-15 10:30:22',
    status: '进行中',
    businessType: '互联网专线',
    productIdentifier: 'KD_88291022',
    city: '呼和浩特市',
    customerName: '主要一机集团'
  },
  {
    id: '2',
    title: '包头钢铁贸易-5G移网-13800138000-信号质差-质差',
    number: 'EVT-20240415-002',
    time: '2024-04-15 11:15:45',
    status: '待处理',
    businessType: '5G移网',
    productIdentifier: 'MB_13800138000',
    city: '包头市',
    customerName: '包头某钢铁贸易公司'
  },
  {
    id: '3',
    title: '鄂尔多斯能源-企宽专线-ZX_NM_ORD_001-高延迟-质差',
    number: 'EVT-20240415-003',
    time: '2024-04-15 09:20:10',
    status: '已处理',
    businessType: '企宽专线',
    productIdentifier: 'ZX_NM_ORD_001',
    city: '鄂尔多斯市',
    customerName: '鄂尔多斯能源'
  },
  {
    id: '4',
    title: '赤峰教育局-IPTV业务-TV_99102233-播放卡顿-质差',
    number: 'EVT-20240415-004',
    time: '2024-04-15 14:05:30',
    status: '处理中',
    businessType: 'IPTV业务',
    productIdentifier: 'TV_99102233',
    city: '赤峰市',
    customerName: '赤峰教育局'
  },
  {
    id: '5',
    title: '通辽物流园-家庭宽带-KD_77102244-频繁掉线-质差',
    number: 'EVT-20240415-005',
    time: '2024-04-15 15:30:12',
    status: '待处理',
    businessType: '家庭宽带',
    productIdentifier: 'KD_77102244',
    city: '通辽市',
    customerName: '王五'
  }
];

const cities = ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'];

const EventCard: React.FC<{ event: RemoteDisposalEvent; onDispose: (event: RemoteDisposalEvent) => void }> = ({ event, onDispose }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 mx-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800 text-base leading-snug">{event.title}</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Hash size={14} className="text-gray-400 mr-2" />
          <span className="text-gray-500 mr-2 shrink-0">事件编号：</span>
          <span className="text-gray-700 font-mono">{event.number}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock size={14} className="text-gray-400 mr-2" />
          <span className="text-gray-500 mr-2 shrink-0">发生时间：</span>
          <span className="text-gray-700">{event.time}</span>
        </div>

        <div className="pt-2 border-t border-gray-50 mt-1 space-y-2">
          <div className="flex items-center text-sm">
            <MapPin size={14} className="text-gray-400 mr-2 shrink-0" />
            <span className="text-gray-500 mr-1 shrink-0">地市：</span>
            <span className="text-gray-700 truncate">{event.city}</span>
          </div>
          <div className="flex items-center text-sm">
            <Tag size={14} className="text-gray-400 mr-2 shrink-0" />
            <span className="text-gray-500 mr-1 shrink-0">业务类型：</span>
            <span className="text-gray-700 truncate">{event.businessType}</span>
          </div>
        </div>

        <div className="flex items-center text-sm pt-1">
          <Box size={14} className="text-gray-400 mr-2 shrink-0" />
          <span className="text-gray-500 mr-1 shrink-0">产品实例：</span>
          <span className="text-gray-700 truncate font-mono">{event.productIdentifier}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => onDispose(event)}
          className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100 transition-colors"
        >
          远程处置
        </button>
      </div>
    </div>
  );
};

const QualityCheckRemoteDisposal: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  
  // Disposal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RemoteDisposalEvent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [disposalResult, setDisposalResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSearch = () => {
    setFilterKeyword(keyword);
  };

  const filteredEvents = mockEvents.filter(event => {
    return (
      (filterKeyword === '' || 
        event.customerName.includes(filterKeyword) || 
        event.number.includes(filterKeyword) ||
        event.title.includes(filterKeyword))
    );
  });

  const initiateDisposal = (event: RemoteDisposalEvent) => {
    setSelectedEvent(event);
    setShowConfirm(true);
    setDisposalResult(null);
  };

  const executeDisposal = () => {
    setIsProcessing(true);
    // Simulate RMS API Call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirm(false);
      
      const rand = Math.random();
      let result;
      if (rand > 0.4) {
        result = { success: true, message: '执行成功' };
      } else if (rand > 0.2) {
        result = { success: false, message: '设备不在线' };
      } else {
        result = { success: false, message: '设备不存在' };
      }
      
      setDisposalResult(result);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 py-3 relative">
      {/* Search Section */}
      <div className="px-4 mb-4">
        <div className="relative flex items-center bg-white rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <input 
            type="text" 
            placeholder="请输入客户名称、事件编号" 
            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onDispose={initiateDisposal} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} className="mb-4 opacity-10" />
            <p className="text-sm">未找到匹配的事件</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-500 mb-4 mx-auto">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">远程处置确认</h3>
              <p className="text-sm text-gray-500 text-center leading-relaxed">
                远程处置会中断业务，确认对该质差执行远程处置吗？
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl active:bg-gray-50 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button 
                onClick={executeDisposal}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center active:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    执行中...
                  </>
                ) : '确认执行'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {disposalResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                disposalResult.success ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
              }`}>
                {disposalResult.success ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
              </div>
              {disposalResult.success ? (
                <p className="text-emerald-600 text-sm font-medium mb-1">
                  操作成功
                </p>
              ) : (
                <p className="text-rose-600 text-sm font-medium mb-1">
                  操作失败
                </p>
              )}
              <p className="text-gray-800 text-lg font-bold">
                {disposalResult.message}
              </p>
            </div>
            <div className="p-4 bg-gray-50">
              {disposalResult.success ? (
                <button 
                  onClick={() => setDisposalResult(null)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white active:bg-emerald-700 transition-colors shadow-sm"
                >
                  确定
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDisposalResult(null)}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 active:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    不再执行远程处置
                  </button>
                  <button 
                    onClick={executeDisposal}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl text-sm font-bold bg-gray-800 text-white active:bg-black transition-colors shadow-sm flex items-center justify-center disabled:bg-gray-600"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        执行中...
                      </>
                    ) : '重试'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityCheckRemoteDisposal;
