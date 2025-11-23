import React from 'react';
import { useAppContext } from '../context/AppContext';

const DebugPanel = () => {
    const { simulateState, userState } = useAppContext();

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            zIndex: 1000,
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <h4 style={{ margin: 0, borderBottom: '1px solid #555', paddingBottom: '5px' }}>Debug Panel</h4>
            <div>Current Mode: <strong style={{ color: userState === 'experienced' ? '#4ade80' : '#60a5fa' }}>{userState.toUpperCase()}</strong></div>
            <button onClick={() => simulateState('EXPERIENCED')} style={btnStyle}>Simulate Level Up</button>
            <button onClick={() => simulateState('FOCUSED')} style={btnStyle}>Simulate Focused</button>
            <button onClick={() => simulateState('DISTRACTED')} style={btnStyle}>Simulate Distracted</button>
            <button onClick={() => simulateState('RESET')} style={{ ...btnStyle, background: '#ef4444' }}>Reset User State</button>
        </div>
    );
};

const btnStyle = {
    background: '#333',
    color: 'white',
    border: '1px solid #555',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background 0.2s'
};

export default DebugPanel;
