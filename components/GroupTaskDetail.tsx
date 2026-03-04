import React, { useState, useMemo } from 'react';
import { FileText, Activity, Settings, MessageSquare, Clock, User, MapPin, ChevronDown, ChevronUp, ArrowLeft, Send, AlertCircle, Eye, Check, ChevronRight, X } from 'lucide-react';
import { GroupOrderTaskRecord } from '../src/types/groupOrder';

interface Props {
  task: GroupOrderTaskRecord;
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

const UrgeView: React.FC<{ workOrder: any; onBack: () => void }> = ({ workOrder, onBack }) => {
  const [activeTab, setActiveTab] = useState<'RECORD' | 'CREATE'>('RECORD');
  const [urgeRecords, setUrgeRecords] = useState([
    { time: '2025-02-12 10:00:00', urger: '张三', target: '李四', content: '请尽快处理工单' },
    { time: '2025-02-11 15:30:00', urger: '王五', target: '赵六', content: '客户催促，请优先处理' },
  ]);

  const [targets, setTargets] = useState([{ name: '', phone: '' }]);
  const [content, setContent] = useState('');

  const handleAddTarget = () => {
    setTargets([...targets, { name: '', phone: '' }]);
  };

  const handleRemoveTarget = (index: number) => {
    const newTargets = [...targets];
    newTargets.splice(index, 1);
    setTargets(newTargets);
  };

  const handleTargetChange = (index: number, field: 'name' | 'phone', value: string) => {
    const newTargets = [...targets];
    newTargets[index][field] = value;
    setTargets(newTargets);
  };

  const handleSubmit = () => {
    if (targets.some(t => !t.name || !t.phone) || !content) {
      alert('请填写完整的催办对象和催办内容');
      return;
    }
    
    const newRecords = targets.map(target => ({
      time: new Date().toLocaleString(),
      urger: '当前用户',
      target: `${target.name}(${target.phone})`,
      content: content
    }));

    setUrgeRecords([...newRecords, ...urgeRecords]);
    setActiveTab('RECORD');
    setContent('');
    setTargets([{ name: '', phone: '' }]);
    alert('催办成功！');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-white p-4 border-b border-gray-200 flex items-center gap-3 z-20">
        <button onClick={onBack} className="text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-gray-800 text-lg">支撑催办</h2>
      </div>

      <div className="flex border-b border-gray-200 bg-white mt-[60px]">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'RECORD' ? 'text-[#2ea2e6] border-b-2 border-[#2ea2e6]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('RECORD')}
        >
          催办记录
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'CREATE' ? 'text-[#2ea2e6] border-b-2 border-[#2ea2e6]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('CREATE')}
        >
          发起催办
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'RECORD' ? (
          <div className="space-y-4">
            {urgeRecords.map((record, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">{record.time}</span>
                  <span className="text-xs font-medium text-[#2ea2e6] bg-blue-50 px-2 py-1 rounded-full">{record.urger}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-800"><span className="text-gray-500">催办对象：</span>{record.target}</div>
                  <div className="text-sm text-gray-800"><span className="text-gray-500">催办内容：</span>{record.content}</div>
                </div>
              </div>
            ))}
            {urgeRecords.length === 0 && (
              <div className="text-center text-gray-400 py-8 text-sm">暂无催办记录</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">催办对象</h3>
                <button onClick={handleAddTarget} className="text-xs text-[#2ea2e6] font-medium flex items-center gap-1">
                  + 添加对象
                </button>
              </div>
              
              <div className="space-y-4">
                {targets.map((target, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg relative">
                    {targets.length > 1 && (
                      <button 
                        onClick={() => handleRemoveTarget(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">姓名</label>
                        <input
                          type="text"
                          value={target.name}
                          onChange={(e) => handleTargetChange(index, 'name', e.target.value)}
                          className="w-full border border-gray-200 rounded-md p-2 text-sm bg-white"
                          placeholder="请输入姓名"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">电话</label>
                        <input
                          type="tel"
                          value={target.phone}
                          onChange={(e) => handleTargetChange(index, 'phone', e.target.value)}
                          className="w-full border border-gray-200 rounded-md p-2 text-sm bg-white"
                          placeholder="请输入电话"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2 mb-4">催办内容</h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 min-h-[100px]"
                placeholder="请输入催办内容..."
              />
            </div>
          </div>
        )}
      </div>

      {activeTab === 'CREATE' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#2ea2e6] text-white py-3 rounded-lg font-medium active:bg-blue-600 transition-colors"
          >
            提交催办
          </button>
        </div>
      )}
    </div>
  );
};

const WorkOrderDetailView: React.FC<{ workOrder: any; onBack: () => void }> = ({ workOrder, onBack }) => {
  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [isAnalysisInfoExpanded, setIsAnalysisInfoExpanded] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [showSupportRequest, setShowSupportRequest] = useState(false);
  const [showUrgeView, setShowUrgeView] = useState(false);

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

  // Mock data for processing history
  const historyRecords = [
    { stage: '资源勘查', type: '回单', operator: '李明', phone: '13800138000', time: '2025-02-10 14:30:00', desc: '现场勘查完成，资源具备。' },
    { stage: '资源勘查', type: '接单', operator: '李明', phone: '13800138000', time: '2025-02-10 09:30:00', desc: '已接单，准备前往现场。' },
    { stage: '待分派', type: '分派', operator: '系统', phone: '-', time: '2025-02-10 09:00:00', desc: '系统自动分派工单。' },
  ];

  if (showSupportRequest) {
    return <SupportRequestView workOrder={workOrder} onBack={() => setShowSupportRequest(false)} />;
  }

  if (showUrgeView) {
    return <UrgeView workOrder={workOrder} onBack={() => setShowUrgeView(false)} />;
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
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

        {/* Processing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div 
            className={`flex justify-between items-center cursor-pointer ${isHistoryExpanded ? 'mb-3' : ''}`}
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          >
            <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">工单处理过程</h3>
            {isHistoryExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          
          {isHistoryExpanded && (
            <div className="animate-fade-in space-y-6 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {historyRecords.map((record, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full border-2 border-white bg-[#2ea2e6] shadow z-10"></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800 text-sm">{record.stage}</span>
                    <span className="text-xs text-gray-500">{record.time}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="bg-blue-50 text-[#2ea2e6] px-1.5 py-0.5 rounded mr-2">{record.type}</span>
                    <span>{record.operator} ({record.phone})</span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {record.desc}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20"
      >
        <button 
          onClick={() => setShowSupportRequest(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 active:text-[#2ea2e6]"
        >
          <Send size={20} />
          <span className="text-xs font-medium">发起支撑</span>
        </button>
        <button 
          className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 active:text-[#2ea2e6]"
          onClick={() => setShowUrgeView(true)}
        >
          <AlertCircle size={20} />
          <span className="text-xs font-medium">催办</span>
        </button>
      </div>
    </div>
  );
};

const GroupTaskDetail: React.FC<Props> = ({ task }) => {
  const [activeTab, setActiveTab] = useState('INFO');
  const [woTab, setWoTab] = useState('ALL');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbacks, setFeedbacks] = useState([
    { time: '2025-02-11 11:00:00', user: task.manager, content: '已联系施工队，准备进场。' },
    { time: '2025-02-11 14:30:00', user: task.manager, content: '施工队已到达现场，开始布线。' },
    { time: '2025-02-12 09:15:00', user: task.manager, content: '布线完成，正在进行设备调试。' },
    { time: '2025-02-12 16:00:00', user: task.manager, content: '设备调试遇到小问题，预计明天上午解决。' },
  ]);
  const [taskStatus, setTaskStatus] = useState(task.status);

  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [isWorkOrderListExpanded, setIsWorkOrderListExpanded] = useState(false);
  const [woFilterCRM, setWoFilterCRM] = useState('');
  const [woFilterStatus, setWoFilterStatus] = useState('');
  const [woFilterCity, setWoFilterCity] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);

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

  const [lastAppointmentTime, setLastAppointmentTime] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('');
  const [userExpectedDeadline, setUserExpectedDeadline] = useState('');
  const [confirmedUserExpectedDeadline, setConfirmedUserExpectedDeadline] = useState<string | null>(null);

  const handleAppointment = () => {
    if (appointmentDate && appointmentTimeSlot) {
      const [startTimeStr, endTimeStr] = appointmentTimeSlot.split('-');
      const startDateTimeStr = `${appointmentDate}T${startTimeStr}:00`;
      const endDateTimeStr = `${appointmentDate}T${endTimeStr}:00`;

      // Validation for User Expected Deadline
      if (userExpectedDeadline) {
        const start = new Date(startDateTimeStr);
        const expected = new Date(userExpectedDeadline);
        const taskDeadline = new Date(task.deadline.replace(' ', 'T')); 

        if (expected < start) {
          alert('用户期望交付时限不能早于预约开始时间');
          return;
        }

        if (task.deadline && expected > taskDeadline) {
           alert('用户期望交付时限不能晚于任务交付时限');
           return;
        }
      }

      setLastAppointmentTime(`${appointmentDate} ${appointmentTimeSlot}`);
      if (userExpectedDeadline) {
        setConfirmedUserExpectedDeadline(userExpectedDeadline.replace('T', ' '));
      }
      setAppointmentDate('');
      setAppointmentTimeSlot('');
      setUserExpectedDeadline('');
      alert('预约/改约成功');
    } else {
      alert('请选择预约日期和时段');
    }
  };

  // Generate mock work orders based on task ID
  const mockWorkOrders = useMemo(() => {
    return [
      { 
        id: `${task.id}-WO-001`, 
        title: `公安局节点接入`, 
        status: '活动', 
        manager: '李明(13800138000)', 
        address: `新城区`, 
        city: '呼和浩特市', 
        county: '新城区', 
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
        id: `${task.id}-WO-002`, 
        title: '分局节点接入', 
        status: '活动', 
        manager: '王坤鹏(13900139000)', 
        address: `昆都仑区`, 
        city: '包头市', 
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
        id: `${task.id}-WO-003`, 
        title: '派出所节点接入', 
        status: '历史', 
        manager: '陈建国(13700137000)', 
        address: `康巴什区`, 
        city: '鄂尔多斯市', 
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
        id: `${task.id}-WO-004`, 
        title: '监控点位接入', 
        status: '撤单', 
        manager: '杨丽(13600136000)', 
        address: `赛罕区`, 
        city: '呼和浩特市', 
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
        id: `${task.id}-WO-005`, 
        title: '数据中心专线', 
        status: '退单', 
        manager: '周杰(13500135000)', 
        address: `回民区`, 
        city: '呼和浩特市', 
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
  }, [task]);

  const currentStepIndex = useMemo(() => {
    if (taskStatus === '待处理') return 1;
    if (taskStatus === '处理中') return 2;
    if (taskStatus === '已完成') return 3;
    return 1;
  }, [taskStatus]);

  // Generate mock logs
  const mockLogs = useMemo(() => {
    const logs = [
      { time: task.receiptTime, user: '系统', action: '任务分派', desc: '系统自动生成任务并下发' }
    ];
    if (taskStatus === '处理中' || taskStatus === '已完成') {
      logs.push({ time: task.receiptTime, user: task.manager, action: '任务受理', desc: '交付经理确认受理' });
    }
    if (taskStatus === '已完成') {
      logs.push({ time: task.receiptTime, user: '系统', action: '自动归档', desc: '任务处理完成，系统自动归档' });
    }
    return logs.reverse();
  }, [taskStatus, task]);

  const tabs = [
    { id: 'INFO', label: '任务信息', icon: <FileText size={18} /> },
    { id: 'PROCESS', label: '流程信息', icon: <Activity size={18} /> },
    { id: 'ACTION', label: '任务处理', icon: <Settings size={18} /> },
    { id: 'FEEDBACK', label: '阶段反馈', icon: <MessageSquare size={18} /> },
  ];

  const handleAccept = () => {
    setTaskStatus('处理中');
    alert('受理成功！');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbacks([{ time: new Date().toLocaleString(), user: '当前用户', content: feedbackText }, ...feedbacks]);
    setFeedbackText('');
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
                  <InfoRow label="任务状态" value={task.status === '撤单' ? '已撤单' : task.status} />
                  <InfoRow label="交付经理" value={task.manager} />
                  <InfoRow label="任务竣工率" value={task.rate} />
                  <InfoRow label="在途/任务派单量" value={task.dispatchRatio} />
                  <InfoRow label="任务剩余时限" value={task.remaining} />
                  <InfoRow label="任务交付时限" value={task.deadline} />
                  {confirmedUserExpectedDeadline && (
                    <InfoRow label="用户期望交付时限" value={confirmedUserExpectedDeadline} />
                  )}
                  <InfoRow label="任务完成时间" value={task.finishTime} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div 
                className={`flex justify-between items-center cursor-pointer ${isWorkOrderListExpanded ? 'mb-3' : ''}`}
                onClick={() => setIsWorkOrderListExpanded(!isWorkOrderListExpanded)}
              >
                <h3 className="font-bold text-gray-800 border-l-4 border-[#2ea2e6] pl-2">工单清单</h3>
                {isWorkOrderListExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>

              {isWorkOrderListExpanded && (
                <div className="animate-fade-in">
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

                  <div className="space-y-3">
                    {mockWorkOrders.filter(wo => {
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
                {['分派', '受理', '完成'].map((step, idx, arr) => {
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
            ) : taskStatus === '已完成' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">任务已完成</h3>
                <p className="text-sm text-gray-500">所有关联工单已处理完毕，任务自动归档。</p>
              </div>
            ) : taskStatus === '撤单' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">任务已撤单</h3>
                <p className="text-sm text-gray-500">该任务已被撤销，流程已终止。无法进行受理、预约或回单操作。</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4 border-l-4 border-[#2ea2e6] pl-2">集中预约</h3>
                <div className="space-y-3 mb-4">
                  {lastAppointmentTime && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 space-y-2">
                      <div>
                        <div className="text-xs text-blue-600 mb-1">上次预约时间</div>
                        <div className="text-sm font-medium text-blue-800">{lastAppointmentTime}</div>
                      </div>
                      {confirmedUserExpectedDeadline && (
                        <div>
                          <div className="text-xs text-blue-600 mb-1">用户期望交付时限</div>
                          <div className="text-sm font-medium text-blue-800">{confirmedUserExpectedDeadline}</div>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">预约日期</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" 
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">预约时段</label>
                    <select
                      className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50"
                      value={appointmentTimeSlot}
                      onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                    >
                      <option value="">请选择时段</option>
                      {Array.from({ length: 11 }, (_, i) => {
                        const start = 9 + i;
                        const end = start + 1;
                        const timeStr = `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
                        return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">用户期望交付时限 (选填)</label>
                    <input 
                      type="datetime-local" 
                      className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" 
                      value={userExpectedDeadline}
                      onChange={(e) => setUserExpectedDeadline(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">需晚于预约开始时间，且早于任务交付时限 ({task.deadline})</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleAppointment}
                  className="w-full bg-[#2ea2e6] text-white py-2.5 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors"
                >
                  {lastAppointmentTime ? '确认改约' : '确认预约'}
                </button>
                <p className="text-xs text-gray-400 mt-3 text-center">操作提示：此操作将更新本次任务下所有关联工单的预约时间。请确保与客户沟通一致后再执行。</p>
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'FEEDBACK' && (
          <div className="space-y-4 animate-fade-in">
            {taskStatus !== '待受理' && taskStatus !== '已完成' && taskStatus !== '撤单' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">新增反馈</h3>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="请输入阶段反馈内容..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-400 mb-3"
                ></textarea>
                <button onClick={handleSubmitFeedback} className="w-full bg-[#2ea2e6] text-white py-2.5 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors">
                  提交反馈
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">反馈记录</h3>
              {taskStatus === '待受理' ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  暂无反馈记录
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbacks.map((fb, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-gray-800 flex items-center gap-1"><User size={14}/> {fb.user}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {fb.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-2">{fb.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

export default GroupTaskDetail;
