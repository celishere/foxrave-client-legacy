import $api from "foxrave/http";

import { AxiosResponse } from 'axios';

import { AuthResponse } from "foxrave/models/response/AuthResponse";

export default class StorageService {

    static async getMoods(): Promise<AxiosResponse<AuthResponse>> {
        return $api.get<AuthResponse>('/storage/moods');
    }
}