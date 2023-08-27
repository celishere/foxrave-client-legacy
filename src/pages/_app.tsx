import {createContext, useContext, useEffect, useState} from "react";

import Store, {AuthState} from "foxrave/store/store";
import {ThemeProvider} from "next-themes";
import {createTheme, NextUIProvider} from "@nextui-org/react";

import {Toaster} from "react-hot-toast";
import Loading from "foxrave/shared/ui/Loading";
import {FoxRaveProvider} from "foxrave/shared/types/appContext";

import "foxrave/shared/assets/css/globals.css";

interface State {
    store: Store;
}

const store = new Store();

export const Context = createContext<State>({
    store
})

export default function App({
                                // @ts-ignore
                                Component,
                                pageProps: { ...pageProps }
                            }) {
    const { store } = useContext(Context);
    const [state, setState] = useState<AuthState>(AuthState.LOADING);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth().then((state: AuthState) => {
                store.setState(state)
                setState(state);
            });
        } else {
            store.setState(AuthState.UNAUTHORIZED);
            setState(AuthState.UNAUTHORIZED);
        }
    }, []);

    if (state === AuthState.LOADING) {
        return (
            <Loading/>
        )
    }

    return (
        <Context.Provider value={{
            store
        }}>
          <FoxRaveProvider>
              <ThemeProvider
                  defaultTheme="dark"
                  attribute="class"
                  value={{
                      dark: createTheme({ type: 'dark'}).className
                  }}
              >
                  <NextUIProvider>
                      <Toaster />

                      <Component {...pageProps} />
                  </NextUIProvider>
              </ThemeProvider>
          </FoxRaveProvider>
        </Context.Provider>
    )
}