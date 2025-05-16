import { io } from 'socket.io-client';
import { AsyncStorage } from 'react-native';

export const getSocket = async () => {
    const user = await AsyncStorage.getItem('user');

    if (!user) return;

    const socket = io(`${getApiUrl()}`,
        {
            withCredentials: true
        });

    if (!socket) return;

    saveSocketOnStorage(socket);
}

const saveSocketOnStorage = async (socket) => {
    try {
        await AsyncStorage.setItem('socket', JSON.stringify(socket));
        return socket;
    } catch (error) {
        return null;
    }
}