import React from 'react';
import { useStore } from '../store/useStore';
import { useUserState } from '../hooks/useUserState';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Zap } from 'lucide-react';

export const InterventionModal: React.FC = () => {
    const userState = useUserState();
    const dismissIntervention = useStore(state => state.dismissIntervention);
    const overdueCount = useStore(state => state.getOverdueTasksCount());

    // Only show if in 'needsHelp' mode
    // Note: The hook already handles the logic, so if we are in 'needsHelp', we show this.
    // However, we might want to allow dismissing it for the session.
    // For this demo, let's assume 'needsHelp' state persists until they fix it, 
    // but the MODAL can be dismissed to view the list.
    // Actually, the requirement says: "automatically push a full-screen modal... on next app open"

    // Let's check if we should show the modal based on lastInterventionDate?
    // For simplicity, if userState is 'needsHelp', we show this overlay until they click "Re-prioritize" or "Focus Mode".

    if (userState !== 'needsHelp') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center"
            >
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-500">
                    <AlertTriangle size={40} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Let's get back on track
                </h2>

                <p className="text-gray-600 mb-8 max-w-xs">
                    You have <span className="font-bold text-orange-500">{overdueCount} overdue tasks</span> in the last week.
                    Don't worry, it happens! Let's clear the clutter.
                </p>

                <div className="space-y-4 w-full max-w-xs">
                    <button
                        onClick={() => dismissIntervention()}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} />
                        Re-prioritize Now
                    </button>

                    <button
                        onClick={() => dismissIntervention()}
                        className="w-full py-4 bg-orange-100 text-orange-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                    >
                        <Zap size={20} />
                        Enter Focus Mode
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
