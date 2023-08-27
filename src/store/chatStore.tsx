import React, { createContext, ReactNode, useContext } from 'react';

const ChatContext = createContext<ChatStore | undefined>(undefined);

interface AppContextProviderProps {
    children: ReactNode;
}

export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useRoomContext must be used within a RoomContextProvider');
    }

    return context;
};

export const ChatContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const chatStore = new ChatStore();

    return (
        <ChatContext.Provider value={chatStore}>
            {children}
        </ChatContext.Provider>
    );
};


export default class ChatStore {
    public test = "agag";
}