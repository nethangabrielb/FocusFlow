import React from 'react';
import { Sidebar } from './Sidebar';
import { useUserState } from '../hooks/useUserState';
import clsx from 'clsx';

interface DashboardLayoutProps {
    children: React.ReactNode;
    currentView: 'dashboard' | 'tasks' | 'settings';
    onNavigate: (view: 'dashboard' | 'tasks' | 'settings') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onNavigate }) => {
    const userState = useUserState();

    return (
        <div className={clsx(
            "flex h-screen w-full overflow-hidden transition-colors duration-300",
            userState === 'experienced' ? "bg-gray-950" : "bg-gray-50"
        )}>
            <Sidebar currentView={currentView} onNavigate={onNavigate} />

            <main className="flex-1 h-full overflow-y-auto relative">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
