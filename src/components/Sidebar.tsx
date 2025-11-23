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

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
        // { id: 'settings', label: 'Settings', icon: Settings }, // Future use
    ] as const;

    return (
        <div className={clsx(
            "h-screen w-64 flex flex-col border-r transition-colors duration-300",
            userState === 'experienced' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "p-2 rounded-lg",
                        userState === 'experienced' ? "bg-blue-600" : "bg-blue-100"
                    )}>
                        <Activity className={clsx(
                            "w-6 h-6",
                            userState === 'experienced' ? "text-white" : "text-blue-600"
                        )} />
                    </div>
                    <span className={clsx(
                        "font-bold text-xl",
                        userState === 'experienced' ? "text-white" : "text-gray-900"
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
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                            currentView === item.id
                                ? (userState === 'experienced'
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "bg-blue-50 text-blue-600 shadow-sm")
                                : (userState === 'experienced'
                                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900")
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200/10">
                <div className={clsx(
                    "p-4 rounded-xl",
                    userState === 'experienced' ? "bg-gray-800" : "bg-gray-50"
                )}>
                    <p className={clsx(
                        "text-xs font-medium uppercase tracking-wider mb-1",
                        userState === 'experienced' ? "text-gray-500" : "text-gray-400"
                    )}>
                        Current Mode
                    </p>
                    <p className={clsx(
                        "font-semibold capitalize",
                        userState === 'experienced' ? "text-white" : "text-gray-900"
                    )}>
                        {userState}
                    </p>
                </div>
            </div>
        </div>
    );
};
