import toast from "react-hot-toast";

import { deleteCookie } from 'cookies-next';

import AuthService from "foxrave/services/AuthService";

import { IUser } from "foxrave/models/IUser";
import { AuthResponse } from "foxrave/models/response/AuthResponse";

import $api, { API_URL } from "foxrave/http";

export enum AuthState {
    LOADING,
    UNAUTHORIZED,
    VERIFICATION,
    SETUP,
    AUTHORIZED
}

export const PublicPaths = [
    "/login", "/register"
]

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

            localStorage.setItem('refreshToken', response.data.refreshToken)
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

            localStorage.setItem('refreshToken', response.data.refreshToken)
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

    async logout() {
        try {
            await AuthService.logout();

            localStorage.removeItem('token');

            this.setAuth(false);
            this.setUser({} as IUser);

            deleteCookie('refreshToken')
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
            const response = await $api.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
            console.log(response)

            localStorage.setItem('token', response.data.accessToken);

            this.setAuth(true);
            this.setUser(response.data.user);

            if (!response.data.user.isActivated) {
                return AuthState.VERIFICATION;
            }

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

    checkRoute(path: string): boolean {
        return PublicPaths.includes(path)
    }
}