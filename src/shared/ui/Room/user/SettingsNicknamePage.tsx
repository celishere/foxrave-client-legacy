import { Button, Text } from "@nextui-org/react";

import styles from "foxrave/shared/assets/css/Setup.module.css";

interface SettingsPageProps {
    onQuit: () => void;
}

export default function SettingsNicknamePage({ onQuit }: SettingsPageProps) {
    return (
        <>
            <Text>Мне лень</Text>

            <div className={ styles.buttonQuit }>
                <Button onPress={ () => onQuit() } color="secondary" size="lg" rounded flat>
                    Выйти
                </Button>
            </div>
        </>
    )
}