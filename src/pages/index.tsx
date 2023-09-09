import { useContext } from "react";

import { useRouter } from "next/router";

import { Context } from "foxrave/pages/_app";

import { Grid } from "@nextui-org/react";
import styles from 'foxrave/shared/assets/css/Auth.module.css';
import IndexCard from "foxrave/shared/ui/IndexCard";

function App() {
    let { store } = useContext(Context);
    const router = useRouter();

    console.log(store.state);

    return store.checkAccess(router, (
        <Grid className={ styles.pageContainer }>
            <div className={ styles.authContainer }>
                <Grid.Container justify="center">
                    <IndexCard/>
                </Grid.Container>
            </div>
        </Grid>
    ))
}

export default App;
