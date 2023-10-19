import Head from "next/head";

import { Grid, Spacer, Text } from "@nextui-org/react";

import RegisterCard from "foxrave/shared/ui/RegisterCard";

import { Logo } from "foxrave/shared/assets/svg/Logo";

import styles from 'foxrave/shared/assets/css/Auth.module.css';

function Register() {
    return (
        <>
            <Head>
                <title>
                    FoxRave | Register
                </title>
            </Head>

            <Grid className={ styles.pageContainer }>
                <div className={ styles.authContainer }>
                    <Spacer y={0.35} />

                    <Grid.Container justify="center">
                        <Grid className={ styles.logoContainer }>
                            <Logo />

                            <Text
                                h3
                                weight="bold"
                                style={{
                                    marginLeft: '10px'
                                }}>
                                FoxRave
                            </Text>
                        </Grid>

                        <Spacer y={4}/>

                        <Grid xs={24} sm={12}>
                            <RegisterCard />
                        </Grid>

                        <Spacer y={2}/>

                        <Grid className={ styles.legalContainer }>
                            <Text
                                color="#9AA0A6"
                                className={ styles.legalText }
                            >
                                Создавая аккаунт, я даю согласие на обработку персональных данных и соглашаюсь с лисьими условиями
                            </Text>
                        </Grid>
                    </Grid.Container>
                </div>
            </Grid>
        </>
    )
}

export default Register;
