import { Header } from "foxrave/shared/ui/Room/helpers/Header";
import { History } from "foxrave/shared/ui/Room/helpers/History";
import { Input } from "foxrave/shared/ui/Room/helpers/Input";
import { Typing } from "foxrave/shared/ui/Room/helpers/Typing";

import styles from "foxrave/shared/assets/css/Chat.module.css";

export const Chat = () => {
    return (
        <div className={styles.chatFrame}>
            <div className={styles.chatContainer}>
                <div className={styles.chatContainer}>
                    <div className={styles.chatContainerView}>
                        <div className={styles.chatContainerDisplay}>
                            <div className={styles.header}>
                                <Header/>
                            </div>

                            <Typing/>
                            <History/>
                        </div>
                    </div>
                </div>

                <Input/>
            </div>
        </div>
    )
}