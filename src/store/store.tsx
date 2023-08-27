import toast from "react-hot-toast";

import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import AuthService from "foxrave/services/AuthService";

import { IUser } from "foxrave/models/IUser";
import { AuthResponse } from "foxrave/models/response/AuthResponse";

import $api, { API_URL } from "foxrave/http";

import Loading from "foxrave/shared/ui/Loading";

export enum AuthState {
    LOADING,
    UNAUTHORIZED,
    VERIFICATION,
    SETUP,
    AUTHORIZED
}

export default class Store {
    user = {} as IUser;
    isAuth = false;
    state: AuthState = AuthState.LOADING;

    constructor() {
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setState(state: AuthState) {
        this.state = state;
    }

    async login(username: string, password: string) {
        try {
            const response = await AuthService.login(username, password);

            setCookie('refreshToken', response.data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000 })
            localStorage.setItem('token', response.data.accessToken);

            this.setAuth(true);
            this.setUser(response.data.user);

            window.location.reload();
            return true;
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message)

            // @ts-ignore
            toast.error(e.response?.data?.message)
            return false;
        }
    }

    async registration(email: string, username: string, password: string) {
        try {
            const response = await AuthService.registration(email, username, password);

            setCookie('refreshToken', response.data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000 })
            localStorage.setItem('token', response.data.accessToken);

            this.setAuth(true);
            this.setUser(response.data.user);
            this.setState(AuthState.VERIFICATION);
            return true;
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message)

            // @ts-ignore
            toast.error(e.response?.data?.message)
            return false;
        }
    }

    async logout(router: any) {
        try {
            await AuthService.logout();

            localStorage.removeItem('token');

            this.setAuth(false);
            this.setUser({} as IUser);

            deleteCookie('refreshToken')

            console.log(getCookie('refreshToken'))

            router.push('/')
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message)
        }
    }

    async activate(link: string) {
        try {
            await AuthService.activate(link)

            this.setState(AuthState.SETUP);
            return true;
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message)

            // @ts-ignore
            toast.error(e.response?.data?.message);
            return false;
        }
    }

    async checkAuth() {
        this.state = AuthState.LOADING;

        try {
            const response = await $api.get<AuthResponse>(`${API_URL}/refresh`)

            console.log(response.data);
            localStorage.setItem('token', response.data.accessToken);

            this.setAuth(true);
            this.setUser(response.data.user);

            console.log(response.data.user)

            if (!response.data.user.isActivated) {
                return AuthState.VERIFICATION;
            }

            console.log(response.data.user)
            if (!response.data.user.avatar || !response.data.user.mood) {
                return AuthState.SETUP;
            }

            return AuthState.AUTHORIZED;
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message)

            return AuthState.UNAUTHORIZED;
        }
    }

    checkAccess(router: any, page: JSX.Element) {
        let path = router.asPath;

        console.log(this.state)

        let check = function (checkPage: string) {
            console.log(path, checkPage)
            if (path === checkPage) {
                return page;
            }

            router.push(checkPage)
        }

        if (this.state === AuthState.UNAUTHORIZED) {
            if (path === '/register' || path === '/login') {
                return page;
            }

            router.push('/register')
            return <Loading />
        } else if (this.state === AuthState.VERIFICATION) {
            return check('/verify')
        } else if (this.state === AuthState.SETUP) {
            return check('/setup')
        }

        return page;
    }
}