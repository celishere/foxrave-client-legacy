import $api from "foxrave/http";

import { AxiosResponse } from 'axios';

import { AuthResponse } from "foxrave/models/response/AuthResponse";

export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', { username, password })
    }

    static async registration(email: string, username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', { email, username, password })
    }

    static async logout(): Promise<void> {
        await $api.post<AuthResponse>('/logout')
    }

    static async activate(link: string): Promise<void> {
        await $api.get<AuthResponse>(`/activation/${link}`)
    }

    static async uploadAvatar(file: Blob, filename: string): Promise<AxiosResponse<AuthResponse>> {
        const formData = new FormData();
        formData.append("image", file, `${filename}`);

        return $api.post<AuthResponse>('/uploadAvatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async setMood(mood: number): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/setMood', { mood });
    }
}