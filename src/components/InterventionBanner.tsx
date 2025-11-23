import React from 'react';
import { useStore } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { AlertTriangle, RefreshCw, Zap, X } from 'lucide-react';
import { format, parseISO, differenceInHours } from 'date-fns';

export const InterventionBanner: React.FC = () => {
    const userState = useUserState();
    const tasks = useStore(state => state.tasks);
    const userProfile = useStore(state => state.userProfile);
    const dismissIntervention = useStore(state => state.dismissIntervention);
    const rescheduleOverdueTasks = useStore(state => state.rescheduleOverdueTasks);
    const clearOverdueTasks = useStore(state => state.clearOverdueTasks);
    const getOverdueTasksCount = useStore(state => state.getOverdueTasksCount);

    const overdueCount = getOverdueTasksCount();

    // Logic to hide if dismissed recently (e.g., within last 1 hour)
    const shouldShow = React.useMemo(() => {
        if (userState !== 'needsHelp') return false;
        if (!userProfile.lastInterventionDate) return true;

        const lastIntervention = parseISO(userProfile.lastInterventionDate);
        const hoursSince = differenceInHours(new Date(), lastIntervention);

        // If dismissed less than 1 hour ago, don't show
        return hoursSince >= 1;
    }, [userState, userProfile.lastInterventionDate]);

    if (!shouldShow) return null;

    // Get top 3 overdue tasks
    const overdueTasks = tasks
        .filter(t => {
            if (!t.dueDate || t.completedAt) return false;
            return new Date(t.dueDate) < new Date();
        })
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 3);

    return (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Let's get back on track</h3>
                        <p className="text-sm text-gray-600">
                            You have <span className="font-bold text-orange-600">{overdueCount} overdue tasks</span>.
                            Here are the most urgent ones:
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => dismissIntervention()}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Dismiss for now"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Top 3 Overdue Tasks Preview */}
            <div className="space-y-2 mb-6">
                {overdueTasks.map(task => (
                    <div key={task.id} className="bg-white p-3 rounded-lg border border-orange-100 flex items-center justify-between">
                        <span className="font-medium text-gray-800">{task.title}</span>
                        <span className="text-xs text-red-500 font-medium">
                            Due {format(parseISO(task.dueDate!), 'MMM d')}
                        </span>
                    </div>
                ))}
                {overdueCount > 3 && (
                    <p className="text-xs text-center text-gray-500 italic">
                        ...and {overdueCount - 3} more
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => rescheduleOverdueTasks()}
                    className="flex-1 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw size={16} />
                    Reschedule All to Today
                </button>

                <button
                    onClick={() => clearOverdueTasks()}
                    className="flex-1 py-2.5 bg-white text-orange-600 border border-orange-200 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors"
                >
                    <Zap size={16} />
                    Clear Overdue Tasks
                </button>
            </div>

            <div className="mt-3 text-center">
                <button
                    onClick={() => dismissIntervention()}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    I'll handle it manually
                </button>
            </div>
        </div>
    );
};
