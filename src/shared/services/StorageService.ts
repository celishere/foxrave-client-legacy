import $api from "foxrave/shared/http";

import { AxiosResponse } from 'axios';

import { AuthResponse } from "foxrave/shared/types/models/response/AuthResponse";

export default class StorageService {

    static async getMoods(): Promise<AxiosResponse<AuthResponse>> {
        return $api.get<AuthResponse>('/storage/moods');
    }
}