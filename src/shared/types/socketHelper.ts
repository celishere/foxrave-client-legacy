import PlayerStore, { PlayerState } from "foxrave/store/playerStore";
import ChatHistory from "foxrave/store/chatStore";
import ChatStore from "foxrave/store/chatStore";

enum UserRole {
    NONE,
    VISITOR,
    OWNER
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

                    this.userRole = data.role
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
            case "room:player":
                console.log(`WebSocket | Player: ${JSON.stringify(data)}`)

                switch (data.state) {
                    case PlayerState.PLAY:
                        if (this.playerStore?.player.current === null) {
                            console.log("Socket | Player is null")
                            return
                        }

                        this.playerStore?.player.current.play()

                        console.log(this.playerStore)
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
        this.send(socket, "room:chat.get", { count: 10 })
    }

    updatePlayer(socket: WebSocket, state: number, value: number = 0) {
        this.send(socket, "room:player", {
            state,
            value
        })
    }
}

export default new SocketHelper();