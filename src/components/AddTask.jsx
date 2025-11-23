import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AddTask = () => {
    const { userState, addTask } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [text, setText] = useState('');
    const [date, setDate] = useState('');

    // Experienced Mode Input
    const [quickInput, setQuickInput] = useState('');

    const handleBeginnerSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        addTask(text, date);
        setText('');
        setDate('');
        setIsExpanded(false);
    };

    const handleExperiencedSubmit = (e) => {
        e.preventDefault();
        if (!quickInput.trim()) return;

        // Simple NLP Mock
        let taskText = quickInput;
        let taskDate = '';

        if (quickInput.toLowerCase().includes('tomorrow')) {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            taskDate = d.toISOString().split('T')[0];
            taskText = quickInput.replace(/tomorrow/i, '').trim();
        } else if (quickInput.toLowerCase().includes('today')) {
            const d = new Date();
            taskDate = d.toISOString().split('T')[0];
            taskText = quickInput.replace(/today/i, '').trim();
        }

        addTask(taskText, taskDate);
        setQuickInput('');
    };

    if (userState === 'experienced') {
        return (
            <form onSubmit={handleExperiencedSubmit} className="add-task-experienced">
                <input
                    type="text"
                    placeholder="Quick add (e.g., 'Buy milk tomorrow')..."
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    autoFocus
                />
                <button type="submit">↵</button>
            </form>
        );
    }

    // Beginner Mode
    return (
        <div className="add-task-beginner">
            {!isExpanded ? (
                <button className="expand-btn" onClick={() => setIsExpanded(true)}>
                    <span className="plus-icon">+</span> Add a new task
                </button>
            ) : (
                <form onSubmit={handleBeginnerSubmit} className="beginner-form">
                    <div className="form-group">
                        <label>What needs to be done?</label>
                        <input
                            type="text"
                            placeholder="e.g., Read a book"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoFocus
                        />
                        <span className="tooltip">Tip: Keep it short and clear!</span>
                    </div>
                    <div className="form-group">
                        <label>When is it due?</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsExpanded(false)} className="cancel-btn">Cancel</button>
                        <button type="submit" className="submit-btn">Add Task</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddTask;
