import React from 'react';
import { Mail, ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showRightIcon?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title = "首页", showBack = false, showRightIcon = true, onBack, rightContent }) => {
  return (
    <header className="bg-[#2ea2e6] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Back Button or Placeholder */}
      <div className="w-6 flex justify-start">
        {showBack ? (
          <button onClick={onBack} className="p-0">
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-6"></div>
        )}
      </div>
      
      <h1 className="text-xl font-medium tracking-wide">{title}</h1>
      
      <div className="w-6 flex justify-end">
        {rightContent ? rightContent : (showRightIcon && <Mail className="w-6 h-6" />)}
      </div>
    </header>
  );
};

export default Header;