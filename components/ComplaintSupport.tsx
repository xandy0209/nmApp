import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, ChevronLeft, Clock, User, AlertCircle, FileText, Phone } from 'lucide-react';
import { ComplaintRecord } from '../src/types/complaint';

interface ComplaintSupportProps {
  complaints: ComplaintRecord[];
  onItemClick?: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '待派发':
      return 'text-indigo-500 bg-indigo-50 border-indigo-200';
    case '待受理':
      return 'text-amber-500 bg-amber-50 border-amber-200';
    case '处理中':
      return 'text-blue-500 bg-blue-50 border-blue-200';
    case '待质检':
      return 'text-purple-500 bg-purple-50 border-purple-200';
    case '已完成':
      return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    case '已驳回':
      return 'text-red-500 bg-red-50 border-red-200';
    case '撤单':
      return 'text-red-500 bg-red-50 border-red-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

const todoStatusTabs = ['全部', '待受理', '处理中', '待质检', '已驳回'];
const doneStatusTabs = ['全部', '处理中', '待质检', '已完成'];

const ComplaintSupport: React.FC<ComplaintSupportProps> = ({ complaints, onItemClick }) => {
  const [activeTab, setActiveTab] = useState<'TODO' | 'DONE'>('TODO');
  const [activeStatusTab, setActiveStatusTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [activeTab]);

  const currentStatusTabs = activeTab === 'TODO' ? todoStatusTabs : doneStatusTabs;

  const filteredData = complaints.filter(item => {
    const matchesTab = item.tab === activeTab;
    const matchesStatus = activeStatusTab === '全部' || item.status === activeStatusTab;

    const matchesSearch = 
      item.id.includes(searchQuery) || 
      item.title.includes(searchQuery) || 
      item.customerName.includes(searchQuery);
    return matchesTab && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-full flex flex-col w-full relative">
      <div className="sticky top-0 z-30 bg-gray-50">
        {/* Tabs */}
        <div className="bg-white flex border-b border-gray-200 shrink-0">
          <button
            onClick={() => {
              setActiveTab('TODO');
              setActiveStatusTab('全部');
            }}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              activeTab === 'TODO' ? 'text-[#2ea2e6]' : 'text-gray-600'
            }`}
          >
            待办工单
            {activeTab === 'TODO' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('DONE');
              setActiveStatusTab('全部');
            }}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              activeTab === 'DONE' ? 'text-[#2ea2e6]' : 'text-gray-600'
            }`}
          >
            已办工单
            {activeTab === 'DONE' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="bg-white px-4 py-3 shadow-sm z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="工单编号/客户名称/客户编号/业务标识/电路编号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="relative bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="absolute left-0 top-0 h-11 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none flex items-center justify-start pl-1 z-20">
            <ChevronLeft className={`w-4 h-4 transition-colors ${canScrollLeft ? 'text-gray-600' : 'text-gray-300'}`} />
          </div>
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="px-6 flex overflow-x-auto scrollbar-hide"
          >
            <div className="flex min-w-full justify-between space-x-4">
              {currentStatusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={`px-3 py-3 text-sm font-medium text-center whitespace-nowrap shrink-0 relative flex items-center justify-center h-11 ${
                    activeStatusTab === tab ? 'text-[#2ea2e6]' : 'text-gray-500'
                  }`}
                >
                  {tab}
                  {activeStatusTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-11 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1 z-20">
            <ChevronRight className={`w-4 h-4 transition-colors ${canScrollRight ? 'text-gray-600' : 'text-gray-300'}`} />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onItemClick && onItemClick(item.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-900">{item.id}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  {item.customerName}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">故障时间:</span>
                  <span className="text-xs text-gray-800">{item.createTime}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">投诉人:</span>
                  <span className="text-xs text-gray-800">{item.contactPerson} {item.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">区域:</span>
                  <span className="text-xs text-gray-800">{item.city} - {item.county}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-gray-50">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-400">{item.createTime}</span>
                </div>
                <div className="flex items-center text-[#2ea2e6] text-sm font-medium">
                  {item.tab === 'TODO' ? (
                    item.status === '待受理' ? '受理' :
                    item.status === '处理中' ? '处理' :
                    item.status === '待质检' ? '质检' : '去处理'
                  ) : '查看详情'}
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">暂无相关数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintSupport;
