import React from 'react';

export const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`px-3 py-1.5 rounded border border-blue-500/30 text-white outline-none focus:border-neon-blue ${props.className || ''}`} />
);

export const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={`px-3 py-1.5 rounded border border-blue-500/30 text-white outline-none focus:border-neon-blue ${props.className || ''}`}>
        {props.children}
    </select>
);

export const StyledButton = ({ variant = 'primary', icon, children, className = '', ...props }: any) => {
    const baseStyle = "flex items-center justify-center gap-2 px-4 py-1.5 rounded transition-colors text-sm font-medium";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500",
        secondary: "bg-transparent hover:bg-blue-500/10 text-blue-300 border border-blue-500/30",
        toolbar: "bg-[#1e3a5f] hover:bg-[#2a4a7f] text-white border border-blue-500/30",
    };
    return (
        <button {...props} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}>
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
};
