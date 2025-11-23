import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isBefore, subDays, parseISO } from 'date-fns';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    dueDate: string | null; // ISO string
    completedAt: string | null; // ISO string
    category: string;
    priority: Priority;
}

interface UserProfile {
    totalCompletedTasks: number;
    hasSeenOnboarding: boolean;
    lastInterventionDate: string | null; // To prevent spamming the modal
}

interface StoreState {
    tasks: Task[];
    userProfile: UserProfile;

    // Actions
    addTask: (task: Omit<Task, 'id' | 'completedAt'>) => void;
    completeTask: (id: string) => void;
    deleteTask: (id: string) => void;
    completeOnboarding: () => void;
    dismissIntervention: () => void;

    // Debug Actions
    debugSetState: (payload: { tasks?: Task[], userProfile?: Partial<UserProfile> }) => void;
    rescheduleOverdueTasks: () => void;
    clearOverdueTasks: () => void;

    // Selectors/Helpers
    getUserState: () => 'beginner' | 'experienced' | 'needsHelp';
    getOverdueTasksCount: () => number;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            tasks: [],
            userProfile: {
                totalCompletedTasks: 0,
                hasSeenOnboarding: false,
                lastInterventionDate: null,
            },

            addTask: (task) => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        ...task,
                        id: crypto.randomUUID(),
                        completedAt: null,
                    }
                ]
            })),

            completeTask: (id) => set((state) => {
                const taskIndex = state.tasks.findIndex(t => t.id === id);
                if (taskIndex === -1) return state;

                const task = state.tasks[taskIndex];
                const isCompleting = !task.completedAt;

                const newTasks = [...state.tasks];
                newTasks[taskIndex] = {
                    ...task,
                    completedAt: isCompleting ? new Date().toISOString() : null
                };

                return {
                    tasks: newTasks,
                    userProfile: {
                        ...state.userProfile,
                        totalCompletedTasks: isCompleting
                            ? state.userProfile.totalCompletedTasks + 1
                            : Math.max(0, state.userProfile.totalCompletedTasks - 1)
                    }
                };
            }),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            completeOnboarding: () => set((state) => ({
                userProfile: { ...state.userProfile, hasSeenOnboarding: true }
            })),

            dismissIntervention: () => set((state) => ({
                userProfile: { ...state.userProfile, lastInterventionDate: new Date().toISOString() }
            })),

            debugSetState: (payload) => set((state) => ({
                tasks: payload.tasks ?? state.tasks,
                userProfile: { ...state.userProfile, ...payload.userProfile }
            })),

            rescheduleOverdueTasks: () => set((state) => {
                const now = new Date();
                const sevenDaysAgo = subDays(now, 7);

                const newTasks = state.tasks.map(t => {
                    if (!t.dueDate || t.completedAt) return t;
                    const due = parseISO(t.dueDate);
                    // Identify overdue tasks (same logic as getOverdueTasksCount)
                    if (isBefore(due, now) && isBefore(sevenDaysAgo, due)) {
                        return { ...t, dueDate: now.toISOString() };
                    }
                    return t;
                });

                return {
                    tasks: newTasks,
                    userProfile: { ...state.userProfile, lastInterventionDate: now.toISOString() }
                };
            }),

            clearOverdueTasks: () => set((state) => {
                const now = new Date();
                const sevenDaysAgo = subDays(now, 7);

                const newTasks = state.tasks.filter(t => {
                    if (!t.dueDate || t.completedAt) return true;
                    const due = parseISO(t.dueDate);
                    // Keep task if it is NOT overdue
                    return !(isBefore(due, now) && isBefore(sevenDaysAgo, due));
                });

                return {
                    tasks: newTasks,
                    userProfile: { ...state.userProfile, lastInterventionDate: now.toISOString() }
                };
            }),

            getOverdueTasksCount: () => {
                const { tasks } = get();
                const now = new Date();
                const sevenDaysAgo = subDays(now, 7);

                return tasks.filter(t => {
                    if (!t.dueDate || t.completedAt) return false;
                    const due = parseISO(t.dueDate);
                    // Check if due date is in the past (before today start of day to be strict, or just now)
                    // Requirement: "overdue tasks in last 7 days"
                    // Let's count tasks that were due between 7 days ago and now, and are not completed.
                    return isBefore(due, now) && isBefore(sevenDaysAgo, due);
                }).length;
            },

            getUserState: () => {
                const { userProfile, tasks } = get();
                const now = new Date();
                const sevenDaysAgo = subDays(now, 7);

                // Check for Behavior-Based Mode first
                // "Frequently misses deadlines" → ≥ 3 overdue tasks in the last 7 days
                // Note: The requirement says "overdue tasks in the last 7 days". 
                // This could mean tasks that BECAME overdue in the last 7 days.
                const overdueCount = tasks.filter(t => {
                    if (!t.dueDate || t.completedAt) return false;
                    const due = parseISO(t.dueDate);
                    return isBefore(due, now) && !isBefore(due, sevenDaysAgo);
                }).length;

                if (overdueCount >= 3) {
                    return 'needsHelp';
                }

                // Check for Experienced Mode
                if (userProfile.totalCompletedTasks >= 5) {
                    return 'experienced';
                }

                // Default to Beginner Mode
                return 'beginner';
            }
        }),
        {
            name: 'focusflow-storage',
        }
    )
);
