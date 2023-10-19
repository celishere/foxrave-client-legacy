import { Grid } from "@nextui-org/react";

import styles from 'foxrave/shared/assets/css/Auth.module.css';

import IndexCard from "foxrave/shared/ui/IndexCard";

function App() {
    return (
        <Grid className={ styles.pageContainer }>
            <div className={ styles.authContainer }>
                <Grid.Container justify="center">
                    <IndexCard/>
                </Grid.Container>
            </div>
        </Grid>
    )
}

export default App;
