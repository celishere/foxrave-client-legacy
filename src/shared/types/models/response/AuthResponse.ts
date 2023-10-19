import { IUser } from "foxrave/models/IUser";

export interface Mood {
    id: number;
    url: string;
}

export interface AuthResponse {
    message: string;
    moods: Mood[];
    accessToken: string;
    refreshToken: string;
    user: IUser;
}