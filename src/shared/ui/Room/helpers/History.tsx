import { useEffect, useRef, useState } from "react";

import ChatStore, { MessageProps } from "foxrave/store/chatStore";
import ChatHelper from "foxrave/shared/types/chatHelper";

import styles from "foxrave/shared/assets/css/Chat.module.css";
import { UnreadMessagesButton } from "foxrave/shared/ui/Room/helpers/UnreadMessagesButton";
import {Message} from "foxrave/shared/ui/Room/helpers/Message";

export const History = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<MessageProps[]>([]);

    const scroll = () => {
        if (chatContainerRef.current) {
            const lastMessage = chatContainerRef.current.lastChild as HTMLDivElement;

            if (lastMessage) {
                // @ts-ignore
                lastMessage.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    const handleMessagesChange = (newMessages: MessageProps[]) => {
        const needScroll = ChatHelper.getInstance().isUserScrolledToBottom()

        setMessages(newMessages)

        if (chatContainerRef.current) {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages]; // Клонируем предыдущий массив сообщений

                updatedMessages.forEach((message) => {
                    if (chatContainerRef.current !== null) {
                        const messageElement = chatContainerRef.current.querySelector(`[data-key="${message.id}"]`);

                        if (messageElement !== null && ChatHelper.getInstance().isElementInViewport(messageElement)) {
                            if (!message.read) {
                                message.read = true;

                                // Найдите индекс сообщения в массиве и обновите его
                                const index = updatedMessages.findIndex((item) => item.id === message.id);

                                if (index !== -1) {
                                    updatedMessages[index] = message;
                                    ChatStore.getInstance().setById(message);
                                }
                            }
                        }
                    }
                });

                return updatedMessages; // Возвращаем обновленный массив сообщений
            });
        }

        if (needScroll) {
           setTimeout(() => {
               if (chatContainerRef.current) {
                   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
               }
           }, 50)
        }
    };

    const handleSet = (newMessages: MessageProps[]) => {
        setMessages(newMessages)

        setTimeout(() => {
            if (chatContainerRef.current) {
                console.log('scrolled')
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50)
    }

    const handleSend = () => {
        setTimeout(() => {
            console.log('?')
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
        const readCallback = () => {
            if (chatContainerRef.current) {
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages]; // Клонируем предыдущий массив сообщений

                    updatedMessages.forEach((message) => {
                        if (chatContainerRef.current !== null) {
                            const messageElement = chatContainerRef.current.querySelector(`[data-key="${message.id}"]`);

                            if (messageElement !== null && ChatHelper.getInstance().isElementInViewport(messageElement)) {
                                if (!message.read) {
                                    message.read = true;

                                    // Найдите индекс сообщения в массиве и обновите его
                                    const index = updatedMessages.findIndex((item) => item.id === message.id);
                                    if (index !== -1) {
                                        updatedMessages[index] = message;
                                        ChatStore.getInstance().setById(message);
                                    }
                                }
                            }
                        }
                    });

                    return updatedMessages; // Возвращаем обновленный массив сообщений
                });
            }
        };

        const chatHistoryContainer = chatContainerRef.current;

        if (chatHistoryContainer) {
            chatHistoryContainer.addEventListener("scroll", readCallback);

            readCallback();

            return () => {
                chatHistoryContainer.removeEventListener("scroll", readCallback);
            };
        }
    }, []);

    return (
        <>
            <div ref={ chatContainerRef } className={ styles.chatHistoryContainer } id={"chat-container"}>
                { Array.from(messages.values()).map((message) => (
                    <Message message={ message } />
                )) }

                <UnreadMessagesButton/>
            </div>
        </>
    )
}