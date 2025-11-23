import React from 'react';
import { useAppContext } from '../context/AppContext';

const MotivationalWidget = () => {
    const { userState, behaviorState, stats } = useAppContext();

    const getMessage = () => {
        if (behaviorState === 'focused') {
            return "🔥 You're on fire! Keep the streak alive!";
        }
        if (behaviorState === 'distracted') {
            return "⚠️ You have several overdue tasks. Let's tackle one small thing first.";
        }

        if (userState === 'beginner') {
            if (stats.completed === 0) return "Welcome! Start by adding your first task.";
            if (stats.completed < 5) return `Great start! ${5 - stats.completed} more to unlock Expert Mode.`;
            return "You're doing great!";
        } else {
            return "Productivity systems online. Ready for input.";
        }
    };

    return (
        <div className={`motivational-widget ${behaviorState}`}>
            <p>{getMessage()}</p>
        </div>
    );
};

export default MotivationalWidget;
