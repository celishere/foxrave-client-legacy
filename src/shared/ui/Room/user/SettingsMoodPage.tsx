import {useContext, useEffect, useState} from "react";

import toast, {Toaster} from "react-hot-toast";

import {Button, Grid, Spacer} from "@nextui-org/react";

import {Mood} from "foxrave/models/response/AuthResponse";

import StorageService from "foxrave/services/StorageService";

import styles from "foxrave/shared/assets/css/Setup.module.css";
import AuthService from "foxrave/services/AuthService";

import RoomStore from "foxrave/store/roomStore";
import SocketHelper, {UserState} from "foxrave/shared/types/socketHelper";
import {Context} from "foxrave/pages/_app";

interface SettingsPageProps {
    onQuit: () => void;
}

export default function SettingsMoodPage({ onQuit }: SettingsPageProps) {
    const { store } = useContext(Context);

    const [emojis, setEmojis] = useState<Mood[]>([]);
    const [mood, setMood] = useState<number>(0);

    useEffect(() => {
        StorageService.getMoods().then(result => {
            setEmojis(result.data.moods);
        });
    }, []);

    const handleMoodSet = () => {
        AuthService.setMood(mood).then((response) => {
            store.setUser(response.data.user)
            toast.success("Готово!");

            SocketHelper.updateUser(RoomStore.getInstance().socket, UserState.MOOD, mood.toString())
        })
    }

    return (
        <>
            <Toaster/>
            <Grid.Container gap={1} justify="center">
                { emojis.map((data, index) =>
                    (
                        <Grid onClick={ () => setMood(data.id) } key={ data.id }>
                            <div className={`${styles.emoticonSettingsButton} ${mood === data.id ? styles.emoticonSettingsSelectedButton : ''}`}>
                                <img
                                    src={ data.url }
                                    alt="Emoticon"
                                    className={ styles.emoticonSettingsGrid }
                                />
                            </div>
                        </Grid>
                    ))
                }
            </Grid.Container>

            <Spacer y={2}/>
            {
                mood != 0 && <Button onPress={ handleMoodSet }>Готово</Button>
            }

            <Spacer y={0.2}/>

            <div className={ styles.buttonQuit }>
                <Button onPress={ () => onQuit() } color="secondary" size="lg" rounded flat>
                    Выйти
                </Button>
            </div>
        </>
    )
}