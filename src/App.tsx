import React from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { TaskList } from './components/TaskList';
import { AddTask } from './components/AddTask';
import { InterventionModal } from './components/InterventionModal';
import { DebugPanel } from './components/DebugPanel';
import { useStore } from './store/useStore';
import { useUserState } from './hooks/useUserState';

function App() {
    const hasSeenOnboarding = useStore(state => state.userProfile.hasSeenOnboarding);
    const userState = useUserState();
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
        <Layout>
            {/* Header Area */}
            <div className="pt-12 px-6 pb-4">
                <h1 className={`text-3xl font-bold ${userState === 'experienced' ? 'text-white' : 'text-gray-900'}`}>
                    FocusFlow
                </h1>
                <p className={`text-sm ${userState === 'experienced' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userState === 'beginner' && "Let's get things done."}
                    {userState === 'experienced' && "Productivity Mode"}
                    {userState === 'needsHelp' && "Let's reset."}
                </p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col h-[calc(100vh-120px)]">
                {/* In Experienced mode, AddTask is at the top */}
                {userState === 'experienced' && <AddTask />}

                <TaskList />

                {/* In Beginner mode, AddTask is a FAB (rendered inside component) */}
                {userState === 'beginner' && <AddTask />}
            </div>

            {/* Overlays */}
            {userState === 'beginner' && !hasSeenOnboarding && <Onboarding />}
            <InterventionModal />

            {/* Transition Toast */}
            {showToast && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
                    🎉 You're now in Experienced Mode!
                </div>
            )}
            <DebugPanel />
        </Layout>
    );
}

export default App;
