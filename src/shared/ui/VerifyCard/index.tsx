import { useContext } from "react";

import {Button, Card, Input, Spacer, Text} from "@nextui-org/react";

import { Context } from "foxrave/pages/_app";

import styles from 'foxrave/shared/assets/css/AuthCard.module.css';

const VerifyCard = () => {
    const { store } = useContext(Context)

    let username = store.user.username;
    let email = store.user.email;

    return (
        <Card css={{
            maxWidth: 365,
            margin: "0 auto"
        }}>
            <Card.Header>
                <Text className={ styles.text }>
                    Верификация
                </Text>
            </Card.Header>

            <Card.Body css={{
                margin: "0 auto",
                textAlign: "center",
                maxWidth: 320
            }}>
                <Text
                    size={22}
                >
                    Спасибо за регистрацию, <span style={{ fontWeight: "bold" }}>{username}</span>!
                </Text>

                <Spacer y={1}/>

                <Text
                    size={18}
                >
                    На вашу почту <span style={{ fontWeight: "bold" }}>{email}</span>
                </Text>

                <Text
                    size={18}
                >
                    была отправлена ссылка для подтверждения регистрации.
                </Text>

                <Spacer y={2}/>

                <Text
                    weight="bold"
                    size={20}
                >
                    Проверьте папку "СПАМ"
                </Text>

                <Spacer y={1}/>

                <Text
                    weight="bold"
                    size={20}
                >
                    ИЛИ
                </Text>

                <Spacer y={1}/>

                <Input placeholder={"У меня уже есть код!"} size={"xl"} color={"secondary"}/>

                <Spacer y={1}/>

                <Button>Активировать</Button>
            </Card.Body>
        </Card>
    )
}

export default VerifyCard;