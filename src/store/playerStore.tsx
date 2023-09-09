import React, { createContext, ReactNode, useContext, useRef } from 'react';

import { MediaPauseEvent, MediaPlayerElement, MediaPlayEvent, MediaSeekingEvent, MediaTimeUpdateEvent } from "vidstack";

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
    const playerStore = new PlayerStore();

    return (
        <PlayerContext.Provider value={playerStore}>
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

    player = useRef<MediaPlayerElement>(null)

    constructor() {
        SocketHelper.playerStore = this
    }


    play(event: MediaPlayEvent, socket: WebSocket): void {
        if (this.isPaused && SocketHelper.userRole !== UserRole.OWNER) {
            event.target.pause()

            console.log("Player | Rejected resume")
            return
        }

        if (SocketHelper.userRole === UserRole.OWNER) {
            SocketHelper.updatePlayer(socket, PlayerState.SEEK, event.target.currentTime)

            this.lastTime = event.target.currentTime
        }

        console.log("Player | Resumed")

        SocketHelper.updatePlayer(socket, PlayerState.PLAY)
    }

    pause(event: MediaPauseEvent, socket: WebSocket): void {
        console.log("Player | Paused")

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
}