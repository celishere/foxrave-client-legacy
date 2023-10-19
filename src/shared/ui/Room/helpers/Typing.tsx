import { useEffect, useState } from "react";

import styles from "foxrave/shared/assets/css/Chat.module.css";

import ChatStore from "foxrave/shared/store/chatStore";

export const Typing = () => {
    const [typing, setTyping] = useState<string>("");

    useEffect(() => {
        const handleTyping = (typing: string): void => {
            setTyping(typing)
        }

        ChatStore.getInstance().addTypingListener(handleTyping)

        return () => {
            ChatStore.getInstance().removeTypingListener(handleTyping)
        }
    }, []);

    return (
        <div>
            <p className={ styles.typingCache }>{ typing }</p>
        </div>
    )
}