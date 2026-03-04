import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronRight, ChevronLeft, Clock, User, Activity, AlertCircle, CheckCircle2, Star, FileText, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { GroupOrderRecord, GroupOrderTaskRecord, DeliveryManagerRecord } from '../src/types/groupOrder';

const orderTabs = ['全部', '收藏', '待受理', '处理中', '待回单', '已完成', '撤单'];
const taskTabs = ['全部', '待受理', '处理中', '已完成', '已撤单'];
const managerTabs = ['全部', '省级', '地市级', '旗县级', '网格级'];

const INNER_MONGOLIA_CITIES = [
  { code: '150100', name: '呼和浩特市' },
  { code: '150200', name: '包头市' },
  { code: '150400', name: '赤峰市' },
  { code: '150500', name: '通辽市' },
  { code: '150600', name: '鄂尔多斯市' },
  { code: '150700', name: '呼伦贝尔市' },
  { code: '150800', name: '巴彦淖尔市' },
  { code: '150900', name: '乌兰察布市' },
  { code: '152200', name: '兴安盟' },
  { code: '152500', name: '锡林郭勒盟' },
  { code: '152900', name: '阿拉善盟' },
  { code: '150300', name: '乌海市' },
];

const CASCADING_COUNTIES: Record<string, string[]> = {
    '呼和浩特市': ['赛罕区', '新城区', '回民区', '玉泉区', '土默特左旗', '托克托县'],
    '包头市': ['昆都仑区', '东河区', '青山区', '九原区', '土默特右旗', '固阳县'],
    '鄂尔多斯市': ['东胜区', '康巴什区', '达拉特旗', '准格尔旗'],
    '赤峰市': ['红山区', '松山区', '元宝山区', '阿鲁科尔沁旗'],
    '通辽市': ['科尔沁区', '开鲁县'],
    'default': ['市辖区', '某某县']
};

const getStatusColor = (status: string) => {
  switch (status) {
    case '待受理':
      return 'text-amber-500 bg-amber-50 border-amber-200';
    case '处理中':
      return 'text-blue-500 bg-blue-50 border-blue-200';
    case '待回单':
      return 'text-purple-500 bg-purple-50 border-purple-200';
    case '已完成':
      return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    case '撤单':
      return 'text-red-500 bg-red-50 border-red-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
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

interface GroupOrderManagementProps {
  onItemClick?: (type: 'ORDER' | 'TASK', id: string) => void;
  orders: GroupOrderRecord[];
  tasks: GroupOrderTaskRecord[];
  managers: DeliveryManagerRecord[];
}

const GroupOrderManagement: React.FC<GroupOrderManagementProps> = ({ onItemClick, orders, tasks, managers: initialManagers }) => {
  const [mainTab, setMainTab] = useState<'ORDERS' | 'TASKS' | 'MANAGERS'>('ORDERS');
  const [activeStatusTab, setActiveStatusTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manager State
  const [managers, setManagers] = useState(initialManagers);
  const [managerCityFilter, setManagerCityFilter] = useState('');
  const [managerCountyFilter, setManagerCountyFilter] = useState('');
  const [localOrders, setLocalOrders] = useState(orders);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [editingManagerId, setEditingManagerId] = useState<number | null>(null);
  const [newManagerForm, setNewManagerForm] = useState<Partial<DeliveryManagerRecord>>({
    name: '',
    phone: '',
    level: '',
    city: '',
    county: '',
    grid: '',
    company: ''
  });

  // Task Filter State (Drill Down)
  const [taskFilterOrderId, setTaskFilterOrderId] = useState<string | null>(null);

  // Scroll Indicator State
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
  }, [mainTab, activeStatusTab]);

  // Reset status tab when switching main tabs
  const handleMainTabChange = (tab: 'ORDERS' | 'TASKS' | 'MANAGERS') => {
    setMainTab(tab);
    setActiveStatusTab('全部');
    setSearchQuery('');
    setTaskFilterOrderId(null); // Always reset drill-down filter when clicking top tabs
    
    if (tab !== 'MANAGERS') {
      setManagerCityFilter('');
      setManagerCountyFilter('');
    }
  };

  const handleToggleImportance = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setLocalOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, isImportant: !order.isImportant } : order
    ));
  };

  const currentData = mainTab === 'ORDERS' ? localOrders : mainTab === 'TASKS' ? tasks : managers;
  const currentStatusTabs = mainTab === 'ORDERS' ? orderTabs : mainTab === 'TASKS' ? taskTabs : managerTabs;

  const filteredData = currentData.filter((item: any) => {
    if (mainTab === 'MANAGERS') {
      const matchesTab = activeStatusTab === '全部' || item.level === activeStatusTab;
      const matchesSearch = item.name.includes(searchQuery) || item.phone.includes(searchQuery) || (item.company && item.company.includes(searchQuery)) || (item.grid && item.grid.includes(searchQuery));
      const matchesCity = !managerCityFilter || item.city === managerCityFilter;
      const matchesCounty = !managerCountyFilter || item.county === managerCountyFilter;
      return matchesTab && matchesSearch && matchesCity && matchesCounty;
    } else if (mainTab === 'TASKS') {
      const matchesTab = activeStatusTab === '全部' || item.status === activeStatusTab || (activeStatusTab === '已撤单' && item.status === '撤单');
      const matchesSearch = item.id.includes(searchQuery) || item.taskId.includes(searchQuery) || item.groupOrderName.includes(searchQuery) || item.groupOrderId.includes(searchQuery);
      const matchesOrder = !taskFilterOrderId || item.groupOrderId === taskFilterOrderId;
      return matchesTab && matchesSearch && matchesOrder;
    } else {
      const matchesTab = activeStatusTab === '全部' || (activeStatusTab === '收藏' ? item.isImportant : item.status === activeStatusTab);
      const matchesSearch = 
        (item.name && item.name.includes(searchQuery)) || 
        (item.groupOrderId && item.groupOrderId.includes(searchQuery)) || 
        (item.level && item.level.includes(searchQuery));
      return matchesTab && matchesSearch;
    }
  });

  // Sort: Starred first (if exists), then by receiveTime/receiptTime desc
  const sortedData = mainTab === 'MANAGERS' ? filteredData : [...filteredData].sort((a: any, b: any) => {
    if ('isImportant' in a && 'isImportant' in b) {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
    }
    const timeA = a.receiptTime || a.receiveTime || '';
    const timeB = b.receiptTime || b.receiveTime || '';
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  // Drill Down Handler
  const handleDrillDown = (groupOrderId: string) => {
    setTaskFilterOrderId(groupOrderId);
    setMainTab('TASKS');
    setActiveStatusTab('全部');
  };

  // Manager Actions
  const handleAddManager = () => {
    setNewManagerForm({
      name: '',
      phone: '',
      level: '',
      city: '',
      county: '',
      grid: '',
      company: ''
    });
    setEditingManagerId(null);
    setIsManagerModalOpen(true);
  };

  const handleEditManager = (manager: DeliveryManagerRecord) => {
    setNewManagerForm({ ...manager });
    setEditingManagerId(manager.id);
    setIsManagerModalOpen(true);
  };

  const handleDeleteManager = (id: number) => {
    if (window.confirm('确认删除该交付经理吗？')) {
      setManagers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveManager = () => {
    const { name, phone, level, city, county, grid, company } = newManagerForm;
    const errors = [];

    if (!name) errors.push('姓名');
    if (!phone) errors.push('电话');
    if (!level) errors.push('级别');

    if (level === '地市级') {
        if (!city) errors.push('地市');
    } else if (level === '旗县级') {
        if (!city) errors.push('地市');
        if (!county) errors.push('旗县');
    } else if (level === '网格级') {
        if (!city) errors.push('地市');
        if (!county) errors.push('旗县');
        if (!grid) errors.push('网格');
        if (!company) errors.push('代维公司');
    }

    if (errors.length > 0) {
        alert(`请完善必填信息：${errors.join('、')}`);
        return;
    }

    if (editingManagerId) {
      setManagers(prev => prev.map(m => m.id === editingManagerId ? { ...m, ...newManagerForm } as DeliveryManagerRecord : m));
    } else {
      const newManager = {
        id: Date.now(),
        ...newManagerForm
      } as DeliveryManagerRecord;
      setManagers(prev => [newManager, ...prev]);
    }
    setIsManagerModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col w-full relative">
      <div className="sticky top-0 z-30 bg-gray-50">
        {/* Top Main Tabs (Orders vs Tasks vs Managers) */}
        <div className="bg-white flex border-b border-gray-200 shrink-0">
          <button
            onClick={() => handleMainTabChange('ORDERS')}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              mainTab === 'ORDERS' ? 'text-[#2ea2e6]' : 'text-gray-600'
            }`}
          >
            团单信息
            {mainTab === 'ORDERS' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => handleMainTabChange('TASKS')}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              mainTab === 'TASKS' ? 'text-[#2ea2e6]' : 'text-gray-600'
            }`}
          >
            团单任务
            {mainTab === 'TASKS' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => handleMainTabChange('MANAGERS')}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              mainTab === 'MANAGERS' ? 'text-[#2ea2e6]' : 'text-gray-600'
            }`}
          >
            交付经理
            {mainTab === 'MANAGERS' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Search Area */}
        <div className="bg-white px-4 py-3 shadow-sm z-10">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={mainTab === 'ORDERS' ? '客户名称、团单标识、团单等级' : mainTab === 'TASKS' ? '团单标识号/团单名称/任务标识号' : '姓名/电话/网格/代维公司'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              {mainTab !== 'MANAGERS' && (
                <>
                  {mainTab === 'TASKS' && taskFilterOrderId && (
                    <button 
                      onClick={() => setTaskFilterOrderId(null)}
                      className="flex items-center justify-center px-3 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium active:bg-amber-100 whitespace-nowrap"
                    >
                      <X className="h-4 w-4 mr-1" /> 清除筛选
                    </button>
                  )}
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 active:bg-gray-100">
                    <Filter className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {mainTab === 'MANAGERS' && (
              <div className="flex gap-2">
                <select 
                  value={managerCityFilter}
                  onChange={(e) => { setManagerCityFilter(e.target.value); setManagerCountyFilter(''); }}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">全部地市</option>
                  {INNER_MONGOLIA_CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
                <select 
                  value={managerCountyFilter}
                  onChange={(e) => setManagerCountyFilter(e.target.value)}
                  disabled={!managerCityFilter}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">全部区县</option>
                  {(managerCityFilter && CASCADING_COUNTIES[managerCityFilter] ? CASCADING_COUNTIES[managerCityFilter] : []).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button 
                  onClick={handleAddManager}
                  className="flex items-center justify-center px-4 py-2 bg-[#2ea2e6] text-white rounded-lg text-sm font-medium active:bg-blue-600 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-1" /> 新增
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Banner */}
        {taskFilterOrderId && mainTab === 'TASKS' && (
          <div className="bg-blue-50 px-4 py-2 flex justify-between items-center border-b border-blue-100 animate-fade-in">
            <span className="text-xs text-blue-600 truncate mr-2">
              正在查看团单 <b>{taskFilterOrderId}</b> 的任务
            </span>
            <button 
              onClick={() => setTaskFilterOrderId(null)}
              className="text-xs text-blue-500 hover:text-blue-700 underline whitespace-nowrap"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* Status Tabs */}
        <div className="relative bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="absolute left-0 top-0 h-11 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none flex items-center justify-start pl-1 z-20">
            <ChevronLeft className={`w-4 h-4 transition-colors ${canScrollLeft ? 'text-gray-600' : 'text-gray-300'}`} />
          </div>
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="px-2 flex overflow-x-auto scrollbar-hide"
          >
            <div className="flex min-w-full justify-between">
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

      {/* List Area */}
      <div className="p-4 space-y-3">
        {sortedData.length > 0 ? (
          sortedData.map((item: any) => (
            mainTab === 'MANAGERS' ? (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.phone}</div>
                  </div>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="text-xs text-gray-500 truncate">地市: <span className="text-gray-800">{item.city || '-'}</span></div>
                    <div className="text-xs text-gray-500 truncate">旗县: <span className="text-gray-800">{item.county || '-'}</span></div>
                    <div className="text-xs text-gray-500 truncate">网格: <span className="text-gray-800">{item.grid || '-'}</span></div>
                  </div>
                  <div className="text-xs text-gray-500 truncate">代维公司: <span className="text-gray-800">{item.company || '-'}</span></div>
                </div>
                <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-gray-50">
                  <button onClick={() => handleEditManager(item)} className="flex items-center text-xs text-blue-500 font-medium active:text-blue-700">
                    <Edit2 className="w-3 h-3 mr-1" /> 编辑
                  </button>
                  <button onClick={() => handleDeleteManager(item.id)} className="flex items-center text-xs text-red-500 font-medium active:text-red-700">
                    <Trash2 className="w-3 h-3 mr-1" /> 删除
                  </button>
                </div>
              </div>
            ) : (
              <div 
                key={item.id} 
                onClick={() => onItemClick && onItemClick(mainTab === 'ORDERS' ? 'ORDER' : 'TASK', item.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Header: ID and Status */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {mainTab === 'ORDERS' && (
                      <div 
                        onClick={(e) => handleToggleImportance(e, item.id)}
                        className="cursor-pointer p-1 -ml-1 hover:bg-gray-100 rounded-full"
                      >
                        <Star 
                          className={`w-4 h-4 shrink-0 ${item.isImportant ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{mainTab === 'ORDERS' ? item.groupOrderId : item.taskId}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                    {item.status === '撤单' ? '已撤单' : item.status}
                  </span>
                </div>
                
                {/* Title & Level */}
                <div className="mb-3">
                  {item.level && (
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] mr-2 align-middle ${getLevelColor(item.level)}`}>
                      {item.level}
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-800 align-middle leading-tight">
                    {mainTab === 'TASKS' ? item.groupOrderName : item.name}
                  </span>
                </div>

                {/* Grid Details */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  {mainTab === 'ORDERS' ? (
                    <>
                      <div className="grid grid-cols-2 gap-y-2 mb-2">
                        <div className="flex items-center space-x-1.5">
                          <Activity className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">竣工率:</span>
                          <span className="text-xs text-gray-800">{item.completionRate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">在途/派单量:</span>
                          <span className="text-xs text-gray-800">{item.inflightDispatched}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">分派任务:</span>
                          <span 
                            className="text-xs text-[#2ea2e6] underline cursor-pointer hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDrillDown(item.groupOrderId);
                            }}
                          >
                            {item.assignedTasks}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">剩余时限:</span>
                          <span className={`text-xs font-medium ${item.remainingTime === '-' ? 'text-gray-800' : 'text-red-500'}`}>
                            {item.remainingTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">未分派工单:</span>
                          <span className="text-xs text-gray-800">{item.unassignedTickets}</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">交付经理:</span>
                        <span className="text-xs text-gray-800">{item.manager}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-y-2 mb-2">
                        <div className="flex items-center space-x-1.5">
                          <Activity className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">竣工率:</span>
                          <span className="text-xs text-gray-800">{item.rate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">在途/派单量:</span>
                          <span className="text-xs text-gray-800">{item.dispatchRatio}</span>
                        </div>
                            {item.status === '撤单' ? (
                              <>
                                <div className="flex items-center space-x-1.5">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-xs text-gray-500">撤单时间:</span>
                                  <span className="text-xs text-gray-800">{item.finishTime || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-xs text-gray-500">撤单原因:</span>
                                  <span className="text-xs text-gray-800">客户需求变更</span>
                                </div>
                              </>
                            ) : (
                          <div className="flex items-center space-x-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-500">剩余时限:</span>
                            <span className={`text-xs font-medium ${item.remaining === '-' ? 'text-gray-800' : 'text-red-500'}`}>
                              {item.remaining}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">交付经理:</span>
                        <span className="text-xs text-gray-800">{item.manager}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer: Time and Action */}
                <div className="pt-2 flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400">{item.receiptTime}</span>
                  </div>
                  <div className="flex items-center text-[#2ea2e6] text-sm font-medium">
                    {(item.status === '已完成' || item.status === '撤单') ? '查看' : '处理'}
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">暂无相关数据</p>
          </div>
        )}
      </div>

      {/* Manager Add/Edit Modal */}
      {isManagerModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editingManagerId ? '编辑交付经理' : '添加交付经理'}</h3>
              <button onClick={() => setIsManagerModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-3">
                <label className="w-16 text-right text-sm text-gray-600">姓名</label>
                <input 
                  type="text" 
                  value={newManagerForm.name} 
                  onChange={(e) => setNewManagerForm({...newManagerForm, name: e.target.value})}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-16 text-right text-sm text-gray-600">电话</label>
                <input 
                  type="text" 
                  value={newManagerForm.phone} 
                  onChange={(e) => setNewManagerForm({...newManagerForm, phone: e.target.value})}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-red-500">*</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-16 text-right text-sm text-gray-600">级别</label>
                <select 
                  value={newManagerForm.level} 
                  onChange={(e) => {
                    const lvl = e.target.value;
                    setNewManagerForm(prev => ({
                        ...prev, 
                        level: lvl,
                        city: ['省级'].includes(lvl) ? '' : prev.city,
                        county: ['省级', '地市级'].includes(lvl) ? '' : prev.county,
                        grid: lvl !== '网格级' ? '' : prev.grid,
                        company: lvl !== '网格级' ? '' : prev.company
                    }));
                  }}
                  className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">请选择</option>
                  <option value="省级">省级</option>
                  <option value="地市级">地市级</option>
                  <option value="旗县级">旗县级</option>
                  <option value="网格级">网格级</option>
                </select>
                <span className="text-red-500">*</span>
              </div>

              {['地市级', '旗县级', '网格级'].includes(newManagerForm.level || '') && (
                <div className="flex items-center gap-3">
                  <label className="w-16 text-right text-sm text-gray-600">地市</label>
                  <select 
                    value={newManagerForm.city} 
                    onChange={(e) => setNewManagerForm({...newManagerForm, city: e.target.value, county: ''})}
                    className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="">请选择</option>
                    {INNER_MONGOLIA_CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                  <span className="text-red-500">*</span>
                </div>
              )}

              {['旗县级', '网格级'].includes(newManagerForm.level || '') && (
                <div className="flex items-center gap-3">
                  <label className="w-16 text-right text-sm text-gray-600">旗县</label>
                  <select 
                    value={newManagerForm.county} 
                    onChange={(e) => setNewManagerForm({...newManagerForm, county: e.target.value})}
                    disabled={!newManagerForm.city}
                    className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100"
                  >
                    <option value="">请选择</option>
                    {(newManagerForm.city && CASCADING_COUNTIES[newManagerForm.city] ? CASCADING_COUNTIES[newManagerForm.city] : CASCADING_COUNTIES['default']).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="text-red-500">*</span>
                </div>
              )}

              {newManagerForm.level === '网格级' && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-right text-sm text-gray-600">网格</label>
                    <input 
                      type="text" 
                      value={newManagerForm.grid} 
                      onChange={(e) => setNewManagerForm({...newManagerForm, grid: e.target.value})}
                      className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-right text-sm text-gray-600">代维公司</label>
                    <input 
                      type="text" 
                      value={newManagerForm.company} 
                      onChange={(e) => setNewManagerForm({...newManagerForm, company: e.target.value})}
                      className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-red-500">*</span>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setIsManagerModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium active:bg-gray-50">
                取消
              </button>
              <button onClick={handleSaveManager} className="flex-1 py-2.5 bg-[#2ea2e6] rounded-lg text-sm text-white font-medium active:bg-blue-600">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrderManagement;
