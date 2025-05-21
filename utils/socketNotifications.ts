import { Socket } from "socket.io-client"
import { Notification } from "@/interfaces/Notification";

interface SocketNotification {
    socket: Socket,
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>
}

export const setSocketNotificationsEvents = ({ socket, setNotifications, setUnreadNotifications }: SocketNotification) => {
    socket.on('new notification', (notification) => {
        setNotifications(prev => {
            return [...notification, ...prev]
        });
        setUnreadNotifications(prev =>  prev + 1 );

        console.log('new notification: ', notification);
    });
    socket.on('get notifications', async (response) => {
        console.log('get notifications: ', response.notifications);
        setNotifications(response.notifications);
        setUnreadNotifications(response.notifications.filter((notification: Notification) => !notification.seen).length);

    });
}