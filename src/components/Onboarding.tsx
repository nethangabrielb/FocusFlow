import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

const steps = [
    {
        title: "Welcome to FocusFlow",
        description: "The task manager that adapts to you. Let's get started with the basics.",
        icon: "👋"
    },
    {
        title: "Start Small",
        description: "Add your first task. Don't worry about categories or due dates yet.",
        icon: "🌱"
    },
    {
        title: "Build Momentum",
        description: "Complete 5 tasks to unlock Experienced Mode with advanced features.",
        icon: "🚀"
    }
];

export const Onboarding: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const completeOnboarding = useStore(state => state.completeOnboarding);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            completeOnboarding();
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="text-6xl mb-6">{steps[currentStep].icon}</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {steps[currentStep].title}
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        {steps[currentStep].description}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mb-8">
                {steps.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-colors ${idx === currentStep ? 'bg-primary' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>

            <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-opacity-90 transition-all"
            >
                {currentStep === steps.length - 1 ? "Let's Go" : "Next"}
                {currentStep === steps.length - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
            </button>
        </div>
    );
};
