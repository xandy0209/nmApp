import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react';

interface InfoBlockProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="bg-white mb-3 shadow-sm border border-gray-100 rounded-lg overflow-hidden mx-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left border-b border-gray-100"
    >
      <span className="font-medium text-gray-800 border-l-4 border-[#2ea2e6] pl-2">{title}</span>
      {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    {isOpen && (
      <div className="px-4 py-2 text-sm text-gray-600 bg-white">
        {children}
      </div>
    )}
  </div>
);

const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-50 last:border-0 py-2.5">
    <span className="text-gray-500 w-1/2">{label}</span>
    <span className="text-gray-900 text-right w-1/2 break-all">{value}</span>
  </div>
);

const IMSQuery: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState({
    userInfo: true,
    customerInfo: false,
    businessInfo: false,
    nomadicInfo: false,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    if (phone.trim()) {
      setIsLoading(true);
      setHasSearched(false);

      // Simulate network request delay
      setTimeout(() => {
        setIsLoading(false);
        setHasSearched(true);
        // Reset expanded states according to requirements (User Info default expanded)
        setSections({
          userInfo: true,
          customerInfo: false,
          businessInfo: false,
          nomadicInfo: false,
        });
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-6 w-full">
      {/* Search Input Area */}
      <div className="bg-white p-4 shadow-sm mx-4 rounded-lg mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">固话号码</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="请输入号码"
            className="flex-1 border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`bg-[#2ea2e6] text-white p-2.5 rounded-md flex items-center justify-center shadow-sm shrink-0 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:bg-blue-600 transition-colors'}`}
            aria-label="查询"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Loading Indicator in Content Area */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ea2e6]"></div>
          <span className="mt-2 text-sm text-gray-500">正在查询...</span>
        </div>
      )}

      {!isLoading && hasSearched && (
        <div className="animate-fade-in">
          {/* 1. User Information */}
          <InfoBlock
            title="用户信息"
            isOpen={sections.userInfo}
            onToggle={() => toggleSection('userInfo')}
          >
            <DataRow label="TD用户查询" value="是" />
            <DataRow label="HSS开户信息" value="已开户" />
            <DataRow label="ENS开户信息" value="正常" />
            <DataRow label="铁通用户用户状态" value="在线" />
            <DataRow label="注册状态" value="已注册" />
            <DataRow label="移动固化用户注册信息" value="完整" />
            <DataRow label="用户数据状态" value="同步完成" />
          </InfoBlock>

          {/* 2. Group/Home Customer Info */}
          <InfoBlock
            title="集客/家客信息"
            isOpen={sections.customerInfo}
            onToggle={() => toggleSection('customerInfo')}
          >
            <DataRow label="集团编号" value="HB-CM-0012" />
            <DataRow label="用户号码" value={phone} />
            <DataRow label="用户状态" value="正常" />
            <DataRow label="集团状态" value="有效" />
          </InfoBlock>

          {/* 3. User Business Info */}
          <InfoBlock
            title="用户业务信息"
            isOpen={sections.businessInfo}
            onToggle={() => toggleSection('businessInfo')}
          >
            <DataRow label="无条件前转号码" value="无" />
            <DataRow label="遇忙前转号码" value="无" />
            <DataRow label="无应答前转号码" value="无" />
            <DataRow label="未注册前转号码" value="无" />
            <DataRow label="网内普通去话信息" value="允许" />
            <DataRow label="网内来话信息" value="允许" />
            <DataRow label="网间普通去话信息" value="允许" />
            <DataRow label="网间来话信息" value="允许" />
            <DataRow label="网外普通去话信息" value="允许" />
            <DataRow label="网外来话信息" value="允许" />
            <DataRow label="主叫一号通业务" value="未开通" />
            <DataRow label="被叫一号通业务" value="未开通" />
          </InfoBlock>

          {/* 4. Nomadic Info */}
          <InfoBlock
            title="游牧信息"
            isOpen={sections.nomadicInfo}
            onToggle={() => toggleSection('nomadicInfo')}
          >
            <DataRow label="是否开通游牧控制功能" value="否" />
            <DataRow label="游牧单IP限制" value="如果不限制则为空" />
            <DataRow label="游牧模板限制" value="默认模板" />
          </InfoBlock>
        </div>
      )}
    </div>
  );
};

export default IMSQuery;