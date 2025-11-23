import React from 'react';
import { useStore } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { format } from 'date-fns';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { InterventionBanner } from './InterventionBanner';

export const TaskList: React.FC = () => {
    const tasks = useStore(state => state.tasks);
    const completeTask = useStore(state => state.completeTask);
    const deleteTask = useStore(state => state.deleteTask);
    const userState = useUserState();

    // Filter tasks based on mode? 
    // For now, show all. Intervention mode might filter.
    // Actually, intervention mode logic is handled in the modal/main view, 
    // but the list itself should look different.

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completedAt && !b.completedAt) return 1;
        if (!a.completedAt && b.completedAt) return -1;
        return 0;
    });

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-50">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg">No tasks yet.</p>
                {userState === 'beginner' && (
                    <p className="text-sm mt-2">Tap the big + button to start!</p>
                )}
            </div>
        );
    }

    const isDark = userState === 'experienced';

    return (
        <div className={clsx(
            "flex-1 overflow-y-auto px-4 pb-4",
            userState === 'beginner' ? "space-y-4" : "space-y-2"
        )}>
            <InterventionBanner />

            <AnimatePresence>
                {sortedTasks.map(task => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={clsx(
                            "relative group transition-all duration-200",
                            userState === 'beginner'
                                ? "bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                                : (isDark
                                    ? "bg-slate-800/40 p-3 rounded-xl flex items-center gap-3 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 hover:shadow-lg hover:shadow-black/20"
                                    : "bg-white p-3 rounded-lg flex items-center gap-3 border border-gray-200 shadow-sm")
                        )}
                    >
                        <button
                            onClick={() => completeTask(task.id)}
                            className={clsx(
                                "flex-shrink-0 transition-all duration-200",
                                task.completedAt
                                    ? "text-green-500 scale-110"
                                    : (isDark ? "text-slate-500 hover:text-blue-400 hover:scale-110" : "text-gray-400 hover:text-primary")
                            )}
                        >
                            {task.completedAt ? <CheckCircle size={22} /> : <Circle size={22} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={clsx(
                                "font-medium truncate transition-colors",
                                task.completedAt && "line-through text-gray-500",
                                userState === 'beginner'
                                    ? "text-xl mb-1"
                                    : (isDark
                                        ? (task.completedAt ? "text-slate-600" : "text-slate-200 group-hover:text-white")
                                        : "text-sm text-gray-900")
                            )}>
                                {task.title}
                            </h3>

                            {(userState !== 'beginner' || task.dueDate) && (
                                <div className="flex items-center gap-3 text-xs mt-0.5">
                                    {task.dueDate && (
                                        <span className={clsx(
                                            "flex items-center gap-1 font-medium",
                                            // Highlight overdue
                                            !task.completedAt && new Date(task.dueDate) < new Date()
                                                ? "text-red-400"
                                                : (isDark ? "text-slate-500" : "text-gray-500")
                                        )}>
                                            {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                                        </span>
                                    )}
                                    {userState !== 'beginner' && (
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold",
                                            isDark
                                                ? "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {task.category || 'General'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={() => deleteTask(task.id)}
                            className={clsx(
                                "transition-all duration-200",
                                userState === 'beginner'
                                    ? "p-2 text-gray-400 hover:text-red-500"
                                    : (isDark
                                        ? "opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                        : "opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500")
                            )}
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
