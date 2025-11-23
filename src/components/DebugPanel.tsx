import React from 'react';
import { useStore } from '../store/useStore';
import { Bug, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DebugPanel: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const debugSetState = useStore(state => state.debugSetState);

    const simulateBeginner = () => {
        debugSetState({
            tasks: [],
            userProfile: {
                totalCompletedTasks: 0,
                hasSeenOnboarding: false,
                lastInterventionDate: null
            }
        });
        window.location.reload();
    };

    const simulateExperienced = () => {
        debugSetState({
            tasks: [
                { id: '1', title: 'Task 1', dueDate: null, completedAt: new Date().toISOString(), category: 'General', priority: 'medium' },
                { id: '2', title: 'Task 2', dueDate: null, completedAt: new Date().toISOString(), category: 'General', priority: 'medium' },
                { id: '3', title: 'Task 3', dueDate: null, completedAt: new Date().toISOString(), category: 'General', priority: 'medium' },
                { id: '4', title: 'Task 4', dueDate: null, completedAt: new Date().toISOString(), category: 'General', priority: 'medium' },
                { id: '5', title: 'Task 5', dueDate: null, completedAt: new Date().toISOString(), category: 'General', priority: 'medium' },
            ],
            userProfile: {
                totalCompletedTasks: 5,
                hasSeenOnboarding: true,
                lastInterventionDate: null
            }
        });
        window.location.reload();
    };

    const simulateIntervention = () => {
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        const threeDaysAgo = new Date(now - 3 * day).toISOString();
        const fourDaysAgo = new Date(now - 4 * day).toISOString();
        const fiveDaysAgo = new Date(now - 5 * day).toISOString();

        debugSetState({
            tasks: [
                { id: '1', title: 'Overdue Task 1', dueDate: threeDaysAgo, completedAt: null, category: 'Work', priority: 'high' },
                { id: '2', title: 'Overdue Task 2', dueDate: fourDaysAgo, completedAt: null, category: 'Personal', priority: 'medium' },
                { id: '3', title: 'Overdue Task 3', dueDate: fiveDaysAgo, completedAt: null, category: 'Urgent', priority: 'high' }
            ],
            userProfile: {
                totalCompletedTasks: 10,
                hasSeenOnboarding: true,
                lastInterventionDate: null // Ensure modal shows
            }
        });
        window.location.reload();
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-700 w-64"
                    >
                        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Debug Controls</h3>
                        <div className="space-y-2">
                            <button
                                onClick={simulateBeginner}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                            >
                                <RefreshCw size={16} className="text-blue-400" />
                                Reset to Beginner
                            </button>
                            <button
                                onClick={simulateExperienced}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                            >
                                <CheckCircle size={16} className="text-green-400" />
                                Simulate Experienced
                            </button>
                            <button
                                onClick={simulateIntervention}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                            >
                                <AlertTriangle size={16} className="text-orange-400" />
                                Simulate Intervention
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-900 text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-colors border border-gray-700"
                title="Debug Panel"
            >
                <Bug size={24} />
            </button>
        </div>
    );
};
