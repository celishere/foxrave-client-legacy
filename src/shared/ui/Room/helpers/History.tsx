import { useEffect, useRef, useState } from "react";

import ChatStore, { MessageProps } from "foxrave/store/chatStore";
import ChatHelper from "foxrave/shared/types/chatHelper";

import styles from "foxrave/shared/assets/css/Chat.module.css";

import { UnreadMessagesButton } from "foxrave/shared/ui/Room/helpers/UnreadMessagesButton";
import { Message } from "foxrave/shared/ui/Room/helpers/Message";

export const History = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [messageGroups, setMessageGroups] = useState<MessageProps[][]>([]);

    const readCallback = () => {
        const groups = ChatHelper.getInstance().groupMessages(
            Array.from(ChatStore.getInstance().history.values())
        )

        groups.forEach((group) => {
            group.forEach((message) => {
                if (!message.read && chatContainerRef.current) {
                    const messageElement = chatContainerRef.current.querySelector(
                        `[data-key="${message.id}"]`
                    );

                    if (messageElement != null) {
                        console.log(`[Chat] Got element with ${message.id} id.`)
                    }

                    if (
                        messageElement !== null &&
                        ChatHelper.getInstance().isElementInViewport(messageElement)
                    ) {
                        message.read = true;

                        ChatStore.getInstance().setById(message);

                        // @ts-ignore
                        const updatedGroups = groups.map((group) =>
                            // @ts-ignore
                            group.map((msg) => ({ ...msg }))
                        );

                        setMessageGroups(updatedGroups);
                    } else if (messageElement === null) {
                        console.log(`[Chat] Unknown element with ${message.id} id.`)
                    }
                }
            });
        });
    }

    const handleMessagesChange = (newMessages: MessageProps[]) => {
        if (chatContainerRef.current) {
            const checkId = newMessages.length - 2
            let needScroll = false

            if (newMessages[checkId] !== undefined) {
                needScroll = ChatHelper.getInstance().isUserScrolledToBottom(
                    chatContainerRef.current,
                    newMessages[checkId].id
                );
            }

            setMessageGroups(ChatHelper.getInstance().groupMessages(newMessages));

            if (needScroll) {
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        readCallback()

                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 50);
            }
        }
    };

    const handleSet = (messages: MessageProps[]) => {
        setMessageGroups(ChatHelper.getInstance().groupMessages(messages));

        setTimeout(() => {
            if (chatContainerRef.current) {
                if (!ChatStore.getInstance().isFetching) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                } else {
                    ChatStore.getInstance().isFetching = false

                    chatContainerRef.current.scrollTop = 5;
                }
            }
        }, 50)
    }

    const handleSend = () => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50)
    }

    useEffect(() => {
        ChatStore.getInstance().addListener(handleMessagesChange)
        ChatStore.getInstance().addSendListener(handleSend)
        ChatStore.getInstance().addSetListener(handleSet)

        return () => {
            ChatStore.getInstance().removeListener(handleMessagesChange)
            ChatStore.getInstance().removeSendListener(handleSend)
            ChatStore.getInstance().removeSetListener(handleSet)
        }
    }, [])

    useEffect(() => {
        const chatHistoryContainer = chatContainerRef.current;

        if (chatHistoryContainer) {
            const handleScroll  = () => {
                readCallback()

                if (chatContainerRef.current) {
                    if (chatContainerRef.current.scrollTop === 0) {
                        ChatHelper.getInstance().requestMessages()
                    }
                }
            }

            chatHistoryContainer.addEventListener("scroll", handleScroll);

            readCallback();

            return () => {
                chatHistoryContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    return (
        <>
            <div ref={ chatContainerRef } className={ styles.chatHistoryContainer } id={ "chat-container" }>
                { messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <Message messages={ group } />
                    </div>
                )) }

                <UnreadMessagesButton/>
            </div>
        </>
    )
}