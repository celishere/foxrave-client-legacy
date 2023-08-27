import {useContext, useEffect} from "react";
import {Context} from "foxrave/pages/_app";
import Loading from "foxrave/shared/ui/Loading";
import {useRouter} from "next/router";

function Logout() {
    let { store } = useContext(Context);
    const router = useRouter();

    useEffect(() => {
        store.logout(router);
    }, []);

    return (
        <Loading />
    )
}

export default Logout;