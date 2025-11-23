import React from 'react';
import { useUserState } from '../hooks/useUserState';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const userState = useUserState();

    return (
        <div className={clsx(
            "min-h-screen w-full flex justify-center bg-gray-100",
            userState === 'beginner' && "bg-white",
            userState === 'experienced' && "bg-gray-900 text-white",
            userState === 'needsHelp' && "bg-orange-50"
        )}>
            <div className={clsx(
                "w-full max-w-md h-screen overflow-hidden relative shadow-2xl",
                userState === 'beginner' && "bg-white",
                userState === 'experienced' && "bg-gray-800",
                userState === 'needsHelp' && "bg-white"
            )}>
                {children}
            </div>
        </div>
    );
};
