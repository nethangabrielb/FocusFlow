import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persistent state could be added here (localStorage), but for now we use memory state
  const [userState, setUserState] = useState('beginner'); // 'beginner' | 'experienced'
  const [behaviorState, setBehaviorState] = useState('neutral'); // 'neutral' | 'focused' | 'distracted'
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ completed: 0, overdue: 0 });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [recentCompletions, setRecentCompletions] = useState([]); // Timestamps of recent completions

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adaptive-todo-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState(parsed.userState || 'beginner');
      setBehaviorState(parsed.behaviorState || 'neutral');
      setTasks(parsed.tasks || []);
      setStats(parsed.stats || { completed: 0, overdue: 0 });
      setShowOnboarding(parsed.showOnboarding ?? true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('adaptive-todo-state', JSON.stringify({
      userState,
      behaviorState,
      tasks,
      stats,
      showOnboarding
    }));
  }, [userState, behaviorState, tasks, stats, showOnboarding]);

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
    const now = Date.now();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));

    // Update stats and check for "Focused" state
    setStats(prev => {
      const newStats = { ...prev, completed: prev.completed + 1 };

      // Adaptive Logic: Transition to Experienced
      if (userState === 'beginner' && newStats.completed >= 5) {
        setUserState('experienced');
      }
      return newStats;
    });

    // Track recent completions for "Focused" state
    setRecentCompletions(prev => {
      const updated = [...prev, now].filter(t => now - t < 60000); // Keep completions within last minute
      if (updated.length >= 3) {
        setBehaviorState('focused');
      }
      return updated;
    });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const checkOverdue = () => {
    const now = new Date();
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;

    if (overdueCount >= 3) {
      setBehaviorState('distracted');
    } else if (behaviorState === 'distracted' && overdueCount < 3) {
      setBehaviorState('neutral');
    }

    setStats(prev => ({ ...prev, overdue: overdueCount }));
  };

  // Run checkOverdue periodically or on task updates
  useEffect(() => {
    checkOverdue();
  }, [tasks]);

  // Auto-reset focused state after inactivity
  useEffect(() => {
    if (behaviorState === 'focused') {
      const timer = setTimeout(() => {
        setBehaviorState('neutral');
      }, 30000); // Reset after 30s of no activity
      return () => clearTimeout(timer);
    }
  }, [behaviorState, recentCompletions]);

  // Debug/Simulation Tools
  const simulateState = (type) => {
    switch (type) {
      case 'EXPERIENCED':
        setUserState('experienced');
        setStats(prev => ({ ...prev, completed: 5 }));
        break;
      case 'FOCUSED':
        setBehaviorState('focused');
        break;
      case 'DISTRACTED':
        setBehaviorState('distracted');
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
        setBehaviorState('neutral');
        setTasks([]);
        setStats({ completed: 0, overdue: 0 });
        setShowOnboarding(true);
        setRecentCompletions([]);
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
      behaviorState,
      tasks,
      stats,
      showOnboarding,
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
