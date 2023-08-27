import {useContext} from "react";
import {Context} from "foxrave/pages/_app";
import {useRouter} from "next/router";

function App() {
    let { store } = useContext(Context);
    const router = useRouter();

    console.log(store.state);

    return store.checkAccess(router, (
        <div>Soon | Go to /rooms/:id</div>
    ))
}

export default App;
