import { useEffect } from "react";

import PlayerStore, { usePlayerContext } from "foxrave/shared/store/playerStore";
import { useRoomContext } from "foxrave/shared/store/roomStore";

import { Chat } from "foxrave/shared/ui/Room/helpers/Chat";
import { AmbientLightCanvas } from "foxrave/shared/ui/Room/ambient/AmbientLightCanvas";

import SettingsModal from "foxrave/shared/ui/Room/user/SettingsModal";

import { MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

import styles from "foxrave/shared/assets/css/Room.module.css";

import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';

interface RoomProps {
    roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
    const roomStore = useRoomContext();
    const playerStore = usePlayerContext();

    PlayerStore.getInstance()

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
            <div className={ styles.container }/>

            <div className={ styles.ambilightWrapper }>
                <MediaPlayer
                    ref={ playerStore.player }
                    src={`${ process.env.API_URL }/storage/video/1/getPlaylist`}
                    poster={`${ process.env.API_URL }/storage/video/1/getPreview`}
                    className={ styles.playerWrapper }
                    aspectRatio={16 / 9}
                    crossorigin=""
                    onProviderSetup={ (event) => playerStore.providerSetup(event) }
                    onPlay={ (event) => playerStore.play(event, roomStore.socket) }
                    onPause={ (event) => playerStore.pause(event, roomStore.socket) }
                    onEnded={ (event) => playerStore.ended(event) }
                    onSeeking={ (event) => playerStore.seeking(event, roomStore.socket) }
                    onSeeked={ (event) => playerStore.seeked(event) }
                    onTimeUpdate={ (event) => playerStore.timeUpdate(event, roomStore.socket) }
                >
                    <MediaOutlet>
                        <MediaPoster
                            alt="Poster"
                        />

                        <track
                            src={`${process.env.API_URL}/storage/video/1/getSubtitle`}
                            kind="subtitles"
                            label="English"
                            srcLang="en-US"
                            default
                            datatype="vtt"
                        />
                    </MediaOutlet>
                    <MediaCommunitySkin/>
                </MediaPlayer>

                <div className={styles.ambilightContainer}>
                    <AmbientLightCanvas/>
                </div>
            </div>

            <Chat/>
            <SettingsModal/>
        </>
    )
}

export default Room;