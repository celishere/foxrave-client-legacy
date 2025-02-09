import Head from "next/head";

import { Grid, Spacer, Text } from "@nextui-org/react";

import { Logo } from "foxrave/shared/assets/svg/Logo";
import styles from 'foxrave/shared/assets/css/Auth.module.css';

import LoginCard from "foxrave/shared/ui/LoginCard";

function Login() {
    return (
        <>
            <Head>
                <title>
                    FoxRave | Login
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
                            <LoginCard />
                        </Grid>
                    </Grid.Container>
                </div>
            </Grid>
        </>
    )
}

export default Login;
