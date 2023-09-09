import { useContext, useEffect } from "react";

import { useRouter } from "next/router";

import Loading from "foxrave/shared/ui/Loading";
import { Context } from "foxrave/pages/_app";

function Logout() {
    let { store } = useContext(Context);
    const router = useRouter();

    useEffect(() => {
        store.logout().then(() => {
            setTimeout(() => {
                router.push("/")
            }, 1000)
        });
    }, []);

    return (
        <Loading />
    )
}

export default Logout;