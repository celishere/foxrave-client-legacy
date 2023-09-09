import {Button, Card, Grid, Input, Spacer, Text} from "@nextui-org/react";
import {useContext, useEffect, useRef, useState} from "react";
import socketHelper from "foxrave/shared/types/socketHelper";
import {useRouter} from "next/router";
import {Context} from "foxrave/pages/_app";
import {getCookie} from "cookies-next";
const IndexCard = () => {
    const { store } = useContext(Context);

    const [roomID, setRoomID] = useState<string>("");

    const socketRef = useRef<WebSocket | undefined>(undefined);
    const [rooms, setRooms] = useState([]);

    const [state, setState] = useState("disconnected");

    const router = useRouter();

    useEffect(() => {
        socketRef.current = new WebSocket(`${ process.env.WS_URL }/?${ getCookie("refreshToken") }`);
        socketRef.current.onopen = () => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current?.send(
                    JSON.stringify({
                        event: "main:rooms.fetch",
                    })
                );

                setState("fetching")
            }
        }

        socketRef.current.onmessage = (event) => {
            let message = JSON.parse(event.data);

            if (message.event === "main:rooms.fetch" && message.isResponse) {
                console.log("got rooms")
                setRooms(message.data.rooms);

                console.log(rooms.map((room) => {
                    console.log(room)
                }))

                setState("ready")
            }

            if (message.event === "main:room.create" && message.isResponse) {
                router.push("/rooms/" + message.data.id);
            }
        }
    }, []);

    const joinRoom = () => {
        if (socketRef.current != undefined) {
            socketHelper.send(socketRef.current, "room.joinMenu", {
                id: roomID
            })
        }
    };

    const createRoom = () => {
        console.log('press')
        console.log(socketRef.current)
        if (socketRef.current != undefined) {
            socketHelper.send(socketRef.current, "main:room.create", {
                video: "1",
                type: "storage",
                ownerId: store.user.id
            })
        }
    };

    return (
        <Card css={{
            maxWidth: 365,
            margin: "0 auto"
        }}>
            <Card.Header>
                <Grid.Container justify="center">
                    <Text size={20} weight={"bold"}>
                        state: {state}
                    </Text>
                </Grid.Container>
            </Card.Header>

            <Card.Body css={{
                margin: "0 auto",
                textAlign: "center",
                maxWidth: 320
            }}>
                <Spacer y={0.35} />

                <Text>
                    Debug Page
                </Text>

                <Spacer y={2} />

                <Grid.Container>
                {
                    rooms.length === 0 ?
                        <Grid>
                            <Text>No rooms and no bitches</Text>
                        </Grid>
                        :
                        rooms.map((room) => (
                            <Grid>
                                <Button onPress={() => {
                                    router.push(`/rooms/${room['id']}`)
                                }}>
                                    { room['id'] }
                                </Button>
                            </Grid>
                        ))
                }
            </Grid.Container>

                <Spacer y={1.5} />

                <Input
                    bordered
                    aria-label="Введи ID комнаты"
                    placeholder="Введи ID комнаты"
                    status="secondary"
                    value={roomID}
                    onChange={(e: any) => setRoomID(e.target.value)}
                />

                <Spacer y={1} />

               <Grid.Container justify="center">
                   <Button.Group color="secondary" bordered>
                       <Button onPress={joinRoom}>
                           Присоединиться
                       </Button>
                       <Button onPress={createRoom}>
                           Создать комнату
                       </Button>
                   </Button.Group>
               </Grid.Container>
            </Card.Body>
        </Card>
    )
}

export default IndexCard;