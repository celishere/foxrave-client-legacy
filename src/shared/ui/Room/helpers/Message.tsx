import { Fragment, useState } from "react";

import { MessageProps } from "foxrave/store/chatStore";

import { Reply } from "foxrave/shared/assets/svg/Reply";
import styles from "foxrave/shared/assets/css/Chat.module.css";

import ChatHelper from "foxrave/shared/types/chatHelper";

import { Popover } from "@nextui-org/react";

interface MessageContainerProps {
    message: MessageProps
}

export const Message = ({ message }: MessageContainerProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let messageElements;

    if (message.text !== undefined) {
        const messageTextArray = message.text.split("\n")

        messageElements = messageTextArray.map((text, index) => (
            <Fragment key={index}>
                {text}
                {index < messageTextArray.length - 1 && <br />} {/* Добавить <br> после каждой части, кроме последней */}
            </Fragment>
        ));

        console.log(messageElements)
    }

    return (
        <div
            key={message.id} data-key={ message.id }
            className={ styles.message }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Popover isBordered disableShadow placement={"left-top"}>
                <Popover.Trigger>
                    <img src={ message.avatar } alt={ `${message.username} avatar` } className={ styles.avatar } />
                </Popover.Trigger>
                <Popover.Content>
                    <a>
                        hi
                    </a>
                </Popover.Content>
            </Popover>

            <div className={ styles.messageInfo }>
                <div className={ styles.username }>
                    <span>{ message.username }</span>

                    <img src={ `http://localhost:4242/api/v1/storage/mood/${message.mood}` } alt={ `${message.username} mood` } className={ styles.emoticon }/>

                    <time data-variant="caption" data-color="gray" title=""
                          className={ styles.time }>{ ChatHelper.getInstance().parseTime(message.timestamp) }
                    </time>

                    {
                        isHovered ? (
                            <div className={ styles.reply }>
                                <Reply/>
                            </div>
                        ) : null
                    }
                </div>

                <div>
                    <p className={ styles.messageText }>
                        { messageElements }
                    </p>
                </div>
            </div>
        </div>
    )
}