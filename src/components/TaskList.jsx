import React from 'react';
import { useAppContext } from '../context/AppContext';
import TaskItem from './TaskItem';

const TaskList = () => {
    const { tasks, userState } = useAppContext();

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>{userState === 'beginner' ? "You have no tasks yet. Try adding one above!" : "No tasks. Clean slate."}</p>
            </div>
        );
    }

    return (
        <div className={`task-list ${userState}`}>
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};

export default TaskList;
