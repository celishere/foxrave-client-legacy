import { Fragment, useState } from "react";

import { MessageProps, UserRole } from "foxrave/store/chatStore";

import { Reply } from "foxrave/shared/assets/svg/Reply";
import styles from "foxrave/shared/assets/css/Chat.module.css";

import ChatHelper from "foxrave/shared/types/chatHelper";

import { Grid, Popover, Spacer } from "@nextui-org/react";
import { Circle, Map, YMaps } from "react-yandex-maps";

interface MessageContainerProps {
    messages: MessageProps[]
}

export const Message = ({ messages }: MessageContainerProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const data = messages[0]

    let avatarClassname = styles.visitorAvatar;
    if (data.userRole === UserRole.OWNER) {
        avatarClassname = styles.ownerAvatar
    } else if (data.userRole === UserRole.SERVER) {
        avatarClassname = styles.serverAvatar
    }

    const messageElements = messages.map((message) => (
        <Fragment key={ message.id }>
            {
                // @ts-ignore
                <p id={ message.id } data-key={ message.id }>
                    {
                        message.attachments !== undefined && message.attachments.length !== 0 ?
                            <img src={ message.attachments[0].url } alt={"gif"}/>
                            :
                            <>{ message.text }</>
                    }
                    <br/>
                </p>
            }
        </Fragment>
    ));
    return (
        <div
            key={ data.id }
            className={ styles.message }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Popover isBordered disableShadow placement={"left-top"}>
                <Popover.Trigger>
                    <img src={ data.avatar } alt={ `${data.username} avatar` } className={ `${styles['avatar']} ${avatarClassname}` } />
                </Popover.Trigger>
                <Popover.Content className={ data.userLocation !== undefined ? styles.popoverMaps : styles.popover }>
                    <Grid.Container gap={2}>
                        <Grid>
                            <img src={ data.avatar } alt={ `${data.username} avatar` } className={ `${styles['popoverAvatar']} ${avatarClassname}` } />
                        </Grid>

                        <Grid>
                            <div className={ styles.popoverInfo }>
                                <span>{ data.username }</span>

                                <img src={ `${ process.env.API_URL }/storage/mood/${data.mood}` } alt={ `${data.username} mood` } className={ styles.emoticon }/>
                            </div>

                            {
                                data.userLocation !== undefined ?
                                    <>
                                        <Spacer y={1}/>
                                        <span>From: { ChatHelper.getInstance().parseLocation(data.userLocation) }</span>
                                    </> :
                                    <>
                                        <Spacer y={1}/>
                                        <span>From: Podolsk, Ukraine</span>
                                    </>
                            }
                        </Grid>
                    </Grid.Container>

                    <Grid.Container justify={"center"}>
                        {
                            data.userLocation !== undefined && data.userLocation.longitude != 1 ? <>
                                <YMaps>
                                    <Map
                                        className={ styles.popoverMapsContainer }
                                        defaultState={{
                                            center: [data.userLocation.latitude, data.userLocation.longitude],
                                            zoom: 10
                                        }}
                                    >
                                        <Circle geometry={[
                                            [data.userLocation.latitude, data.userLocation.longitude],
                                            10000
                                        ]}/>
                                    </Map>
                                </YMaps>
                            </> : null
                        }
                    </Grid.Container>
                </Popover.Content>
            </Popover>

            <div className={ styles.messageInfo }>
                <div className={ styles.username }>
                    <span>{ data.username }</span>

                    <img src={ `${ process.env.API_URL }/storage/mood/${ data.mood }` } alt={ `${data.username} mood` } className={ styles.emoticon }/>

                    <time data-variant="caption" data-color="gray" title=""
                          className={ styles.time }>{ ChatHelper.getInstance().parseTime(data.timestamp) }
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
                    <div className={ styles.messageText }>
                        { messageElements.map((messageElement) => (
                            messageElement
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )
}