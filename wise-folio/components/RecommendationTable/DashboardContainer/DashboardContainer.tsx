import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export function DashboardContainer({ children }: ContainerProps) {
  return (
    <div className="min-h-screen w-screen bg-[#0b0f19] text-slate-100 flex flex-col m-0 p-0 overflow-x-hidden">
      {children}
    </div>
  );
}