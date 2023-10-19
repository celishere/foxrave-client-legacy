import $api from "foxrave/shared/http";

import { AxiosResponse } from "axios";

import { IUser } from "foxrave/shared/types/models/IUser";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get('/users')
    }
}