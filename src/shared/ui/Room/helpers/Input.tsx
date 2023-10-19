import {cloneElement, FormEvent, MutableRefObject, useEffect, useRef, useState} from "react";

import styles from "foxrave/shared/assets/css/Chat.module.css";
import { Send } from "foxrave/shared/assets/svg/Send";

import RoomStore from "foxrave/store/roomStore";
import SocketHelper from "foxrave/shared/types/socketHelper";

import GifPicker, { TenorImage, Theme } from "gif-picker-react";
import { GIF } from "foxrave/shared/assets/svg/GIF";

import ChatHelper from "foxrave/shared/types/chatHelper";
import ChatStore, { MessageProps } from "foxrave/store/chatStore";
import classNames from "classnames";

export const Input = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef: MutableRefObject<number | null> = useRef(null);

    const [inputValue, setInputValue] = useState("");

    const [reply, setReply] = useState<MessageProps | undefined>(undefined);

    const [usingGif, setUsingGif] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const openGifGallery = () => {
        setUsingGif(!usingGif)
    }

    const sendTypingStatus = (status: boolean) => {
        SocketHelper.send(RoomStore.getInstance().socket, "room:chat.typing", { status })
    }

    const handleInput = (e: any) => {
        setInputValue(e.target.value);

        sendTypingStatus(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // @ts-ignore
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
        }, 1000);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (inputValue.trim().length !== 0) {
            SocketHelper.send(RoomStore.getInstance().socket, "room:chat.push", { text: inputValue, reply: reply })

            setInputValue("");
            setReply(undefined)
        }
    };

    const replyListener = (message: MessageProps): void => {
        let messageCache = structuredClone(message);
        if (message.attachments?.length !== 0) {
            messageCache.text = `${message.username}: GIF изображение`
        } else {
            messageCache.text = `${message.username}: ${message.text}`
        }

        setReply(messageCache)
    }

    useEffect(() => {
        ChatStore.getInstance().addReplyListener(replyListener)

        return () => {
            ChatStore.getInstance().removeReplyListener(replyListener)
        }
    }, []);

    return (
        <>
            {
                usingGif && <>
                    <div className={ styles.gifSelector }>
                        <GifPicker
                            tenorApiKey={"AIzaSyB6XuBVUl8MjMuVTcdFbWpnQ2bsZ-OLxxo"}
                            width={260}
                            theme={Theme.DARK}
                            onGifClick={ (image: TenorImage) => {
                                ChatHelper.getInstance().sendGif(image.url)
                            }}
                        />
                    </div>
                </>
            }

            {
                reply !== undefined && <div className={ styles.replyContainer }>
                    <div className={ styles.replyHeader }>
                        <div onClick={ () => { setReply(undefined) }}>
                            Close
                        </div>
                    </div>
                    <div className={ classNames(styles.replyText, styles.replyInContainerText) }>
                        { reply.text }
                    </div>
                </div>
            }

            <div className={ styles.inputContainer }>
                <textarea
                    ref={ textareaRef }
                    className={ styles.input }
                    value={ inputValue }
                    onChange={ handleInput }
                    placeholder="Введите сообщение..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();

                            handleSubmit(e);
                        }
                    }}
                />

                <div className={ styles.inputControls }>
                    <button className={ styles.inputButton } onClick={ handleSubmit }>
                        <Send/>
                    </button>

                    <button className={ styles.inputButton } onClick={ openGifGallery }>
                        <GIF/>
                    </button>
                </div>
            </div>
        </>
    )
}