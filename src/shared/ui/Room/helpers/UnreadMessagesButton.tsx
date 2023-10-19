import ChatHelper from "foxrave/shared/types/chatHelper";

import styles from "foxrave/shared/assets/css/Chat.module.css";

export const UnreadMessagesButton = () => {
    const count = ChatHelper.getInstance().getUnread()

    return (
        count > 0 ??
            <div className={ styles.unreadContainer } onClick={() => ChatHelper.getInstance().scrollToLast()}>
                <div className={ styles.unreadCount }>{ count }</div>
            </div>
    )
}