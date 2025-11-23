import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { AddTask } from './components/AddTask';
import { InterventionModal } from './components/InterventionModal';
import { DebugPanel } from './components/DebugPanel';
import { useStore } from './store/useStore';
import { useUserState } from './hooks/useUserState';
import { Onboarding } from './components/Onboarding';

function App() {
    const hasSeenOnboarding = useStore(state => state.userProfile.hasSeenOnboarding);
    const userState = useUserState();
    const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'settings'>('dashboard');
    const [showToast, setShowToast] = React.useState(false);
    const prevUserState = React.useRef(userState);

    React.useEffect(() => {
        if (prevUserState.current === 'beginner' && userState === 'experienced') {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
        prevUserState.current = userState;
    }, [userState]);

    return (
        <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
            {/* Main Content Area */}
            {currentView === 'dashboard' && <Dashboard />}

            {currentView === 'tasks' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${userState === 'experienced' ? 'text-white' : 'text-gray-900'}`}>
                            My Tasks
                        </h2>
                        {/* Add Task Button for Experienced Mode could go here or be inline */}
                    </div>

                    {/* In Experienced mode, AddTask is at the top */}
                    {userState === 'experienced' && <AddTask />}

                    <TaskList />

                    {/* In Beginner mode, AddTask is a FAB (rendered inside component) */}
                    {userState === 'beginner' && <AddTask />}
                </div>
            )}

            {/* Overlays */}
            {userState === 'beginner' && !hasSeenOnboarding && <Onboarding />}
            <InterventionModal />

            {/* Transition Toast */}
            {showToast && (
                <div className="fixed top-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <div>
                        <p className="font-bold">Level Up!</p>
                        <p className="text-sm text-gray-400">You're now in Experienced Mode.</p>
                    </div>
                </div>
            )}

            <DebugPanel />
        </DashboardLayout>
    );
}

export default App;
