import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persistent state could be added here (localStorage), but for now we use memory state
  const [userState, setUserState] = useState('beginner'); // 'beginner' | 'experienced'
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, overdue: 0 });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [behavioralIntervention, setBehavioralIntervention] = useState(null); // null | 'missed_deadlines'

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adaptive-todo-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState(parsed.userState);
      setTasks(parsed.tasks);
      setStats(parsed.stats);
      setShowOnboarding(parsed.showOnboarding);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('adaptive-todo-state', JSON.stringify({
      userState,
      tasks,
      stats,
      showOnboarding
    }));
  }, [userState, tasks, stats, showOnboarding]);

  const addTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      dueDate: dueDate || null, // null means no specific date
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const completeTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    setStats(prev => {
      const newStats = { ...prev, completed: prev.completed + 1 };
      
      // Adaptive Logic: Transition to Experienced
      if (userState === 'beginner' && newStats.completed >= 5) {
        setUserState('experienced');
        // We'll handle the toast in the UI layer or via a side effect here
        // For simplicity, we just change state.
      }
      return newStats;
    });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const checkOverdue = () => {
    const now = new Date();
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;
    
    if (overdueCount >= 3) {
      setBehavioralIntervention('missed_deadlines');
    } else {
      setBehavioralIntervention(null);
    }
    setStats(prev => ({ ...prev, overdue: overdueCount }));
  };

  // Run checkOverdue periodically or on task updates
  useEffect(() => {
    checkOverdue();
  }, [tasks]);

  // Debug/Simulation Tools
  const simulateState = (type) => {
    switch (type) {
      case 'EXPERIENCED':
        setUserState('experienced');
        setStats(prev => ({ ...prev, completed: 5 }));
        break;
      case 'MISSED_DEADLINES':
        // Add dummy overdue tasks
        const now = new Date();
        const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
        const newTasks = [1, 2, 3].map(i => ({
            id: Date.now() + i,
            text: `Overdue Task ${i}`,
            dueDate: yesterday,
            completed: false,
            createdAt: new Date().toISOString()
        }));
        setTasks(prev => [...newTasks, ...prev]);
        break;
      case 'RESET':
        setUserState('beginner');
        setTasks([]);
        setStats({ completed: 0, overdue: 0 });
        setShowOnboarding(true);
        setBehavioralIntervention(null);
        break;
      default:
        break;
    }
  };

  const toggleMode = () => {
    setUserState(prev => prev === 'beginner' ? 'experienced' : 'beginner');
  };

  const closeOnboarding = () => setShowOnboarding(false);

  return (
    <AppContext.Provider value={{
      userState,
      tasks,
      stats,
      showOnboarding,
      behavioralIntervention,
      addTask,
      completeTask,
      deleteTask,
      simulateState,
      toggleMode,
      closeOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
