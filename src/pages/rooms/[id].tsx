import {Suspense, useEffect, useState} from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import Room from 'foxrave/shared/ui/Room';

import { RoomContextProvider } from "foxrave/shared/store/roomStore";
import { PlayerContextProvider } from "foxrave/shared/store/playerStore";

import ChatStore, { ChatContextProvider } from "foxrave/shared/store/chatStore";

import Loading from "foxrave/shared/ui/Loading";

function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    ChatStore.instance = new ChatStore()

    if (typeof id != "string") {
        return;
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const delayLoading = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(delayLoading);
    }, []);

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
                        <Suspense fallback={ <Loading/> }>
                            { loading ? <Loading /> : <Room roomId={id} /> }
                        </Suspense>
                    </PlayerContextProvider>
                </ChatContextProvider>
            </RoomContextProvider>
        </>
    )
}

export default RoomPage;