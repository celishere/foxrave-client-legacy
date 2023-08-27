import { API_URL } from "foxrave/http";

import { useRoomContext } from "foxrave/store/roomStore";

import styles from "foxrave/shared/assets/css/Room.module.css";
import Chat from "foxrave/shared/ui/Room/helpers/Chat";

import { Hls, Player, DefaultUi, DefaultSettings } from "@vime/react";

import '@vime/core/themes/default.css';
import 'foxrave/shared/assets/css/player.css';

interface RoomProps {
    roomId: number;
}

const Room = ({ roomId }: RoomProps) => {
    const roomStore = useRoomContext();

    return (
        <>
            <div className={ styles.container } />

            <div className={ styles.playerContainer }>
                <Player>
                    <Hls>
                        <source data-src={`${API_URL}/storage/video/1/getSegments`} type="application/x-mpegURL" />
                    </Hls>

                    <DefaultUi noSettings>
                        <DefaultSettings pin="bottomRight" />
                    </DefaultUi>
                </Player>
            </div>

            <Chat/>
        </>
    )
}

export default Room;