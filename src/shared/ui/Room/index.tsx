import { useEffect } from "react";

import { usePlayerContext } from "foxrave/store/playerStore";
import { useRoomContext } from "foxrave/store/roomStore";

import styles from "foxrave/shared/assets/css/Room.module.css";

import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';

import { MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

import 'foxrave/shared/assets/css/player.css';

import { Chat } from "foxrave/shared/ui/Room/helpers/Chat";

interface RoomProps {
    roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
    const roomStore = useRoomContext();
    const playerStore = usePlayerContext();

    useEffect(() => {
        roomStore.connect(roomId);

        return () => {
            if (roomStore.socket) {
                roomStore.socket.close();
            }
        }
    }, [])

    return (
        <>
            <div className={ styles.container } />

            <div className={ styles.playerContainer }>
                <MediaPlayer
                    src="http://localhost:4242/api/v1/storage/video/3/getPlaylist"
                    poster="http://localhost:4242/api/v1/storage/video/3/getPreview"
                    aspectRatio={ 16 / 9 }
                    crossorigin=""
                    onPlay={ (event) => playerStore.play(event, roomStore.socket) }
                    onPause={ (event) => playerStore.pause(event, roomStore.socket) }
                    onSeeking={ (event) => playerStore.seeking(event, roomStore.socket) }
                    onTimeUpdate={ (event) => playerStore.timeUpdate(event, roomStore.socket)}
                    ref={ playerStore.player }
                >
                    <MediaOutlet>
                        <MediaPoster
                            alt="Sexy craig"
                        />
                    </MediaOutlet>
                    <MediaCommunitySkin />
                </MediaPlayer>
            </div>

            <Chat/>
        </>
    )
}

export default Room;