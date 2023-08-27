import {useContext} from "react";
import {Context} from "foxrave/pages/_app";
import {useRouter} from "next/router";

import Room from 'foxrave/shared/ui/Room';
import {RoomContextProvider} from "foxrave/store/roomStore";
import Head from "next/head";

function RoomPage() {
    let { store } = useContext(Context);

    const router = useRouter();
    const { id } = router.query;

    const roomId = Number(id);

    return store.checkAccess(router, (
        <>
            <Head>
                <title>
                    BugRave Alpha | Room { roomId }
                </title>
            </Head>

            <RoomContextProvider>
                <Room roomId={ roomId } />
            </RoomContextProvider>
        </>
    ))
}

export default RoomPage;