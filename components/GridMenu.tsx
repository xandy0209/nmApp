import React from 'react';
import { 
  User, 
  ClipboardList, 
  Server, 
  Calendar, 
  Monitor, 
  Heart, 
  Stethoscope, 
  MessageSquare,
  FileText,
  Clock,
  Briefcase,
  Activity,
  Search,
  Layers
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, colorClass, onClick, disabled }) => {
  return (
    <div 
      className="flex flex-col items-center justify-start space-y-1 p-1 transition-opacity active:opacity-70 cursor-pointer"
      onClick={disabled ? undefined : onClick}
    >
      <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
         {/* Using cloneElement or just passing explicit size to icon */}
         {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
      </div>
      <span className="text-gray-700 text-center leading-tight" style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );
};

interface GridMenuProps {
  onMenuClick?: (label: string) => void;
}

const GridMenu: React.FC<GridMenuProps> = ({ onMenuClick }) => {
  // Styles are approximations based on the screenshot colors
  const items: { label: string; icon: React.ReactNode; color: string; disabled?: boolean }[] = [
    { label: "客户查询", icon: <User />, color: "text-red-400 bg-red-50" },
    { label: "业务查询", icon: <ClipboardList />, color: "text-orange-400 bg-orange-50" },
    { label: "工单监控", icon: <Server />, color: "text-emerald-500 bg-emerald-50" },
    { label: "甩单支撑", icon: <Calendar />, color: "text-blue-500 bg-blue-50" },
    
    { label: "终端工单", icon: <Monitor />, color: "text-red-400 bg-red-50" },
    { label: "专线义诊", icon: <Heart />, color: "text-orange-400 bg-orange-50" },
    { label: "企宽义诊", icon: <Activity />, color: "text-emerald-500 bg-emerald-50" },
    { label: "投诉跟踪反馈", icon: <MessageSquare />, color: "text-blue-500 bg-blue-50", disabled: true },
    
    { label: "集中预约", icon: <Clock />, color: "text-red-400 bg-red-50" },
    { label: "通用工单", icon: <Briefcase />, color: "text-orange-400 bg-orange-50" },
    { label: "拨测管理", icon: <FileText />, color: "text-emerald-500 bg-emerald-50" },
    { label: "IMS固话查询", icon: <Search />, color: "text-blue-500 bg-blue-50" },
    
    { label: "团单管理", icon: <Layers />, color: "text-red-400 bg-red-50" },
    { label: "投诉支撑", icon: <MessageSquare />, color: "text-orange-400 bg-orange-50" },
    { label: "质差远程处置", icon: <Stethoscope />, color: "text-blue-500 bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-4 pt-2">
      {items.map((item, index) => (
        <MenuItem 
          key={index}
          label={item.label}
          icon={item.icon}
          colorClass={item.color}
          disabled={item.disabled}
          onClick={() => onMenuClick && onMenuClick(item.label)}
        />
      ))}
    </div>
  );
};

export default GridMenu;