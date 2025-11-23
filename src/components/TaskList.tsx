import React from 'react';
import { useStore } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { format } from 'date-fns';
import { Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className={clsx(
            "flex-1 overflow-y-auto p-4",
            userState === 'beginner' ? "space-y-4" : "space-y-1"
        )}>
            <AnimatePresence>
                {sortedTasks.map(task => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={clsx(
                            "relative group transition-all",
                            userState === 'beginner'
                                ? "bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                                : "bg-gray-800 p-3 rounded-lg flex items-center gap-3 border border-gray-700"
                        )}
                    >
                        <button
                            onClick={() => completeTask(task.id)}
                            className={clsx(
                                "flex-shrink-0 transition-colors",
                                task.completedAt ? "text-green-500" : "text-gray-400 hover:text-primary"
                            )}
                        >
                            {task.completedAt ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={clsx(
                                "font-medium truncate",
                                task.completedAt && "line-through text-gray-400",
                                userState === 'beginner' ? "text-xl mb-1" : "text-sm text-white"
                            )}>
                                {task.title}
                            </h3>

                            {(userState !== 'beginner' || task.dueDate) && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {task.dueDate && (
                                        <span className={clsx(
                                            "flex items-center gap-1",
                                            // Highlight overdue
                                            !task.completedAt && new Date(task.dueDate) < new Date() && "text-red-400"
                                        )}>
                                            {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                                        </span>
                                    )}
                                    {userState !== 'beginner' && (
                                        <span className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                                            {task.category || 'General'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Delete button - always visible in beginner, swipe/hover in experienced */}
                        <button
                            onClick={() => deleteTask(task.id)}
                            className={clsx(
                                "text-gray-400 hover:text-red-500 transition-colors",
                                userState === 'beginner' ? "p-2" : "opacity-0 group-hover:opacity-100"
                            )}
                        >
                            <Trash2 size={20} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
