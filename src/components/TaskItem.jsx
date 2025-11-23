import React from 'react';
import { useAppContext } from '../context/AppContext';

const TaskItem = ({ task }) => {
    const { userState, completeTask, deleteTask } = useAppContext();

    const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

    if (userState === 'experienced') {
        return (
            <div className={`task-item experienced ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                <div className="task-left">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                        className="compact-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                    {task.dueDate && <span className="task-date-compact">{task.dueDate}</span>}
                </div>
                <div className="task-actions">
                    <button onClick={() => deleteTask(task.id)} className="icon-btn" title="Delete">🗑️</button>
                    <button className="icon-btn" title="Tag">🏷️</button>
                </div>
            </div>
        );
    }

    // Beginner Mode
    return (
        <div className={`task-item beginner ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-content">
                <div className="checkbox-wrapper" title="Click to mark as done">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                    />
                </div>
                <div className="task-details">
                    <span className="task-text">{task.text}</span>
                    {task.dueDate && <span className="task-date">Due: {task.dueDate}</span>}
                    {isOverdue && <span className="overdue-badge">Overdue!</span>}
                </div>
            </div>
            <button onClick={() => deleteTask(task.id)} className="delete-btn-text">
                Delete Task
            </button>
        </div>
    );
};

export default TaskItem;
