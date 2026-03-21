import React, { useState } from 'react';
import { User, Phone, AlertCircle, FileText, Clock, MapPin, ChevronRight, CheckCircle2, Circle, ChevronDown, Activity, Settings, Check, X } from 'lucide-react';
import { ComplaintRecord, OperationRecord } from '../src/types/complaint';

interface ComplaintDetailProps {
  complaint: ComplaintRecord;
  onBack?: () => void;
  onUpdateComplaint?: (id: string, updates: Partial<ComplaintRecord>) => void;
}

const InfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-3.5 border-b border-gray-100 last:border-0">
    <span className="text-gray-400 text-sm whitespace-nowrap mr-4">{label}</span>
    <span className="text-gray-800 text-sm font-bold text-right break-all leading-tight">{value || '-'}</span>
  </div>
);

const SectionHeader: React.FC<{ title: string; isExpanded?: boolean; onToggle?: () => void; isStatic?: boolean }> = ({ title, isExpanded, onToggle, isStatic }) => (
  <div 
    className={`px-4 py-4 flex items-center justify-between ${!isStatic ? 'cursor-pointer active:bg-gray-50 transition-colors' : ''}`}
    onClick={!isStatic ? onToggle : undefined}
  >
    <div className="flex items-center space-x-3">
      <div className="w-1.5 h-6 bg-[#2ea2e6] rounded-sm"></div>
      <h3 className="text-base font-bold text-gray-900 leading-none">{title}</h3>
    </div>
    {!isStatic && (
      <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
        <ChevronDown size={20} />
      </div>
    )}
  </div>
);

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, onUpdateComplaint }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'PROCESS' | 'ACTION'>('INFO');
  
  // Ensure activeTab is valid if permission is missing or status is Completed
  React.useEffect(() => {
    const isActionHidden = complaint.tab !== 'TODO' && (complaint.hasPermission === false || complaint.status === '已完成');
    if (isActionHidden && activeTab === 'ACTION') {
      setActiveTab('INFO');
    }
  }, [complaint.tab, complaint.hasPermission, complaint.status, activeTab]);

  // Expansion states
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    business: false,
    complaint: false,
    progress: true,
    records: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Action states
  const [handleType, setHandleType] = useState<'RETURN' | 'TRANSFER' | 'REJECT' | ''>('');
  const [faultType, setFaultType] = useState('');
  const [handleResult, setHandleResult] = useState('');
  const [handleDesc, setHandleDesc] = useState('');
  const [transferTarget, setTransferTarget] = useState<'IRON' | 'BRANCH' | ''>('');
  const [transferTeam, setTransferTeam] = useState('');
  const [qaResult, setQaResult] = useState<'PASS' | 'REJECT' | ''>('');
  const [satisfaction, setSatisfaction] = useState('');
  const [qaRemark, setQaRemark] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processRejectReason, setProcessRejectReason] = useState('');

  const steps = [
    { title: '派发', status: complaint.status === '待派发' ? 'doing' : 'done' },
    { title: '处理', status: ['待受理', '处理中', '已驳回'].includes(complaint.status) ? 'doing' : (complaint.status === '待派发' ? (complaint.operationRecords.some(r => r.name === '工单驳回') ? 'done' : 'todo') : 'done') },
    { title: '质检', status: ['待质检'].includes(complaint.status) ? 'doing' : (['已驳回', '已完成'].includes(complaint.status) ? 'done' : 'todo') },
    { title: '归档', status: complaint.status === '已完成' ? 'done' : 'todo' },
  ];

  const handleAccept = () => {
    if (onUpdateComplaint) {
      const newRecord: OperationRecord = {
        name: '工单受理',
        time: new Date().toLocaleString(),
        operator: '当前用户',
        phone: '13800138000',
        description: '工单已受理，进入处理环节。'
      };
      onUpdateComplaint(complaint.id, { 
        status: '处理中',
        operationRecords: [newRecord, ...complaint.operationRecords]
      });
    }
  };

  const handleSubmitProcess = () => {
    if (!handleType) return;
    if (onUpdateComplaint) {
      const isReturn = handleType === 'RETURN';
      const isReject = handleType === 'REJECT';
      const newStatus = isReturn ? '待质检' : (isReject ? '待派发' : '待受理');
      const newRecord: OperationRecord = {
        name: isReturn ? '工单回单' : (isReject ? '工单驳回' : '工单转派'),
        time: new Date().toLocaleString(),
        operator: '当前用户',
        phone: '13800138000',
        description: isReturn ? `处理结果：${handleResult}；处理说明：${handleDesc}` : (isReject ? `驳回原因：${processRejectReason}` : `转派至：${transferTarget === 'IRON' ? '铁通班组' : '分公司客响人员'}`)
      };
      onUpdateComplaint(complaint.id, { 
        status: newStatus,
        operationRecords: [newRecord, ...complaint.operationRecords]
      });
      // Reset states
      setHandleType('');
      setHandleDesc('');
      setHandleResult('');
      setFaultType('');
      setProcessRejectReason('');
    }
  };

  const handleSubmitQA = () => {
    if (!qaResult) return;
    if (onUpdateComplaint) {
      const isPass = qaResult === 'PASS';
      const newStatus = isPass ? '已完成' : '已驳回';
      const newRecord: OperationRecord = {
        name: isPass ? '质检通过' : '质检驳回',
        time: new Date().toLocaleString(),
        operator: '当前用户',
        phone: '13800138000',
        description: isPass ? `满意度：${satisfaction}；质检备注：${qaRemark}` : `驳回原因：${rejectReason}`
      };
      onUpdateComplaint(complaint.id, { 
        status: newStatus,
        operationRecords: [newRecord, ...complaint.operationRecords],
        tab: isPass ? 'DONE' : 'TODO'
      });
      // Reset states
      setQaResult('');
      setSatisfaction('');
      setQaRemark('');
      setRejectReason('');
    }
  };

  const renderInfoTab = () => (
    <div className="space-y-4 p-4">
      {/* 基本信息 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader 
          title="基本信息" 
          isExpanded={expandedSections.basic} 
          onToggle={() => toggleSection('basic')} 
        />
        {expandedSections.basic && (
          <div className="px-4 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <InfoRow label="工单编号" value={complaint.id} />
            <InfoRow label="工单状态" value={complaint.status} />
            <InfoRow label="工单来源" value={complaint.source} />
            <InfoRow label="派单时间" value={complaint.dispatchTime} />
            <InfoRow label="处理时限" value={complaint.deadline} />
            <InfoRow label="区域" value={`${complaint.city}-${complaint.county}`} />
          </div>
        )}
      </div>

      {/* 客户业务信息 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader 
          title="客户业务信息" 
          isExpanded={expandedSections.business} 
          onToggle={() => toggleSection('business')} 
        />
        {expandedSections.business && (
          <div className="px-4 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <InfoRow label="业务类型" value={complaint.businessType} />
            <InfoRow label="产品实例" value={complaint.productInstance} />
            <InfoRow label="电路编号" value={complaint.circuitId} />
            <InfoRow label="客户名称" value={complaint.customerName} />
            <InfoRow label="客户编号" value={complaint.customerId} />
            <InfoRow label="A端保障等级" value={complaint.aEndLevel} />
            <InfoRow label="Z端保障等级" value={complaint.zEndLevel} />
            <InfoRow label="A端地址" value={complaint.aEndAddress} />
            <InfoRow label="Z端地址" value={complaint.zEndAddress} />
          </div>
        )}
      </div>

      {/* 投诉信息 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader 
          title="投诉信息" 
          isExpanded={expandedSections.complaint} 
          onToggle={() => toggleSection('complaint')} 
        />
        {expandedSections.complaint && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <InfoRow label="故障时间" value={complaint.faultTime} />
            <InfoRow label="投诉人" value={`${complaint.contactPerson} (${complaint.customerPhone})`} />
            <div className="py-3">
              <span className="text-gray-400 text-sm block mb-2">投诉内容</span>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                {complaint.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProcessTab = () => (
    <div className="space-y-4 p-4">
      {/* 流程进度 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader title="流程进度" isStatic />
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between relative px-2">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                    step.status === 'done' ? 'bg-[#2ea2e6] border-[#2ea2e6] text-white' :
                    step.status === 'doing' ? 'bg-white border-[#2ea2e6] text-[#2ea2e6]' :
                    step.status === 'reject' ? 'bg-white border-red-500 text-red-500' :
                    'bg-[#e9ecef] border-[#e9ecef] text-[#6c757d]'
                  }`}>
                    {step.status === 'done' ? <Check size={20} strokeWidth={3} /> : 
                     step.status === 'reject' ? <X size={20} strokeWidth={3} /> :
                     <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <span className={`text-sm mt-3 font-bold ${
                    step.status === 'done' || step.status === 'doing' ? 'text-[#2ea2e6]' : 
                    step.status === 'reject' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center px-1 -mt-8 relative min-w-[40px]">
                    {/* Forward Line with Arrow */}
                    <div className="w-full flex items-center mb-1">
                      <div className={`h-0.5 flex-1 ${steps[index + 1].status !== 'todo' ? 'bg-[#2ea2e6]' : 'bg-gray-200'}`}></div>
                      <div className={`w-1.5 h-1.5 border-t-2 border-r-2 rotate-45 -ml-1 ${steps[index + 1].status !== 'todo' ? 'border-[#2ea2e6]' : 'border-gray-200'}`}></div>
                    </div>
                    
                    {/* Backward Line with Arrow (Return Path) */}
                    {index === 0 && (
                      <div className="w-full flex items-center mt-1">
                        <div className={`w-1.5 h-1.5 border-b-2 border-l-2 rotate-45 -mr-1 ${complaint.operationRecords.some(r => r.name === '工单驳回') ? 'border-red-500' : 'border-gray-300'}`}></div>
                        <div className={`h-0.5 flex-1 ${complaint.operationRecords.some(r => r.name === '工单驳回') ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="w-full flex items-center mt-1">
                        <div className={`w-1.5 h-1.5 border-b-2 border-l-2 rotate-45 -mr-1 ${complaint.operationRecords.some(r => r.name === '质检驳回') ? 'border-red-500' : 'border-gray-300'}`}></div>
                        <div className={`h-0.5 flex-1 ${complaint.operationRecords.some(r => r.name === '质检驳回') ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 操作记录 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader title="操作记录" isStatic />
        <div className="p-4 pt-2 space-y-4 relative pl-8 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {complaint.operationRecords.map((record, index) => (
            <div key={index} className="relative py-2">
              {/* Timeline Dot */}
              <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white bg-[#2ea2e6] shadow-sm z-10"></div>
              
              {/* Record Card */}
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-sm">{record.name}</span>
                  <span className="text-sm text-gray-400">{record.time}</span>
                </div>
                
                <div className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-[#2ea2e6] rounded-md text-sm mb-2 font-medium">
                  {record.operator}{record.phone !== '-' ? `(${record.phone})` : ''}
                </div>
                
                <div className="text-sm text-gray-600 leading-relaxed">
                  {record.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActionTab = () => {
    if (complaint.status === '待派发') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="text-indigo-500 shrink-0" size={18} />
              <h4 className="text-sm font-bold text-indigo-500">派发提示</h4>
            </div>
            <p className="text-sm text-indigo-600 leading-relaxed">
              该工单目前处于待派发状态，等待相关人员进行派发。
            </p>
          </div>
        </div>
      );
    }

    if (complaint.status === '待受理') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="text-[#2ea2e6] shrink-0" size={18} />
              <h4 className="text-sm font-bold text-[#2ea2e6]">受理提示</h4>
            </div>
            <p className="text-sm text-blue-600 leading-relaxed">
              该工单目前处于待受理状态，请核实投诉内容后点击下方按钮进行受理。
            </p>
          </div>
        </div>
      );
    }

    if (complaint.status === '处理中' || complaint.status === '已驳回') {
      const rejectRecord = complaint.operationRecords.find(r => r.name === '质检驳回');
      const rejectReasonText = rejectRecord ? rejectRecord.description.replace('驳回原因：', '') : '暂无说明';

      return (
        <div className="p-4 space-y-4">
          {complaint.status === '已驳回' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <h4 className="text-sm font-bold text-red-500">驳回提示</h4>
              </div>
              <p className="text-sm text-red-600 leading-relaxed mb-1">
                该工单质检未通过已被驳回，请重新处理并提交。
              </p>
              <p className="text-sm text-red-600 leading-relaxed">
                <span className="font-medium">驳回原因：</span>
                {rejectReasonText}
              </p>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">处理结果</label>
              <select 
                value={handleType}
                onChange={(e) => setHandleType(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
              >
                <option value="">请选择处理方式</option>
                <option value="RETURN">回单</option>
                <option value="TRANSFER">转派</option>
                <option value="REJECT">驳回</option>
              </select>
            </div>

            {handleType === 'REJECT' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">驳回原因</label>
                  <textarea 
                    value={processRejectReason}
                    onChange={(e) => setProcessRejectReason(e.target.value)}
                    rows={3}
                    placeholder="请输入驳回原因..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                  />
                </div>
              </div>
            )}

            {handleType === 'RETURN' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">故障类型</label>
                  <select 
                    value={faultType}
                    onChange={(e) => setFaultType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                  >
                    <option value="">请选择故障类型</option>
                    <option value="1">设备故障</option>
                    <option value="2">线路故障</option>
                    <option value="3">业务配置问题</option>
                    <option value="4">用户原因</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">处理结果</label>
                  <select 
                    value={handleResult}
                    onChange={(e) => setHandleResult(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                  >
                    <option value="">请选择处理结果</option>
                    <option value="1">已修复</option>
                    <option value="2">解释说明</option>
                    <option value="3">延期处理</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">处理说明</label>
                  <textarea 
                    value={handleDesc}
                    onChange={(e) => setHandleDesc(e.target.value)}
                    rows={3}
                    placeholder="请输入详细的处理说明..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                  />
                </div>
              </div>
            )}

            {handleType === 'TRANSFER' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">下派对象</label>
                  <select 
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                  >
                    <option value="">请选择下派对象</option>
                    <option value="IRON">铁通班组</option>
                    <option value="BRANCH">分公司客响人员</option>
                  </select>
                </div>
                {transferTarget === 'IRON' && (
                  <div>
                    <label className="block text-sm text-gray-500 mb-1.5">下派班组</label>
                    <select 
                      value={transferTeam}
                      onChange={(e) => setTransferTeam(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
                    >
                      <option value="">请选择班组</option>
                      <option value="1">铁通一班</option>
                      <option value="2">铁通二班</option>
                      <option value="3">铁通三班</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (complaint.status === '待质检') {
      return (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">质检结果</label>
              <select 
                value={qaResult}
                onChange={(e) => setQaResult(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2ea2e6]"
              >
                <option value="">请选择质检结果</option>
                <option value="PASS">通过</option>
                <option value="REJECT">驳回</option>
              </select>
            </div>

            {qaResult === 'PASS' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">客户满意度</label>
                  <select 
                    value={satisfaction}
                    onChange={(e) => setSatisfaction(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">请选择满意度</option>
                    <option value="非常满意">非常满意</option>
                    <option value="满意">满意</option>
                    <option value="一般">一般</option>
                    <option value="不满意">不满意</option>
                    <option value="非常不满意">非常不满意</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">质检备注</label>
                  <textarea 
                    value={qaRemark}
                    onChange={(e) => setQaRemark(e.target.value)}
                    rows={3}
                    placeholder="请输入质检备注..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {qaResult === 'REJECT' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm text-gray-500 mb-1.5">驳回原因</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="请输入驳回原因..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <CheckCircle2 size={48} className="mb-4 opacity-20" />
        <p className="text-sm">该工单已完成处理</p>
      </div>
    );
  };

  const tabs = [
    { id: 'INFO', label: '工单信息', icon: FileText },
    { id: 'PROCESS', label: '流程信息', icon: Activity },
    ...(complaint.tab === 'TODO' || (complaint.hasPermission !== false && complaint.status !== '已完成') ? [{ id: 'ACTION', label: '投诉处理', icon: Settings }] : [])
  ];

  return (
    <div className="bg-gray-50 min-h-full flex flex-col w-full relative overflow-hidden">
      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-200 sticky top-0 z-30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-xs font-medium flex flex-col items-center gap-1 relative ${
                isActive ? 'text-[#2ea2e6]' : 'text-gray-500'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2ea2e6] rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'INFO' && renderInfoTab()}
        {activeTab === 'PROCESS' && renderProcessTab()}
        {activeTab === 'ACTION' && renderActionTab()}
      </div>

      {/* Fixed Bottom Action Bar for ACTION tab */}
      {activeTab === 'ACTION' && (
        <div className="bg-white border-t border-gray-200 p-2.5 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {complaint.status === '待受理' && (
            <button 
              onClick={handleAccept}
              className="w-full bg-[#2ea2e6] text-white py-2 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors"
            >
              受理
            </button>
          )}
          {(complaint.status === '处理中' || complaint.status === '已驳回') && (
            <button 
              onClick={handleSubmitProcess}
              disabled={!handleType || (handleType === 'RETURN' && (!faultType || !handleResult)) || (handleType === 'TRANSFER' && !transferTarget) || (handleType === 'REJECT' && !processRejectReason)}
              className="w-full bg-[#2ea2e6] text-white py-2 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors disabled:opacity-50"
            >
              提交处理
            </button>
          )}
          {complaint.status === '待质检' && (
            <button 
              onClick={handleSubmitQA}
              disabled={!qaResult || (qaResult === 'PASS' && !satisfaction) || (qaResult === 'REJECT' && !rejectReason)}
              className="w-full bg-[#2ea2e6] text-white py-2 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors disabled:opacity-50"
            >
              提交质检
            </button>
          )}
          {(complaint.status === '已完成' || complaint.status === '撤单') && (
            <button className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-medium text-sm cursor-not-allowed">
              工单已结束
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
