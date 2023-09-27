import axios from 'axios';
import { getCookie } from "cookies-next";

import { AuthResponse } from "foxrave/models/response/AuthResponse";
import {useRouter} from "next/router";
import {useEffect} from "react";

export const API_URL = process.env.API_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer: ${localStorage.getItem('token')}`
    config.headers.refresh = localStorage.getItem('refreshToken');

    return config;
})

$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;

    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;

        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken);

            return $api.request(originalRequest);
        } catch (e) {
            console.log("Invalid session")
        }
    }

    throw error;
})

export default $api;