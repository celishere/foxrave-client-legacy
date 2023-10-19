import { useEffect, useState } from "react";

import { Modal, Text } from "@nextui-org/react";

import RoomStore from "foxrave/shared/store/roomStore";

import SettingsButton from "foxrave/shared/ui/Room/user/SettingsButton";
import SettingsAvatarPage from "foxrave/shared/ui/Room/user/SettingsAvatarPage";
import SettingsMoodPage from "foxrave/shared/ui/Room/user/SettingsMoodPage";
import SettingsNicknamePage from "foxrave/shared/ui/Room/user/SettingsNicknamePage";

enum Pages {
    INDEX,
    AVATAR,
    MOOD,
    NICKNAME
}

export default function SettingsModal() {
    const [page, setPage] = useState<Pages>(Pages.INDEX)
    const [visible, setVisible] = useState<boolean>(false)

    const onClose = (): void => {
        setVisible(false)

        setTimeout(() => {
            setPage(Pages.INDEX)
        }, 100)

        console.log("[Settings] Closed")
    }

    const listener = (value: boolean): void => {
        console.log("[Settings] Listen: " + value)

        setVisible(value)
    }

    const onQuit = (): void => {
        setPage(Pages.INDEX)

        setTimeout(() => {
            setVisible(true)
        }, 100)
    }

    useEffect(() => {
        RoomStore.getInstance().addSettingsListener(listener)

        return () => {
            RoomStore.getInstance().removeSettingsListener(listener)
        }
    }, []);

    const renderPage = () => {
        switch (page) {
            case Pages.INDEX:
                return (
                    <>
                        <Modal.Header>
                            <Text weight="bold" size={25}>
                                Настройки
                            </Text>
                        </Modal.Header>

                        <Modal.Body style={{ transform: "translateY(5%)" }}>
                            <SettingsButton
                                title={ "Аватар" }
                                image={ `${ process.env.API_URL }/storage/avatar/preview_avatar` }
                                onClick={ () => { setPage(Pages.AVATAR) }}
                            />
                            <SettingsButton
                                title={ "Статус" }
                                image={ `${ process.env.API_URL }/storage/avatar/preview_mood` }
                                onClick={ () => { setPage(Pages.MOOD) }}
                            />
                            <SettingsButton
                                title={ "Никнейм" }
                                image={ `${ process.env.API_URL }/storage/avatar/preview_nickname` }
                                onClick={ () => { setPage(Pages.NICKNAME) }}
                            />
                        </Modal.Body>
                    </>
                )
            case Pages.AVATAR:
                return (
                    <>
                        <Modal.Header>
                            <Text weight="bold" size={25}>
                                Аватар
                            </Text>
                        </Modal.Header>

                        <Modal.Body style={{ transform: "translateY(0)" }}>
                            <SettingsAvatarPage onQuit={ onQuit }/>
                        </Modal.Body>
                    </>
                )
            case Pages.MOOD:
                return (
                    <>
                        <Modal.Header>
                            <Text weight="bold" size={25}>
                                Статус
                            </Text>
                        </Modal.Header>

                        <Modal.Body style={{ transform: "translateY(0)" }}>
                            <SettingsMoodPage onQuit={ onQuit }/>
                        </Modal.Body>
                    </>
                )
            case Pages.NICKNAME:
                return (
                    <>
                        <Modal.Header>
                            <Text weight="bold" size={25}>
                                Никнейм
                            </Text>
                        </Modal.Header>

                        <Modal.Body style={{ transform: "translateY(0)" }}>
                            <SettingsNicknamePage onQuit={ onQuit }/>
                        </Modal.Body>
                    </>
                )
        }
    }

    return (
        <Modal
            open={ visible }
            onClose={ onClose }
            closeButton
            style={{ height: "790px" }}
        >
            { renderPage() }
        </Modal>
    )
}