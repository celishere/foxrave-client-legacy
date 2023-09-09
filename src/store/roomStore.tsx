import React, { createContext, ReactNode, useContext } from 'react';
import socketHelper from "foxrave/shared/types/socketHelper";
import {getCookie} from "cookies-next";
import ChatHistory from "foxrave/store/chatStore";

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

enum UserRole {
    NONE,
    VISITOR,
    OWNER
}

export default class RoomStore {
    socket = {} as WebSocket;
    chatHistory: ChatHistory | null = null;

    static instance: RoomStore | undefined

    static getInstance(): RoomStore {
        if (this.instance === undefined) {
            this.instance = new RoomStore()
        }

        return this.instance
    }

    constructor() {
        this.chatHistory = new ChatHistory()

        RoomStore.instance = this
    }

    connect(id: string) {
        console.log(`WebSocket | Connecting... | ID: ${id}`);

        this.socket = new WebSocket(`ws://localhost:4040/room/${id}?${ getCookie('refreshToken') }`);
        this.socket.onopen = () => {
            console.log(`WebSocket | Created connection.`);

            socketHelper.roomId = id;
            socketHelper.join(this.socket)
        }

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            socketHelper.handle(this.socket, message);
        }

        this.socket.onclose = () => {
            console.log(`WebSocket | Closed connection.`);
        }
    }
}