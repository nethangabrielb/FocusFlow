import React, { useState } from 'react';
import { useStore, Priority } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { Plus, X, Calendar, Flag, Tag, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { addDays, addHours, startOfTomorrow } from 'date-fns';

export const AddTask: React.FC = () => {
    const addTask = useStore(state => state.addTask);
    const userState = useUserState();

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');

    // Quick Add State
    const [quickInput, setQuickInput] = useState('');

    const handleSimpleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title,
            dueDate: dueDate || null,
            category: 'General',
            priority
        });

        setTitle('');
        setDueDate('');
        setPriority('medium');
        setIsOpen(false);
    };

    const handleQuickSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickInput.trim()) return;

        // Simple parsing logic
        let parsedDate: Date | null = null;
        let cleanTitle = quickInput;

        if (quickInput.toLowerCase().includes('tomorrow')) {
            parsedDate = startOfTomorrow();
            // Set to 9 AM by default
            parsedDate = addHours(parsedDate, 9);
            cleanTitle = cleanTitle.replace(/tomorrow/i, '').trim();
        } else if (quickInput.toLowerCase().includes('tonight')) {
            const now = new Date();
            parsedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);
            cleanTitle = cleanTitle.replace(/tonight/i, '').trim();
        }

        addTask({
            title: cleanTitle,
            dueDate: parsedDate ? parsedDate.toISOString() : null,
            category: 'Quick Add',
            priority: 'medium'
        });

        setQuickInput('');
    };

    // Beginner Mode: FAB + Modal
    if (userState === 'beginner') {
        return (
            <>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">New Task</h2>
                                    <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSimpleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">What needs to be done?</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g., Buy groceries"
                                            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary text-lg"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">When? (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={dueDate}
                                            onChange={e => setDueDate(e.target.value)}
                                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!title.trim()}
                                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        Add Task
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-30"
                >
                    <Plus size={32} />
                </motion.button>

                {/* Tooltip for first interaction */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-28 right-8 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-primary arrow-bottom"
                    >
                        Add your first task here! 👇
                    </motion.div>
                )}
            </>
        );
    }

    // Experienced Mode: Quick Add Bar
    return (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
            <form onSubmit={handleQuickSubmit} className="relative">
                <input
                    type="text"
                    value={quickInput}
                    onChange={e => setQuickInput(e.target.value)}
                    placeholder="Quick add... (e.g. 'Call Mom tomorrow')"
                    className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={!quickInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white transition-colors disabled:opacity-50"
                >
                    <Send size={20} />
                </button>
            </form>
            <div className="flex gap-4 mt-2 px-1 overflow-x-auto text-xs text-gray-400 scrollbar-hide">
                <span className="flex items-center gap-1"><Calendar size={12} /> Natural Language</span>
                <span className="flex items-center gap-1"><Tag size={12} /> #tags supported</span>
                <span className="flex items-center gap-1"><Flag size={12} /> !priority</span>
            </div>
        </div>
    );
};
