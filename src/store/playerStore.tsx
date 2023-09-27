import React, { createContext, useContext, useRef, ReactNode } from 'react';

import {
    isHLSProvider,
    MediaEndedEvent,
    MediaPauseEvent,
    MediaPlayerElement,
    MediaPlayEvent,
    MediaProviderSetupEvent, MediaSeekedEvent,
    MediaSeekingEvent,
    MediaTimeUpdateEvent
} from "vidstack";

import SocketHelper from "foxrave/shared/types/socketHelper";

const PlayerContext = createContext<PlayerStore | undefined>(undefined);

interface AppContextProviderProps {
    children: ReactNode;
}

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error('useRoomContext must be used within a RoomContextProvider');
    }

    return context;
};

export const PlayerContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    return (
        <PlayerContext.Provider value={ PlayerStore.getInstance() }>
            {children}
        </PlayerContext.Provider>
    );
};

export enum PlayerState {
    PLAY,
    PAUSE,
    SEEK,
    TIME
}

enum UserRole {
    NONE,
    VISITOR,
    OWNER
}

export default class PlayerStore {
    lastTime: number = 0
    isPaused: boolean = false

    listeners: ((video: HTMLVideoElement) => void)[] = [];

    onPlayListeners: ((video: MediaPlayerElement) => void)[] = [];
    onStopListeners: ((video: MediaPlayerElement) => void)[] = [];
    onSeekedListeners: ((video: MediaPlayerElement) => void)[] = [];

    player = useRef<MediaPlayerElement>(null)

    static instance: PlayerStore | undefined

    static getInstance(): PlayerStore {
        if (this.instance === undefined) {
            this.instance = new PlayerStore()
        }

        return this.instance
    }

    constructor() {
        SocketHelper.playerStore = this
    }

    providerSetup(event: MediaProviderSetupEvent): void {
        const provider = event.detail;

        if (isHLSProvider(provider)) {
            this.notifyListeners(provider.video)
        }
    }

    play(event: MediaPlayEvent, socket: WebSocket): void {
        if (this.isPaused && SocketHelper.userRole !== UserRole.OWNER) {
            event.target.pause()

            console.log("Player | Rejected resume")
            return
        }

        this.onPlayListeners.forEach((listener) => {
            listener(event.target);
        });

        if (SocketHelper.userRole === UserRole.OWNER) {
            SocketHelper.updatePlayer(socket, PlayerState.SEEK, event.target.currentTime)

            this.lastTime = event.target.currentTime
        }

        console.log("Player | Resumed")

        SocketHelper.updatePlayer(socket, PlayerState.PLAY)
    }

    pause(event: MediaPauseEvent, socket: WebSocket): void {
        console.log("Player | Paused")

        this.onStopListeners.forEach((listener) => {
            listener(event.target);
        });

        if (SocketHelper.userRole === UserRole.OWNER) {
            SocketHelper.updatePlayer(socket, PlayerState.SEEK, event.target.currentTime)

            this.lastTime = event.target.currentTime
        }

        SocketHelper.updatePlayer(socket, PlayerState.PAUSE)
    }

    seeking(event: MediaSeekingEvent, socket: WebSocket): void {
        const time = event.target.currentTime

        if (SocketHelper.userRole === UserRole.OWNER) {
            console.log(`Player | Seeking -> ${time}`)

            this.lastTime = event.target.currentTime

            SocketHelper.updatePlayer(socket, PlayerState.SEEK, time)
        } else {
            if (time - this.lastTime > 1) {
                event.target.currentTime = this.lastTime

                console.log("Player | Rejected seeking")
            }
        }

        this.onSeekedListeners.forEach((listener) => {
            listener(event.target);
        });
    }

    ended(event: MediaEndedEvent): void {
        this.onStopListeners.forEach((listener) => {
            listener(event.target);
        });
    }

    seeked(event: MediaSeekedEvent): void {
        this.onSeekedListeners.forEach((listener) => {
            listener(event.target);
        });
    }

    timeUpdate(event: MediaTimeUpdateEvent, socket: WebSocket): void {
        const time = event.target.currentTime

        if (SocketHelper.userRole === UserRole.OWNER) {
            if (time > this.lastTime + 0.5) {
                this.lastTime = time

                SocketHelper.updatePlayer(socket, PlayerState.TIME, time)

                console.log("Player | Host sync")
            }
        } else {
            if (time - this.lastTime > 1) {
                console.log(`Player | Synced with host ${time} -> ${this.lastTime}`)

                event.target.currentTime = this.lastTime
            }
        }
    }

    setTime(time: number) {
        this.lastTime = time
    }

    setPlayerTime(time: number) {
        if (this.player.current) {
            this.player.current.currentTime = time
        }
    }

    addListener(listener: (player: HTMLVideoElement) => void): void {
        this.listeners.push(listener);
    }

    removeListener(listener: (player: HTMLVideoElement) => void): void {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    addPlayListener(listener: (player: MediaPlayerElement) => void): void {
        this.onPlayListeners.push(listener);
    }

    removePlayListener(listener: (player: MediaPlayerElement) => void): void {
        const index = this.onPlayListeners.indexOf(listener);

        if (index !== -1) {
            this.onPlayListeners.splice(index, 1);
        }
    }

    addStopListener(listener: (player: MediaPlayerElement) => void): void {
        this.onStopListeners.push(listener);
    }

    removeStopListener(listener: (player: MediaPlayerElement) => void): void {
        const index = this.onStopListeners.indexOf(listener);

        if (index !== -1) {
            this.onStopListeners.splice(index, 1);
        }
    }

    addSeekedListener(listener: (player: MediaPlayerElement) => void): void {
        this.onStopListeners.push(listener);
    }

    removeSeekedListener(listener: (player: MediaPlayerElement) => void): void {
        const index = this.onSeekedListeners.indexOf(listener);

        if (index !== -1) {
            this.onSeekedListeners.splice(index, 1);
        }
    }

    private notifyListeners(player: HTMLVideoElement): void {
        console.log(this.listeners)
        console.log("[Player] Ambient light setup...", this.listeners.length)

        this.listeners.forEach((listener) => {
            listener(player);
        });
    }
}