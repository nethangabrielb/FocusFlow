import React from 'react';
import { useStore } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
    const userState = useUserState();
    const tasks = useStore(state => state.tasks);
    const userProfile = useStore(state => state.userProfile);
    const getOverdueTasksCount = useStore(state => state.getOverdueTasksCount);

    const pendingTasks = tasks.filter(t => !t.completedAt).length;
    const overdueCount = getOverdueTasksCount();

    const stats = [
        {
            label: 'Total Completed',
            value: userProfile.totalCompletedTasks,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-100',
            darkBg: 'bg-green-900/20'
        },
        {
            label: 'Pending Tasks',
            value: pendingTasks,
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            darkBg: 'bg-blue-900/20'
        },
        {
            label: 'Overdue',
            value: overdueCount,
            icon: AlertTriangle,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
            darkBg: 'bg-orange-900/20'
        }
    ];

    const isDark = userState === 'experienced';

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
                <h1 className={clsx(
                    "text-4xl font-bold",
                    isDark ? "text-white" : "text-gray-900"
                )}>
                    {userState === 'beginner' && "Welcome back!"}
                    {userState === 'experienced' && "Dashboard"}
                    {userState === 'needsHelp' && "Let's get back on track."}
                </h1>
                <p className={clsx(
                    "text-lg",
                    isDark ? "text-slate-400" : "text-gray-600"
                )}>
                    {userState === 'beginner' && "Here is an overview of your progress."}
                    {userState === 'experienced' && "Your productivity metrics at a glance."}
                    {userState === 'needsHelp' && "We can handle this, one task at a time."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={clsx(
                        "p-6 rounded-2xl transition-all duration-200 hover:scale-105",
                        isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white shadow-xl shadow-gray-200/50"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx(
                                "p-3 rounded-xl",
                                isDark ? stat.darkBg : stat.bg
                            )}>
                                <stat.icon className={clsx("w-6 h-6", stat.color)} />
                            </div>
                            {isDark && (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className={clsx(
                                "text-3xl font-bold",
                                isDark ? "text-white" : "text-gray-900"
                            )}>
                                {stat.value}
                            </h3>
                            <p className={clsx(
                                "text-sm font-medium",
                                isDark ? "text-slate-400" : "text-gray-600"
                            )}>
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className={clsx(
                "rounded-3xl p-8",
                isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white shadow-xl shadow-gray-200/50"
            )}>
                <h2 className={clsx(
                    "text-xl font-bold mb-6",
                    isDark ? "text-white" : "text-gray-900"
                )}>
                    Recent Tasks
                </h2>
                <div className="space-y-4">
                    {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className={clsx(
                            "flex items-center justify-between p-4 rounded-xl border transition-colors",
                            isDark
                                ? "bg-slate-900/50 border-slate-700 hover:bg-slate-900/80"
                                : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-2 h-2 rounded-full",
                                    task.priority === 'high' ? "bg-red-500" :
                                        task.priority === 'medium' ? "bg-yellow-500" : "bg-blue-500"
                                )} />
                                <span className={clsx(
                                    "font-medium",
                                    task.completedAt && "line-through text-gray-500",
                                    !task.completedAt && (isDark ? "text-slate-200" : "text-gray-900")
                                )}>
                                    {task.title}
                                </span>
                            </div>
                            <span className={clsx(
                                "text-xs px-2 py-1 rounded-full font-medium",
                                isDark ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-white text-gray-600 border border-gray-200"
                            )}>
                                {task.category}
                            </span>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <p className={clsx(
                            "text-center py-4",
                            isDark ? "text-slate-500" : "text-gray-500"
                        )}>No tasks yet. Get started!</p>
                    )}
                </div>
            </div>
        </div>
    );
};
