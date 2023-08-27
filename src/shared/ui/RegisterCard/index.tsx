import {Button, Card, Grid, Input, Spacer, Text} from "@nextui-org/react";

import styles from 'foxrave/shared/assets/css/AuthCard.module.css';
import {useRouter} from "next/router";
import {useContext, useState} from "react";
import {Context} from "foxrave/pages/_app";

const RegisterCard = () => {
    let router = useRouter();
    const { store } = useContext(Context)

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handle = () => {
        if (!store.isAuth) {
            store.registration(email, username, password).then((value) => {
                if (value) {
                    setTimeout(() => {
                        console.log('go')
                        router.push("/verify")
                    }, 1000)
                }
            });
        }
    }

    return (
        <Card css={{
            maxWidth: 365,
            margin: "0 auto"
        }}>
            <Card.Header>
                <Text className={ styles.text }>
                    Регистрация
                </Text>
            </Card.Header>

            <Card.Body css={{
                maxWidth: 300,
                margin: "0 auto"
            }}>
                <Input
                    bordered
                    aria-label="Email"
                    placeholder="Email"
                    status="secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Spacer y={1.5}/>

                <Input
                    bordered
                    aria-label="Никнейм"
                    placeholder="Никнейм"
                    status="secondary"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Spacer y={1.5}/>

                <Input.Password
                    bordered
                    aria-label="Пароль"
                    placeholder="Пароль"
                    status="secondary"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Spacer y={1.5}/>

                <Button
                    color="secondary"
                    style={{
                        width: "90%",
                        margin: "0 auto",
                        fontSize: "16px"
                    }}
                    onPress={handle}
                >
                    Зарегистрироваться
                </Button>

                <Spacer y={1}/>

                <Grid.Container justify="center">
                    <Grid style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Text
                            size={ 18 }
                            color={"#9AA0A6"}
                        >
                            Уже есть аккаунт?
                        </Text>
                        <Text
                            size={ 18 }
                            color="secondary"
                            weight={"bold"}
                            style={{
                                marginLeft: '5px',
                                padding: '0',
                                'cursor': 'pointer'
                            }}
                            onClick={() => router.push("/login")}
                        >
                            Войдите!
                        </Text>
                    </Grid>
                </Grid.Container>
            </Card.Body>
        </Card>
    )
}

export default RegisterCard;