import PlayerStore, { PlayerState } from "foxrave/shared/store/playerStore";
import ChatHistory from "foxrave/shared/store/chatStore";
import ChatStore from "foxrave/shared/store/chatStore";

import { RoomDataEvent } from "foxrave/shared/types/models/events/RoomDataEvent";

enum UserRole {
    NONE,
    VISITOR,
    OWNER
}

export enum UserState {
    AVATAR,
    MOOD
}

class SocketHelper {
    roomId: string | undefined;
    userRole: UserRole = UserRole.NONE;
    playerStore: PlayerStore | undefined;

    send(socket: WebSocket, event: string, data: any = {}, isResponse: boolean = false) {
        if (socket.readyState != WebSocket.OPEN) {
            console.log("WebSocket | Invalid state on `send`. State: " + socket.readyState)
            return;
        }

        socket.send(JSON.stringify({ event, data, isResponse }))
    }

    handle(socket: WebSocket, message: any) {
        const { event, data, isResponse } = message;

        console.log(`WebSocket | Got new ${event} event.`);

        switch (event) {
            case "room:data.get":
                if (isResponse) {
                    console.log("WebSocket | Connected.")

                    const eventData = data as RoomDataEvent;

                    this.userRole = eventData.role.valueOf()

                    const player = PlayerStore.getInstance().player.current
                    if (player === null) {
                        return;
                    }

                    player.currentTime = data.seek

                    if (eventData.playback) {
                        console.log("Player | Play attempt")

                        player.play().then(() => {
                            player.currentTime = data.seek
                        })
                    } else {
                        player.pause().then(() => {
                            player.currentTime = data.seek
                        })
                    }

                    console.log(`Room Data | Paused: ${ !data.playback }, Seek: ${ data.seek }}`)
                }
                break;
            case "room:chat.get":
                if (isResponse) {
                    console.log("WebSocket | Get Chat.")

                    ChatHistory.getInstance().set(data.messages)
                }
                break;
            case "room:chat.push":
                console.log("WebSocket | Chat push.")

                if (ChatStore.getInstance().isSet) {
                    ChatHistory.getInstance().push(data.message)
                } else {
                    // такое происходит когда пуш ивент приходит раньше get ивента
                    ChatHistory.getInstance().pushedHistory.set(data.message.id, data.message)

                    console.log("Chat | Stored pushed message, awaiting for room:chat.get event")
                }
                break;
            case "room:chat.typing":
                ChatHistory.getInstance().setTyping(data.message)
                break;
            case "room:user_update":
                console.log("WebSocket | User update.")
                break;
            case "room:player":
                console.log(`WebSocket | Player: ${JSON.stringify(data)}`)

                switch (data.state) {
                    case PlayerState.PLAY:
                        if (this.playerStore?.player.current === null) {
                            console.log("Socket | Player is null")
                            return
                        }

                        this.playerStore?.player.current.play()
                        break;
                    case PlayerState.PAUSE:
                        if (this.playerStore?.player.current === null) {
                            console.log("Socket | Player is null")
                            return
                        }

                        this.playerStore?.player.current.pause()
                        break;
                    case PlayerState.SEEK:
                        if (this.userRole !== UserRole.OWNER) {
                            this.playerStore?.setTime(data.value)

                            if (this.playerStore?.player.current === null) {
                                console.log("Socket | Player is null")
                                return
                            }

                            this.playerStore?.setPlayerTime(data.value)
                        }
                        break;
                    case PlayerState.TIME:
                        if (this.userRole !== UserRole.OWNER) {
                            this.playerStore?.setTime(data.value)
                        }
                        break;
                }
                break;
        }
    }

    join(socket: WebSocket) {
        this.send(socket, "room:data.get")
        this.send(socket, "room:chat.get", { count: 35 })
    }

    updatePlayer(socket: WebSocket, state: number, value: number = 0) {
        this.send(socket, "room:player", {
            state,
            value
        })
    }

    updateUser(socket: WebSocket, state: UserState, to: string) {
        this.send(socket, "room:user.update", {
            state,
            to
        })
    }
}

export default new SocketHelper();