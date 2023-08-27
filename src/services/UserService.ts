import $api from "foxrave/http";

import { AxiosResponse } from "axios";

import { IUser } from "foxrave/models/IUser";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get('/users')
    }
}