import Head from "next/head";
import { useRouter } from "next/router";

import Room from 'foxrave/shared/ui/Room';

import { RoomContextProvider } from "foxrave/store/roomStore";
import { PlayerContextProvider } from "foxrave/store/playerStore";

import ChatStore, { ChatContextProvider } from "foxrave/store/chatStore";

function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    ChatStore.instance = new ChatStore()

    if (typeof id != "string") {
        return;
    }

    return (
        <>
            <Head>
                <title>
                    BugRave Alpha | Room { id }
                </title>
            </Head>

            <RoomContextProvider>
                <ChatContextProvider>
                    <PlayerContextProvider>
                        <Room roomId={ id } />
                    </PlayerContextProvider>
                </ChatContextProvider>
            </RoomContextProvider>
        </>
    )
}

export default RoomPage;