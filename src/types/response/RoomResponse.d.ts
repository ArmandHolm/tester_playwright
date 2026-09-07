export interface Room {
    accessible: boolean;
    description: string;
    features: string[];
    image: string;
    roomName: string;
    roomPrice: number;
    roomid: number;
    type: string;
    id?: number;
}

export interface RoomResponse {
    rooms: Room[];
}
