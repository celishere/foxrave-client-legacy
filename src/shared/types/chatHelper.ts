import ChatStore from "foxrave/store/chatStore";
import {useContext} from "react";
import {Context} from "foxrave/pages/_app";

export default class ChatHelper  {
    static instance: ChatHelper | undefined

    static getInstance(): ChatHelper {
        if (this.instance === undefined) {
            this.instance = new ChatHelper()
        }

        return this.instance
    }

    isElementInViewport = (el: Element): boolean => {
        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    getLastMessageElement() {
        const chatContainer = document.getElementById("chat-container");

        if (!chatContainer) {
            return null;
        }

        return chatContainer.querySelector('div[data-key]:nth-last-child(2)');
    }

    isUserScrolledToBottom() {
        const lastMessageElement = this.getLastMessageElement()

        if (!lastMessageElement) {
            console.log('???')
            return false;
        }

        const lastMessageRect = lastMessageElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        return lastMessageRect.top >= 0 && lastMessageRect.bottom <= windowHeight;
    }

    scrollToLast() {
        const lastMessage = this.getLastMessageElement()

        ChatStore.getInstance().readAll()

        if (lastMessage) {
            // @ts-ignore
            lastMessage.scrollIntoView({ behavior: "instant" })
        }
    }

    getUnread = (): number => {
        let count = 0

        const { store } = useContext(Context)
        const userId = store.user.id

        for (const message of Array.from(ChatStore.getInstance().history.values())) {
            if (!message.read && message.userId !== userId && ChatStore.getInstance().isSet) {
                count += 1
            }
        }

        return count
    }

    parseTime = (timestamp: number): string => {
        const date = new Date(timestamp)

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`
    }
}