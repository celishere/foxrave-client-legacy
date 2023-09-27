import {createContext, useContext, useEffect, useState} from "react";

import {useRouter} from "next/router";

import {ThemeProvider} from "next-themes";
import {createTheme, NextUIProvider} from "@nextui-org/react";

import {Toaster} from "react-hot-toast";

import {FoxRaveProvider} from "foxrave/shared/types/appContext";

import Store, {AuthState} from "foxrave/store/store";

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
    const router = useRouter();

    const { store } = useContext(Context);
    const [authorized, setAuthorized] = useState(false);

    const authCheck = (url: string): void => {
        const path = url.split('?')[0];

        if (store.checkRoute(path)) {
            // если это безопасный роут, рендерим страницу без проверки авторизации, т.к. она не нужна
            setAuthorized(true)
            return
        }

        store.checkAuth().then((state: AuthState) => {
            console.log(state)
            if (state === AuthState.VERIFICATION) {
                if (path !== "/verify") {
                    setAuthorized(false)

                    router.push({
                        pathname: '/login',
                        query: { returnUrl: router.asPath }
                    })
                } else {
                    // на этапе верификации аккаунт есть но он не подтвержден
                    setAuthorized(true)
                }
                return
            }

            if (state === AuthState.SETUP) {
                console.log('setup', path)
                if (path !== "/setup") {
                    setAuthorized(false)

                    console.log('redirect?')

                    router.push({
                        pathname: '/setup',
                        query: { returnUrl: router.asPath }
                    })
                } else {
                    setAuthorized(true)
                }
                return
            }

            if (state === AuthState.AUTHORIZED) {
                setAuthorized(true)
                return;
            }

            if (!store.checkRoute(path)) {
                setAuthorized(false)

                router.push({
                    pathname: '/login',
                    query: { returnUrl: router.asPath }
                })
            } else {
                setAuthorized(true)
            }
        })
    }

    useEffect(() => {
        authCheck(router.asPath)

        const hideContent = () => setAuthorized(false);

        router.events.on('routeChangeStart', hideContent);

        router.events.on('routeChangeComplete', authCheck)

        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

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

                      {
                          authorized && <Component {...pageProps} />
                      }
                  </NextUIProvider>
              </ThemeProvider>
          </FoxRaveProvider>
        </Context.Provider>
    )
}