import React from 'react';
import { LayoutDashboard, CheckSquare, Activity } from 'lucide-react';
import { useUserState } from '../hooks/useUserState';
import clsx from 'clsx';

interface SidebarProps {
    currentView: 'dashboard' | 'tasks' | 'settings';
    onNavigate: (view: 'dashboard' | 'tasks' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
    const userState = useUserState();
    const isDark = userState === 'experienced';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    ] as const;

    return (
        <div className={clsx(
            "h-screen w-64 flex flex-col border-r transition-colors duration-300",
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
        )}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "p-2 rounded-xl transition-colors",
                        isDark ? "bg-blue-600" : "bg-blue-100"
                    )}>
                        <Activity className={clsx(
                            "w-6 h-6",
                            isDark ? "text-white" : "text-blue-600"
                        )} />
                    </div>
                    <span className={clsx(
                        "font-bold text-xl",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        FocusFlow
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                            currentView === item.id
                                ? (isDark
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                    : "bg-blue-50 text-blue-600 shadow-sm")
                                : (isDark
                                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                        )}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={clsx(
                "p-4 border-t",
                isDark ? "border-slate-800" : "border-gray-200"
            )}>
                <div className={clsx(
                    "p-4 rounded-xl border",
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
                )}>
                    <p className={clsx(
                        "text-xs font-semibold uppercase tracking-wider mb-1.5",
                        isDark ? "text-slate-500" : "text-gray-500"
                    )}>
                        Current Mode
                    </p>
                    <p className={clsx(
                        "font-bold text-sm capitalize flex items-center gap-2",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        <span className={clsx(
                            "w-2 h-2 rounded-full",
                            userState === 'experienced' ? "bg-blue-500" :
                                userState === 'needsHelp' ? "bg-orange-500" : "bg-green-500"
                        )} />
                        {userState === 'needsHelp' ? 'Needs Help' : userState}
                    </p>
                </div>
            </div>
        </div>
    );
};
