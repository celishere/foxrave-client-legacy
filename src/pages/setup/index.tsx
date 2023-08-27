import { useContext } from "react";

import { useRouter } from "next/router";

import { Grid, Spacer, Text } from "@nextui-org/react";

import { Logo } from "foxrave/shared/assets/svg/Logo";
import styles from 'foxrave/shared/assets/css/Auth.module.css';

import SetupCard from "foxrave/shared/ui/SetupCard";

import { Context } from "foxrave/pages/_app";

function Setup() {
    let { store } = useContext(Context);
    const router = useRouter();

    return store.checkAccess(router, (
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
                        <SetupCard />
                    </Grid>
                </Grid.Container>
            </div>
        </Grid>
    ))
}

export default Setup;
