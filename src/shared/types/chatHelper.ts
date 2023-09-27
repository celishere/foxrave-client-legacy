import ChatStore, {Attachment, AttachmentType, MessageProps, UserLocation} from "foxrave/store/chatStore";
import {useContext} from "react";
import {Context} from "foxrave/pages/_app";
import SocketHelper from "foxrave/shared/types/socketHelper";
import RoomStore from "foxrave/store/roomStore";

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

    getLastMessageElement(container: HTMLDivElement | null = null, id: number | null = null) {
        if (container !== null && id !== null) {
            return container.querySelector(`[data-key="${id}"]`);
        }

        const chatContainer = document.getElementById("chat-container");

        if (!chatContainer) {
            return null;
        }

        return chatContainer.querySelector('div[data-key]:nth-last-child(2)');
    }

    isUserScrolledToBottom(container: HTMLDivElement, id: number) {
        const lastMessageElement = this.getLastMessageElement(container, id)

        if (!lastMessageElement) {
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

    parseLocation = (userLocation: UserLocation): string => {
        if (userLocation.country.length === 0) {
            return userLocation.city
        }

        return `${userLocation.city}, ${userLocation.country}`
    }

    groupMessages = (messages: MessageProps[]) => {
        const groups: MessageProps[][] = [];
        let currentGroup: MessageProps[] = [];

        for (let i = 0; i < messages.length; i++) {
            const currentMessage = messages[i];
            const previousMessage = i > 0 ? messages[i - 1] : null;

            if (
                previousMessage &&
                currentMessage.userId === previousMessage.userId
            ) {
                currentGroup.push(currentMessage);
            } else {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }

                currentGroup = [currentMessage];
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    requestMessages = () => {
        const size = ChatStore.getInstance().history.size
        const socket = RoomStore.getInstance().socket

        ChatStore.getInstance().isFetching = true

        SocketHelper.send(socket, "room:chat.get", {
            count: size + 10
        })
    }

    sendGif = (gifUrl: string) => {
        const socket = RoomStore.getInstance().socket

        const attachment = {
            type: AttachmentType.GIF,
            url: gifUrl
        } as Attachment

        SocketHelper.send(socket, "room:chat.push", {
            attachments: {
                attachment
            }
        })
    }
}