import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TaskItem = ({ task }) => {
    const { completeTask, deleteTask, userState } = useAppContext();
    const [isExiting, setIsExiting] = useState(false);

    const handleComplete = () => {
        // Simple confetti effect using particles (if no library, we skip or use simple CSS)
        // Since I can't install packages easily, I'll use a visual trick or just standard state change
        // But the plan said "Confetti effect", so let's try a simple DOM manipulation or just rely on CSS

        // Trigger CSS animation
        const element = document.getElementById(`task-${task.id}`);
        if (element) {
            element.classList.add('celebrate');
        }

        setTimeout(() => {
            completeTask(task.id);
        }, 500); // Wait for animation
    };

    const handleDelete = () => {
        setIsExiting(true);
        setTimeout(() => deleteTask(task.id), 300);
    };

    const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

    if (userState === 'experienced') {
        return (
            <div id={`task-${task.id}`} className={`task-item experienced ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isExiting ? 'slide-out' : ''}`}>
                <div className="task-left">
                    <input
                        type="checkbox"
                        className="compact-checkbox"
                        checked={task.completed}
                        onChange={handleComplete}
                    />
                    <span className="task-text">{task.text}</span>
                    {task.dueDate && <span className="task-date-compact">{new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                <div className="task-actions">
                    <button onClick={handleDelete} className="icon-btn">×</button>
                </div>
            </div>
        );
    }

    return (
        <div id={`task-${task.id}`} className={`task-item beginner ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isExiting ? 'slide-out' : ''}`}>
            <div className="task-content">
                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleComplete}
                    />
                </div>
                <div className="task-details">
                    <span className="task-text">{task.text}</span>
                    {task.dueDate && <span className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    {isOverdue && <span className="overdue-badge">Overdue</span>}
                </div>
            </div>
            <button onClick={handleDelete} className="delete-btn-text">Delete</button>
        </div>
    );
};

export default TaskItem;
