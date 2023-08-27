import { useContext } from "react";
import { useRouter } from "next/router";

import { Context } from "foxrave/pages/_app";

import Loading from "foxrave/shared/ui/Loading";

function Verify() {
    let { store } = useContext(Context);
    const router = useRouter();
    const { link } = router.query;

    // @ts-ignore
    store.activate(link).then((value) => {
        if (value) {
            router.push("/")
        }
    })

    return (
        <Loading />
    )
}

export default Verify;