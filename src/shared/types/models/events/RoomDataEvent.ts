import { UserRole } from "foxrave/shared/store/chatStore";

export interface RoomDataEvent {
    playback: boolean;
    seek: number;
    role: UserRole;
}