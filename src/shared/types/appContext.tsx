import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AppContextProps {
    isDesktop: boolean;
    screenWidth: number;
}

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = (): AppContextProps => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('[UI] useAppContext must be used within an AppContextProvider');
    }

    return context;
};

export const FoxRaveProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleWindowSizeChange = () => {
                const width = window.innerWidth;

                setIsDesktop(width > 920);
                setScreenWidth(width);
            };

            handleWindowSizeChange(); // Установка начальных значений

            window.addEventListener('resize', handleWindowSizeChange);

            return () => {
                window.removeEventListener('resize', handleWindowSizeChange);
            };
        }
    }, []);

    const appContextValue: AppContextProps = {
        isDesktop,
        screenWidth,
    };

    return (
        <AppContext.Provider value={ appContextValue }>
            { children }
        </AppContext.Provider>
    );
};