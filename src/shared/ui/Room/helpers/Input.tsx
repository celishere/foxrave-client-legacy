import {FormEvent, MutableRefObject, useEffect, useRef, useState} from "react";

import styles from "foxrave/shared/assets/css/Chat.module.css";
import { Send } from "foxrave/shared/assets/svg/Send";

import RoomStore from "foxrave/store/roomStore";
import SocketHelper from "foxrave/shared/types/socketHelper";

export const Input = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef: MutableRefObject<number | null> = useRef(null);

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

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
            SocketHelper.send(RoomStore.getInstance().socket, "room:chat.push", { text: inputValue })

            setInputValue("");
        }
    };

    return (
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
            </div>
        </div>
    )
}