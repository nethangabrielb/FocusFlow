import React from 'react';
import { useAppContext } from '../context/AppContext';

const OnboardingModal = () => {
    const { showOnboarding, closeOnboarding, userState } = useAppContext();

    if (!showOnboarding || userState !== 'beginner') return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Welcome to Adaptive Todo!</h2>
                <p>This is a simple way to track your tasks. We'll guide you through the basics.</p>
                <ul>
                    <li>📝 <strong>Add Tasks</strong>: Click the big button to create a new task.</li>
                    <li>✅ <strong>Complete</strong>: Click the checkbox when you're done.</li>
                    <li>🚀 <strong>Level Up</strong>: Complete 5 tasks to unlock advanced features!</li>
                </ul>
                <button onClick={closeOnboarding} className="primary-btn">Get Started</button>
            </div>
        </div>
    );
};

export default OnboardingModal;
