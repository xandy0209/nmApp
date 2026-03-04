import React, { useState, useMemo } from 'react';
import { FileText, Activity, Settings, MessageSquare, Clock, User, MapPin, ChevronDown, ChevronUp, ArrowLeft, Send, AlertCircle, Eye, Check, ChevronRight, X } from 'lucide-react';
import { GroupOrderRecord } from '../src/types/groupOrder';

interface Props {
  order: GroupOrderRecord;
}

const InfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-900 text-sm font-medium text-right">{value || '-'}</span>
  </div>
);

const SupportRequestView: React.FC<{ workOrder: any; onBack: () => void }> = ({ workOrder, onBack }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assigneeCategory, setAssigneeCategory] = useState('');
  const [assignee, setAssignee] = useState('');

  const [isBarsVisible, setIsBarsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 50) {
      setIsBarsVisible(false);
    } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 0) {
      setIsBarsVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  const assigneeOptions = useMemo(() => {
    if (assigneeCategory === '分公司客响') {
      return [
        { id: 'kr1', name: `张三（${workOrder.city}客响）` },
        { id: 'kr2', name: `李四（${workOrder.city}客响）` },
      ];
    } else if (assigneeCategory === '交付经理') {
      return [
        { id: 'dm1', name: `王五（网格交付经理）` },
        { id: 'dm2', name: `赵六（旗县交付经理）` },
        { id: 'dm3', name: `孙七（分公司交付经理）` },
        { id: 'dm4', name: `周八（区公司交付经理）` },
      ];
    }
    return [];
  }, [assigneeCategory, workOrder.city, workOrder.county]);

  const handleSubmit = () => {
    if (!subject || !content || !deadline || !assigneeCategory || !assignee) {
      alert('请填写所有必填项');
      return;
    }
    alert('支撑单提交成功！');
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full relative overflow-hidden">
      <div 
        className={`absolute top-0 left-0 right-0 bg-white p-4 border-b border-gray-200 flex items-center gap-3 z-20 transition-transform duration-300 ease-in-out ${
          isBarsVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button onClick={onBack} className="text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-gray-800 text-lg">发起支撑</h2>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 pb-24 pt-20"
        onScroll={handleScroll}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>支撑主题
            </label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="请输入支撑主题"
              className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>支撑内容
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入支撑内容"
              rows={4}
              className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>处理时限
            </label>
            <input 
              type="datetime-local" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>指派对象分类
            </label>
            <select 
              value={assigneeCategory}
              onChange={(e) => {
                setAssigneeCategory(e.target.value);
                setAssignee(''); // Reset assignee when category changes
              }}
              className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
            >
              <option value="">请选择</option>
              <option value="分公司客响">分公司客响</option>
              <option value="交付经理">交付经理</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>指派对象
            </label>
            <select 
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              disabled={!assigneeCategory}
              className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2ea2e6] disabled:opacity-50"
            >
              <option value="">请选择</option>
              {assigneeOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 transition-transform duration-300 ease-in-out ${
          isBarsVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium active:bg-blue-600 transition-colors"
        >
          提交
        </button>
      </div>
    </div>
  );
};

const WorkOrderDetailView: React.FC<{ workOrder: any; onBack: () => void }> = ({ workOrder, onBack }) => {
  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [isAnalysisInfoExpanded, setIsAnalysisInfoExpanded] = useState(false);
  const [showSupportRequest, setShowSupportRequest] = useState(false);

  const [isBarsVisible, setIsBarsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 50) {
      setIsBarsVisible(false);
    } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 0) {
      setIsBarsVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  if (showSupportRequest) {
    return <SupportRequestView workOrder={workOrder} onBack={() => setShowSupportRequest(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full relative overflow-hidden">
      <div 
        className={`absolute top-0 left-0 right-0 bg-white p-4 border-b border-gray-200 flex items-center gap-3 z-20 transition-transform duration-300 ease-in-out ${
          isBarsVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button onClick={onBack} className="text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-gray-800 text-lg">工单详情</h2>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 pb-24 pt-20"
        onScroll={handleScroll}
      >
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div 
            className={`flex justify-between items-center cursor-pointer ${isBasicInfoExpanded ? 'mb-3' : ''}`}
            onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)}
          >
            <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">工单基础信息</h3>
            {isBasicInfoExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          
          {isBasicInfoExpanded && (
            <div className="animate-fade-in">
              <InfoRow label="CRM工单号" value={workOrder.id} />
              <InfoRow label="工单标题" value={workOrder.title} />
              <InfoRow label="状态" value={workOrder.status} />
              <InfoRow label="工单来源" value={workOrder.source} />
              <InfoRow label="业务类型" value={workOrder.businessType} />
              <InfoRow label="业务标识" value={workOrder.businessId} />
              <InfoRow label="区域" value={`${workOrder.city}-${workOrder.county}`} />
              <InfoRow label="安装地址" value={workOrder.address} />
              <InfoRow label="当前环节" value={workOrder.currentStage} />
              <InfoRow label="分派交付经理" value={workOrder.manager} />
            </div>
          )}
        </div>

        {/* Analysis Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div 
            className={`flex justify-between items-center cursor-pointer ${isAnalysisInfoExpanded ? 'mb-3' : ''}`}
            onClick={() => setIsAnalysisInfoExpanded(!isAnalysisInfoExpanded)}
          >
            <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">工单分析信息</h3>
            {isAnalysisInfoExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          
          {isAnalysisInfoExpanded && (
            <div className="animate-fade-in">
              <InfoRow label="网络侧收单时间" value={workOrder.networkReceiptTime} />
              <InfoRow label="抢单/受理时间" value={workOrder.acceptTime} />
              <InfoRow label="抢单时长" value={workOrder.grabDuration} />
              <InfoRow label="预约响应时长" value={workOrder.appointmentResponseDuration} />
              <InfoRow label="预约时长" value={workOrder.appointmentDuration} />
              <InfoRow label="预约交付时间" value={workOrder.appointmentDeliveryTime} />
              <InfoRow label="预约次数" value={workOrder.appointmentCount} />
              <InfoRow label="改约次数" value={workOrder.rescheduleCount} />
              <InfoRow label="交付时限" value={workOrder.deliveryDeadline} />
              <InfoRow label="完成时间" value={workOrder.completionTime} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 transition-transform duration-300 ease-in-out ${
          isBarsVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button 
          onClick={() => setShowSupportRequest(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 active:text-[#2ea2e6]"
        >
          <Send size={20} />
          <span className="text-xs font-medium">发起支撑</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 active:text-[#2ea2e6]">
          <AlertCircle size={20} />
          <span className="text-xs font-medium">催办</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 active:text-[#2ea2e6]">
          <Eye size={20} />
          <span className="text-xs font-medium">查看轨迹</span>
        </button>
      </div>
    </div>
  );
};

const GroupOrderDetail: React.FC<Props> = ({ order }) => {
  const [activeTab, setActiveTab] = useState('INFO');
  const [woTab, setWoTab] = useState('ALL');
  const [orderStatus, setOrderStatus] = useState(order.status);

  const [woFilterCRM, setWoFilterCRM] = useState('');
  const [woFilterStatus, setWoFilterStatus] = useState('');
  const [woFilterCity, setWoFilterCity] = useState('');

  // Filters for ACTION tab
  const [actionFilterCRM, setActionFilterCRM] = useState('');
  const [actionFilterStatus, setActionFilterStatus] = useState('');
  const [actionFilterCity, setActionFilterCity] = useState('');

  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 50) {
      setIsTabBarVisible(false);
    } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 0) {
      setIsTabBarVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [isWorkOrderListExpanded, setIsWorkOrderListExpanded] = useState(false);
  
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedActionWorkOrders, setSelectedActionWorkOrders] = useState<string[]>([]);

  // Generate mock work orders based on order ID
  const mockWorkOrders = useMemo(() => {
    const baseOrders = [
      { 
        id: `${order.id}-WO-001`, 
        title: `${order.city}公安局节点接入`, 
        status: '活动', 
        manager: '李明(13800138000)', 
        address: `${order.city}${order.county || '新城区'}`, 
        city: order.city, 
        county: order.county || '新城区', 
        businessType: '互联网专线', 
        businessId: 'YW-001', 
        currentStage: '资源勘查', 
        source: '家宽系统',
        networkReceiptTime: '2025-02-10 09:00:00',
        acceptTime: '2025-02-10 09:30:00',
        grabDuration: '30分钟',
        appointmentResponseDuration: '2小时',
        appointmentDuration: '1天',
        appointmentDeliveryTime: '2025-02-15 12:00:00',
        appointmentCount: 1,
        rescheduleCount: 0,
        deliveryDeadline: '2025-02-20 18:00:00',
        completionTime: '-'
      },
      { 
        id: `${order.id}-WO-002`, 
        title: '分局节点接入', 
        status: '活动', 
        manager: '王坤鹏(13900139000)', 
        address: `${order.city}昆都仑区`, 
        city: order.city, 
        county: '昆都仑区', 
        businessType: 'MPLS VPN', 
        businessId: 'YW-002', 
        currentStage: '光缆施工', 
        source: '政企装维',
        networkReceiptTime: '2025-02-11 10:00:00',
        acceptTime: '2025-02-11 10:15:00',
        grabDuration: '15分钟',
        appointmentResponseDuration: '1小时',
        appointmentDuration: '2天',
        appointmentDeliveryTime: '2025-02-16 14:00:00',
        appointmentCount: 2,
        rescheduleCount: 1,
        deliveryDeadline: '2025-02-21 18:00:00',
        completionTime: '-'
      },
      { 
        id: `${order.id}-WO-003`, 
        title: '派出所节点接入', 
        status: '历史', 
        manager: '陈建国(13700137000)', 
        address: `${order.city}康巴什区`, 
        city: order.city, 
        county: '康巴什区', 
        businessType: '数字电路', 
        businessId: 'YW-003', 
        currentStage: '已竣工', 
        source: '甩单系统',
        networkReceiptTime: '2025-02-01 08:00:00',
        acceptTime: '2025-02-01 08:05:00',
        grabDuration: '5分钟',
        appointmentResponseDuration: '30分钟',
        appointmentDuration: '3天',
        appointmentDeliveryTime: '2025-02-05 10:00:00',
        appointmentCount: 1,
        rescheduleCount: 0,
        deliveryDeadline: '2025-02-10 18:00:00',
        completionTime: '2025-02-08 15:30:00'
      },
      { 
        id: `${order.id}-WO-004`, 
        title: '监控点位接入', 
        status: '撤单', 
        manager: '杨丽(13600136000)', 
        address: `${order.city}赛罕区`, 
        city: order.city, 
        county: '赛罕区', 
        businessType: '互联网专线', 
        businessId: 'YW-004', 
        currentStage: '已撤单', 
        source: '政企装维',
        networkReceiptTime: '2025-02-12 11:00:00',
        acceptTime: '2025-02-12 11:30:00',
        grabDuration: '30分钟',
        appointmentResponseDuration: '-',
        appointmentDuration: '-',
        appointmentDeliveryTime: '-',
        appointmentCount: 0,
        rescheduleCount: 0,
        deliveryDeadline: '2025-02-22 18:00:00',
        completionTime: '-'
      },
      { 
        id: `${order.id}-WO-005`, 
        title: '数据中心专线', 
        status: '退单', 
        manager: '周杰(13500135000)', 
        address: `${order.city}回民区`, 
        city: order.city, 
        county: '回民区', 
        businessType: '裸光纤', 
        businessId: 'YW-005', 
        currentStage: '已退单', 
        source: '家宽系统',
        networkReceiptTime: '2025-02-13 09:00:00',
        acceptTime: '2025-02-13 09:10:00',
        grabDuration: '10分钟',
        appointmentResponseDuration: '1小时',
        appointmentDuration: '-',
        appointmentDeliveryTime: '-',
        appointmentCount: 0,
        rescheduleCount: 0,
        deliveryDeadline: '2025-02-23 18:00:00',
        completionTime: '-'
      }
    ];

    const unassignedCount = order.unassignedTickets || 0;
    const unassignedOrders = Array.from({ length: unassignedCount }).map((_, index) => ({
        id: `${order.id}-WO-${String(baseOrders.length + index + 1).padStart(3, '0')}`, 
        title: `新增节点接入-${index + 1}`, 
        status: '待分派', 
        manager: '-', 
        address: `${order.city}玉泉区`, 
        city: order.city, 
        county: '玉泉区', 
        businessType: '互联网专线', 
        businessId: `YW-${String(baseOrders.length + index + 1).padStart(3, '0')}`, 
        currentStage: '待分派', 
        source: '家宽系统',
        networkReceiptTime: '2025-02-14 09:00:00',
        acceptTime: '-',
        grabDuration: '-',
        appointmentResponseDuration: '-',
        appointmentDuration: '-',
        appointmentDeliveryTime: '-',
        appointmentCount: 0,
        rescheduleCount: 0,
        deliveryDeadline: '2025-02-24 18:00:00',
        completionTime: '-'
    }));

    return [...baseOrders, ...unassignedOrders];
  }, [order]);

  // Filtered list for ACTION tab
  const filteredActionWorkOrders = useMemo(() => {
    return mockWorkOrders.filter(wo => {
      
      if (actionFilterCRM) {
        const search = actionFilterCRM.toLowerCase();
        if (
          !wo.id.toLowerCase().includes(search) && 
          !wo.title.toLowerCase().includes(search) &&
          !wo.businessId.toLowerCase().includes(search) &&
          !wo.address.toLowerCase().includes(search)
        ) return false;
      }
      if (actionFilterStatus && wo.status !== actionFilterStatus) return false;
      if (actionFilterCity && wo.city !== actionFilterCity) return false;
      
      return true;
    });
  }, [mockWorkOrders, actionFilterCRM, actionFilterStatus, actionFilterCity]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedActionWorkOrders(filteredActionWorkOrders.map(wo => wo.id));
    } else {
      setSelectedActionWorkOrders([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedActionWorkOrders(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isAllSelected = filteredActionWorkOrders.length > 0 && filteredActionWorkOrders.every(wo => selectedActionWorkOrders.includes(wo.id));

  // Determine current step index based on order status
  const currentStepIndex = useMemo(() => {
    switch (orderStatus) {
      case '待受理': return 1; // 下派(0) done, waiting for 受理(1)
      case '处理中': return 2; // 下派(0), 受理(1) done, processing(2)
      case '待回单': return 3; // 下派(0), 受理(1), 处理(2) done, waiting for 回单(3)
      case '已完成': return 4; // All done
      case '撤单': return 0; // Stopped at start
      default: return 1;
    }
  }, [orderStatus]);

  // Generate mock logs
  const mockLogs = useMemo(() => {
    // Helper to add time to a date string
    const addTime = (timeStr: string, minutes: number) => {
      try {
        const date = new Date(timeStr.replace(' ', 'T'));
        date.setMinutes(date.getMinutes() + minutes);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
      } catch (e) {
        return timeStr;
      }
    };

    const baseTime = order.receiptTime;
    const allLogs = [
      { 
        stepIndex: 3,
        time: addTime(baseTime, 120), 
        user: '李明', 
        action: '回单', 
        desc: '工单已完成，回单确认' 
      },
      { 
        stepIndex: 2,
        time: addTime(baseTime, 30), 
        user: order.manager, 
        action: '分派', 
        desc: `将${order.id}-WO-001分派给李明` 
      },
      { 
        stepIndex: 1,
        time: baseTime, 
        user: order.manager, 
        action: '受理', 
        desc: '交付经理确认受理' 
      },
      { 
        stepIndex: 0,
        time: addTime(baseTime, -60), 
        user: '系统', 
        action: '下派', 
        desc: '系统自动生成团单并下发' 
      },
    ];

    // Filter logs based on current progress
    // If currentStepIndex is 1 (waiting for Accept), we only show step 0 (Dispatch)
    // If currentStepIndex is 2 (Processing), we show 0 and 1
    // Wait, the requirement says "No start link does not exist operation record"
    // So we show logs for steps < currentStepIndex?
    // Let's refine:
    // If '待受理' (current=1), it means '下派' happened. Log for '下派' should show. Log for '受理' should NOT show yet?
    // Or does '待受理' mean it is currently AT '受理' step? Yes.
    // So only steps < currentStepIndex are fully completed?
    // Actually, usually logs appear AFTER the action is done.
    // If status is '待受理', '受理' action hasn't happened yet. So only '下派' log.
    // If status is '处理中', '受理' happened. So '下派', '受理' logs.
    // If status is '待回单', '分派' (processing) happened. So '下派', '受理', '分派' logs.
    // If status is '已完成', '回单' happened. All logs.
    
    return allLogs.filter(log => log.stepIndex < currentStepIndex);
  }, [order, currentStepIndex]);

  const mockFeedbacks = useMemo(() => {
    const addTime = (timeStr: string, minutes: number) => {
      try {
        const date = new Date(timeStr.replace(' ', 'T'));
        date.setMinutes(date.getMinutes() + minutes);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
      } catch (e) {
        return timeStr;
      }
    };

    const baseTime = order.receiptTime;
    const allFeedbacks = [
      { stepIndex: 3, time: addTime(baseTime, 110), user: order.manager, content: '所有节点已完成测试，业务开通正常，准备提交回单。' },
      { stepIndex: 2, time: addTime(baseTime, 90), user: '陈建国', content: '康巴什区派出所节点光缆已熔接完成，正在进行设备加电测试。' },
      { stepIndex: 2, time: addTime(baseTime, 60), user: '王坤鹏', content: '昆都仑区分局节点设备已到场，正在进行机架安装。' },
      { stepIndex: 2, time: addTime(baseTime, 45), user: '李明', content: '呼和浩特市公安局主节点已完成现场勘查，具备施工条件。' },
      { stepIndex: 1, time: addTime(baseTime, 10), user: order.manager, content: '已联系客户确认施工时间，客户要求周末进行核心节点割接。' },
    ];

    return allFeedbacks.filter(fb => fb.stepIndex <= currentStepIndex);
  }, [order, currentStepIndex]);

  const tabs = [
    { id: 'INFO', label: '团单信息', icon: <FileText size={18} /> },
    { id: 'PROCESS', label: '流程信息', icon: <Activity size={18} /> },
    { id: 'ACTION', label: '团单处理', icon: <Settings size={18} /> },
    { id: 'FEEDBACK', label: '阶段反馈', icon: <MessageSquare size={18} /> },
  ];

  const hasUnassignedWorkOrders = useMemo(() => {
    return mockWorkOrders.some(wo => wo.status === '待分派');
  }, [mockWorkOrders]);

  const handleConfirmReturn = () => {
    setOrderStatus('已完成');
  };

  const renderReturnOrderAction = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">回单操作</h3>
      <div className="space-y-4">
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>所有工单已分派完毕，请填写回单说明并提交，完成团单处理流。</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">回单说明 (选填)</label>
          <textarea 
            className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
            placeholder="请输入回单说明..."
          ></textarea>
        </div>
        <button 
          onClick={handleConfirmReturn}
          className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium active:bg-blue-600 transition-colors mt-2"
        >
          确认回单
        </button>
      </div>
    </div>
  );

  const handleAccept = () => {
    setOrderStatus('处理中');
    alert('受理成功！');
  };

  return (
    <div className="relative h-full w-full">
      {selectedWorkOrder && (
        <div className="absolute inset-0 z-50 bg-gray-50">
          <WorkOrderDetailView 
            workOrder={selectedWorkOrder} 
            onBack={() => setSelectedWorkOrder(null)} 
          />
        </div>
      )}

      <div className="flex flex-col h-full bg-gray-50 w-full relative overflow-hidden">
      {/* Tabs */}
      <div 
        className={`absolute top-0 left-0 right-0 z-10 bg-white flex border-b border-gray-200 transition-transform duration-300 ease-in-out ${
          isTabBarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 relative ${
              activeTab === tab.id ? 'text-[#2ea2e6]' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div 
        className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${isTabBarVisible ? 'mt-[65px]' : 'mt-0'}`}
        onScroll={handleScroll}
      >
        
        {/* INFO TAB */}
        {activeTab === 'INFO' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div 
                className={`flex justify-between items-center cursor-pointer ${isBasicInfoExpanded ? 'mb-3' : ''}`}
                onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)}
              >
                <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">基本信息</h3>
                {isBasicInfoExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
              
              {isBasicInfoExpanded && (
                <div className="animate-fade-in">
                  <InfoRow label="团单编号" value={order.groupOrderId} />
                  <InfoRow label="团单名称" value={order.name} />
                  <InfoRow label="团单等级" value={order.level} />
                  <InfoRow label="交付经理" value={order.manager} />
                  <InfoRow label="当前状态" value={orderStatus} />
                  <InfoRow label="竣工率" value={order.completionRate} />
                  <InfoRow label="在途/派单量" value={order.inflightDispatched} />
                  <InfoRow label="剩余时限" value={order.remainingTime} />
                  <InfoRow label="收单时间" value={order.receiptTime} />
                  <InfoRow label="交付时限" value={order.deliveryDeadline} />
                  <InfoRow label="完成时间" value={order.completionTime} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div 
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => setIsWorkOrderListExpanded(!isWorkOrderListExpanded)}
              >
                <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">团单工单清单</h3>
                {isWorkOrderListExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>

              <div className={`flex gap-4 border-b border-gray-100 pb-2 ${isWorkOrderListExpanded ? 'mb-3' : ''}`}>
                <button 
                  onClick={() => setWoTab('ALL')} 
                  className={`text-sm font-medium relative pb-1 ${woTab === 'ALL' ? 'text-[#2ea2e6]' : 'text-gray-500'}`}
                >
                  全部({mockWorkOrders.length})
                  {woTab === 'ALL' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#2ea2e6]"></div>}
                </button>
                <button 
                  onClick={() => setWoTab('UNASSIGNED')} 
                  className={`text-sm font-medium relative pb-1 ${woTab === 'UNASSIGNED' ? 'text-[#2ea2e6]' : 'text-gray-500'}`}
                >
                  未分派({mockWorkOrders.filter(wo => wo.status === '待分派').length})
                  {woTab === 'UNASSIGNED' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#2ea2e6]"></div>}
                </button>
              </div>

              {isWorkOrderListExpanded && (
                <div className="animate-fade-in">
                  {/* Filters for "ALL" view */}
                  {woTab === 'ALL' && (
                <div className="space-y-2 mb-3">
                  <input 
                    type="text" 
                    placeholder="CMR工单号、业务标识、工单标题、安装地址" 
                    value={woFilterCRM}
                    onChange={(e) => setWoFilterCRM(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={woFilterStatus}
                      onChange={(e) => setWoFilterStatus(e.target.value)}
                      className="border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">工单状态</option>
                      <option value="活动">活动</option>
                      <option value="历史">历史</option>
                      <option value="撤单">撤单</option>
                      <option value="退单">退单</option>
                    </select>
                    <select 
                      value={woFilterCity}
                      onChange={(e) => setWoFilterCity(e.target.value)}
                      className="border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">地市</option>
                      <option value="呼和浩特市">呼和浩特市</option>
                      <option value="包头市">包头市</option>
                      <option value="鄂尔多斯市">鄂尔多斯市</option>
                    </select>
                  </div>
                </div>
              )}

                  <div className="space-y-3">
                    {mockWorkOrders.filter(wo => {
                      if (woTab === 'UNASSIGNED') return wo.status === '待分派';
                      
                      // Apply filters for ALL tab
                      if (woTab === 'ALL') {
                        if (woFilterCRM) {
                          const search = woFilterCRM.toLowerCase();
                          if (
                            !wo.id.toLowerCase().includes(search) && 
                            !wo.title.toLowerCase().includes(search) &&
                            !wo.businessId.toLowerCase().includes(search) &&
                            !wo.address.toLowerCase().includes(search)
                          ) return false;
                        }
                        if (woFilterStatus && wo.status !== woFilterStatus) return false;
                        if (woFilterCity && wo.city !== woFilterCity) return false;
                      }
                      
                      return true;
                    }).map(wo => (
                      <div 
                        key={wo.id} 
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex flex-col gap-2 active:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setSelectedWorkOrder(wo)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-800">CRM号：{wo.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            wo.status === '活动' ? 'bg-blue-100 text-blue-600' : 
                            wo.status === '历史' ? 'bg-gray-100 text-gray-600' :
                            wo.status === '撤单' ? 'bg-red-100 text-red-600' :
                            wo.status === '退单' ? 'bg-orange-100 text-orange-600' :
                            wo.status === '待分派' ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>{wo.status}</span>
                        </div>
                        <div className="text-xs text-gray-600">工单标题：{wo.title}</div>
                        <div className="text-xs text-gray-500">安装地址：{wo.address}</div>
                        <div className="text-xs text-gray-500">区域：{wo.city}-{wo.county}</div>
                        <div className="text-xs text-gray-500">业务类型：{wo.businessType}</div>
                        <div className="text-xs text-gray-500">业务标识：{wo.businessId}</div>
                        <div className="text-xs text-gray-500">当前环节：{wo.currentStage}</div>
                        <div className="text-xs text-gray-500">工单来源：{wo.source}</div>
                        <div className="text-xs text-gray-500">分派交付经理：{wo.manager}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROCESS TAB */}
        {activeTab === 'PROCESS' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">流程进度</h3>
              <div className="flex items-center justify-between px-4">
                {['下派', '受理', '处理', '回单'].map((step, idx, arr) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isLast = idx === arr.length - 1;
                  
                  return (
                    <React.Fragment key={step}>
                      {/* Step Node */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all duration-300
                          ${isCompleted ? 'bg-[#2ea2e6] text-white shadow-md' : 
                            isCurrent ? 'bg-white text-[#2ea2e6] border-2 border-[#2ea2e6] shadow-md scale-110' : 
                            'bg-gray-200 text-gray-500'}`}>
                          {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className={`text-xs font-medium transition-colors duration-300 ${isCompleted || isCurrent ? 'text-[#2ea2e6]' : 'text-gray-400'}`}>{step}</span>
                      </div>

                      {/* Connecting Line */}
                      {!isLast && (
                        <div className="flex-1 h-0.5 mx-2 relative bg-gray-200 self-start mt-[15px]">
                          <div className={`absolute inset-0 transition-all duration-500 ${idx < currentStepIndex ? 'bg-[#2ea2e6] w-full' : 'w-0'}`}></div>
                          {/* Arrow for active lines */}
                          {idx < currentStepIndex && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-[#2ea2e6] z-20">
                              <ChevronRight size={16} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">操作记录</h3>
              <div className="space-y-6 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {mockLogs.map((log, idx) => (
                  <div key={idx} className="relative flex items-center gap-3">
                    <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white bg-[#2ea2e6] shadow z-10"></div>
                    <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-800 text-sm">{log.action}</span>
                        <span className="text-[10px] text-gray-400">{log.time}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <span className="bg-blue-50 text-[#2ea2e6] px-1.5 py-0.5 rounded text-[10px]">{log.user}</span>
                      </div>
                      <div className="text-xs text-gray-600">{log.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTION TAB */}
        {activeTab === 'ACTION' && (
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
            ) : orderStatus === '处理中' && hasUnassignedWorkOrders ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">任务分派</h3>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">团单等级</label>
                    <div className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 text-gray-800">
                      {order.level || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">分派层级</label>
                    <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                      <option>地市级</option>
                      <option>旗县级</option>
                      <option>网格级</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">选择地市</label>
                    <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                      <option>呼和浩特市</option>
                      <option>包头市</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">交付经理</label>
                    <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                      <option>李明 (13800138000)</option>
                      <option>王坤鹏 (13900139000)</option>
                    </select>
                  </div>
                </div>
                
                <h4 className="font-medium text-sm text-gray-800 mb-2">待分派工单</h4>
                
                {/* Filters for ACTION tab */}
                <div className="space-y-2 mb-3">
                  <input 
                    type="text" 
                    placeholder="CMR工单号、业务标识、工单标题、安装地址" 
                    value={actionFilterCRM}
                    onChange={(e) => setActionFilterCRM(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={actionFilterStatus}
                      onChange={(e) => setActionFilterStatus(e.target.value)}
                      className="border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">工单状态</option>
                      <option value="活动">活动</option>
                      <option value="历史">历史</option>
                      <option value="撤单">撤单</option>
                      <option value="退单">退单</option>
                    </select>
                    <select 
                      value={actionFilterCity}
                      onChange={(e) => setActionFilterCity(e.target.value)}
                      className="border border-gray-200 rounded-md p-2 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">地市</option>
                      <option value="呼和浩特市">呼和浩特市</option>
                      <option value="包头市">包头市</option>
                      <option value="鄂尔多斯市">鄂尔多斯市</option>
                    </select>
                  </div>
                </div>

                {/* Select All Checkbox */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#2ea2e6] focus:ring-[#2ea2e6]"
                    />
                    <span>全选 ({selectedActionWorkOrders.length}/{filteredActionWorkOrders.length})</span>
                  </label>
                </div>

                <div className="space-y-2 mb-4">
                  {filteredActionWorkOrders.map(wo => (
                    <label key={wo.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-800">CRM号：{wo.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            wo.status === '活动' ? 'bg-blue-100 text-blue-600' : 
                            wo.status === '历史' ? 'bg-gray-100 text-gray-600' :
                            wo.status === '撤单' ? 'bg-red-100 text-red-600' :
                            wo.status === '退单' ? 'bg-orange-100 text-orange-600' :
                            wo.status === '待分派' ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>{wo.status}</span>
                        </div>
                        <div className="text-xs text-gray-600">工单标题：{wo.title}</div>
                        <div className="text-xs text-gray-500">安装地址：{wo.address}</div>
                        <div className="text-xs text-gray-500">区域：{wo.city}-{wo.county}</div>
                        <div className="text-xs text-gray-500">业务类型：{wo.businessType}</div>
                        <div className="text-xs text-gray-500">业务标识：{wo.businessId}</div>
                        <div className="text-xs text-gray-500">当前环节：{wo.currentStage}</div>
                        <div className="text-xs text-gray-500">工单来源：{wo.source}</div>
                        <div className="text-xs text-gray-500">分派交付经理：{wo.manager}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedActionWorkOrders.includes(wo.id)}
                        onChange={() => handleSelectOne(wo.id)}
                        className="shrink-0 w-5 h-5 rounded border-gray-300 text-[#2ea2e6] focus:ring-[#2ea2e6]" 
                      />
                    </label>
                  ))}
                </div>
              </div>
            ) : (orderStatus === '处理中' && !hasUnassignedWorkOrders) || orderStatus === '待回单' ? (
              renderReturnOrderAction()
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                {orderStatus === '已完成' ? (
                  <>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">团单已完成</h3>
                    <p className="text-sm text-gray-500">所有工单已处理完毕，团单流程已归档。您可以在“团单信息”标签页查看完整工单清单。</p>
                  </>
                ) : orderStatus === '撤单' ? (
                  <>
                    <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mb-4">
                      <X className="w-8 h-8 text-red-500" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">团单已撤销</h3>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 w-full">
                      <p className="text-sm text-red-600">该团单已被撤销，流程已终止。无法进行受理、分派或回单操作。</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">无需操作</h3>
                    <p className="text-sm text-gray-500">当前状态下暂无需要处理的任务</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'FEEDBACK' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">反馈记录</h3>
              <div className="space-y-3">
                {mockFeedbacks.map((fb, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-800 flex items-center gap-1"><User size={14}/> {fb.user}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {fb.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-2">{fb.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Fixed Bottom Action Bar for ACTION tab */}
      {activeTab === 'ACTION' && orderStatus === '处理中' && hasUnassignedWorkOrders && (
        <div className="bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors">
            确认分派
          </button>
        </div>
      )}

      </div>
    </div>
  );
};

export default GroupOrderDetail;
