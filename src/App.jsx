import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import OnboardingModal from './components/OnboardingModal';
import MotivationalWidget from './components/MotivationalWidget';
import DebugPanel from './components/DebugPanel';
import './styles/index.css';
import './styles/App.css';
import './styles/Themes.css';

const MainLayout = () => {
  const { userState, behaviorState, toggleMode, stats } = useAppContext();

  return (
    <div className={`app-container ${userState}-theme ${behaviorState}-mode`}>
      <header className="app-header">
        <h1>Adaptive To-Do</h1>
        <div className="header-controls">
          <span className="stats-badge">Completed: {stats.completed}</span>
          <div className="mode-toggle">
            <span>Beginner</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={userState === 'experienced'}
                onChange={toggleMode}
              />
              <span className="slider round"></span>
            </label>
            <span>Expert</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <MotivationalWidget />
        <AddTask />
        <TaskList />
      </main>

      <OnboardingModal />
      <DebugPanel />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
