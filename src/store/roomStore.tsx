import React, { createContext, ReactNode, useContext } from 'react';

const RoomContext = createContext<RoomStore | undefined>(undefined);

interface AppContextProviderProps {
    children: ReactNode;
}

export const useRoomContext = () => {
    const context = useContext(RoomContext);

    if (!context) {
        throw new Error('useRoomContext must be used within a RoomContextProvider');
    }

    return context;
};

export const RoomContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const roomStore = new RoomStore();

    return (
        <RoomContext.Provider value={roomStore}>
            {children}
        </RoomContext.Provider>
    );
};


export default class RoomStore {
    socket = {} as WebSocket;

    connect(id: number) {
        this.socket = new WebSocket("");
    }
}