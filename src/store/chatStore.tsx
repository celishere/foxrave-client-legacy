import React, { createContext, useContext, ReactNode } from "react";
import { Context } from "foxrave/pages/_app";

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
    return (
        <ChatContext.Provider value={ChatStore.getInstance()}>
            {children}
        </ChatContext.Provider>
    );
};

export enum UserRole {
    NONE,
    VISITOR,
    OWNER,
    SERVER
}

export interface UserLocation {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface MessageProps {
    id: number;
    timestamp: number;
    text: string | undefined;
    attachments: Attachment[] | undefined;
    userId: string;
    userRole: UserRole;
    userLocation: UserLocation;
    username: string;
    avatar: string;
    mood: number;
    read: boolean;
    reply: MessageProps | undefined;
}

export enum AttachmentType {
    MEDIA,
    FILE,
    GIF
}

export class Attachment {
    type: AttachmentType | undefined;
    url: string | undefined;
}

export default class ChatStore {
    userId: string;

    pushedHistory = new Map<number, MessageProps>();
    isSet: boolean = false;
    isFetching: boolean = false;

    history = new Map<number, MessageProps>();
    typing: string = "";

    listeners: ((messages: MessageProps[]) => void)[] = [];
    setListeners: ((messages: MessageProps[]) => void)[] = [];
    sendListeners: (() => void)[] = [];
    typingListeners: ((typing: string) => void)[] = [];

    replyListeners: ((message: MessageProps) => void)[] = []

    static instance: ChatStore | undefined

    static getInstance(): ChatStore {
        if (this.instance === undefined) {
            this.instance = new ChatStore()
        }

        return this.instance
    }

    constructor() {
        const { store } = useContext(Context)

        this.userId = store.user.id
    }

    push(message: MessageProps, set: boolean = false): void {
        message.read = set

        this.history.set(message.id, message)

        if (!set) {
            this.notifyListeners()

            if (message.userId === this.userId) {
                this.notifySendListeners()
            }
        }
    }

    get(id: number): MessageProps | undefined {
        return this.history.get(id)
    }

    setById(message: MessageProps): void {
        this.history.set(message.id, message)
    }

    set(messages: MessageProps[]): void {
        this.history = new Map<number, MessageProps>()

        for (const key in Array.from(messages.keys())) {
            this.push(messages[key], true)
        }

        this.isSet = true

        const pushMessages = Array.from(this.pushedHistory.values());

        for (const pushMessage of pushMessages) {
            this.push(pushMessage)
        }

        this.pushedHistory.clear()

        this.notifySetListeners()
    }

    readAll(): void {
        for (const key of Array.from(this.history.keys())) {
            const message = this.history.get(key)

            if (message && !message.read) {
                message.read = true

                this.history.set(key, message)
            }
        }

        this.notifySetListeners()
    }

    setTyping(typing: string): void {
        this.typing = typing

        this.notifyTypingListeners()
    }

    addListener(listener: (messages: MessageProps[]) => void): void {
        this.listeners.push(listener);
    }

    removeListener(listener: (messages: MessageProps[]) => void): void {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    addSetListener(listener: (messages: MessageProps[]) => void): void {
        this.setListeners.push(listener);
    }

    removeSetListener(listener: (messages: MessageProps[]) => void): void {
        const index = this.setListeners.indexOf(listener);

        if (index !== -1) {
            this.setListeners.splice(index, 1);
        }
    }

    addSendListener(listener: () => void): void {
        this.sendListeners.push(listener);
    }

    removeSendListener(listener: () => void): void {
        const index = this.sendListeners.indexOf(listener);

        if (index !== -1) {
            this.sendListeners.splice(index, 1);
        }
    }

    addTypingListener(listener: (typing: string) => void): void {
        this.typingListeners.push(listener);
    }

    removeTypingListener(listener: (typing: string) => void): void {
        const index = this.typingListeners.indexOf(listener);

        if (index !== -1) {
            this.typingListeners.splice(index, 1);
        }
    }

    addReplyListener(listener: (message: MessageProps) => void): void {
        this.replyListeners.push(listener);
    }

    removeReplyListener(listener: (message: MessageProps) => void): void {
        const index = this.replyListeners.indexOf(listener);

        if (index !== -1) {
            this.replyListeners.splice(index, 1);
        }
    }

    private notifyListeners(): void {
        const messages = Array.from(this.history.values());

        this.listeners.forEach((listener) => {
            listener(messages);
        });
    }

    private notifySetListeners(): void {
        const messages = Array.from(this.history.values());

        this.setListeners.forEach((listener) => {
            listener(messages);
        });
    }

    private notifyTypingListeners(): void {
        this.typingListeners.forEach((listener) => {
            listener(this.typing);
        });
    }

    private notifySendListeners(): void {
        this.sendListeners.forEach((listener) => {
            listener();
        });
    }

    public notifyReplyListeners(message: MessageProps): void {
        this.replyListeners.forEach((listener) => {
            listener(message);
        });
    }
}