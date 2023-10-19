import { Key, useContext } from "react";

import { useRouter } from "next/router";

import toast from "react-hot-toast";

import { Dropdown, Text } from "@nextui-org/react";

import { Logo } from "foxrave/shared/assets/svg/Logo";

import { Context } from "foxrave/pages/_app";

import RoomStore from "foxrave/shared/store/roomStore";

import styles from "foxrave/shared/assets/css/Chat.module.css";

export const Header = () => {
    const { store } = useContext(Context)
    const router = useRouter()

    const handleDropdown = (key: Key) => {
        if (key === "settings") {
            RoomStore.getInstance().notifySettingsListeners(true)
            return
        }

        if (key === "quit") {
            toast.success("Вы вышли из комнаты!")

            router.push("/")
            return
        }
    }

    return (
        <>
            <div className={ styles.headerButton }>
                <Logo/>
            </div>

            <div className={ styles.seperator }/>

            <div className={ styles.headerButton }>
                <Dropdown placement="bottom-right">
                    <Dropdown.Trigger>
                        <img
                            src={ store.user.avatar }
                            alt="User Avatar"
                            className={ styles.headerAvatar }
                        />
                    </Dropdown.Trigger>

                    <Dropdown.Menu
                        color="secondary"
                        onAction={(key) => handleDropdown(key)}
                    >
                        <Dropdown.Item key="profile" textValue={"profile"} css={{ height: "$18" }}>
                            <Text b color="inherit" css={{ d: "flex" }}>
                                Привет, { store.user.username }
                            </Text>
                        </Dropdown.Item>

                        <Dropdown.Item key="settings" textValue={"settings"} withDivider color="default">
                            Настройки
                        </Dropdown.Item>

                        <Dropdown.Item key="quit" textValue={"quit"} color="error">
                            Выйти из рейва
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}