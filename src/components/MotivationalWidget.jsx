import React from 'react';
import { useAppContext } from '../context/AppContext';

const MotivationalWidget = () => {
    const { behavioralIntervention } = useAppContext();

    if (behavioralIntervention !== 'missed_deadlines') return null;

    return (
        <div className="motivational-widget">
            <div className="widget-icon">⚠️</div>
            <div className="widget-content">
                <h3>Feeling Overwhelmed?</h3>
                <p>It looks like you have a few overdue tasks. Would you like to reschedule them for later or break them down?</p>
                <div className="widget-actions">
                    <button className="action-btn">Reschedule All to Tomorrow</button>
                    <button className="dismiss-btn">I'll handle it</button>
                </div>
            </div>
        </div>
    );
};

export default MotivationalWidget;
