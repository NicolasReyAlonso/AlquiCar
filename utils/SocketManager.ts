import { io, Socket } from 'socket.io-client';
import { getApiUrl } from './getApiUrl';
/*
let socketInstance = null;

export const getSocket = () => {
    console.log('socketInstance', socketInstance);
    if (!socketInstance) {
        console.log('ESTO ENTRA AQUI');
        socketInstance = io(`${getApiUrl()}`,
            {
                withCredentials: true
            });
    };



    return socketInstance;
}*/

export class SocketManager {
    static socket: Socket | null = null;

    static getSocket() : Socket | null {
        if (!this.socket) {
            this.socket = io(`${getApiUrl()}`,
                {
                    withCredentials: true
                });
        }
        
        return this.socket;
    }

    static disconnectSocket() : void {
        this.socket?.disconnect();
        this.socket = null;
    }
}
