import { useEffect, useState } from "react";
import React from "react";
import { Socket } from "socket.io-client";
import { SocketManager } from "@/utils/SocketManager";
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NotificationsListStyles } from "@/css/NotificationsList.styles";
import i18n from '../assets/location/i18n';
import { useTranslation } from 'react-i18next';

interface NotificationsListProps {
    setIsNotificationsOpen: (isNotificationsOpen: boolean) => void
}

export default function NotificationsList({setIsNotificationsOpen}: NotificationsListProps) {
    interface Notification {
        id: string;
        message: string;
    }

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (!socket) {
            const socketResponse: Socket | null = SocketManager.getSocket();
            if (!socketResponse) return
            setSocket(socketResponse);
            setSocketEvents(socketResponse);
            socketResponse.emit('get notifications', {});
        }

    }, [])

    const setSocketEvents = (socketResponse: Socket) => {
        socketResponse.on('new notification', (notification) => {
            console.log('new notification: ', notification);
            setNotifications(prev => [...notification, ...prev]);
            setUnreadCount(prevCount => prevCount + 1);
            console.log("Hola", notifications);
        });
        socketResponse.on('get notifications', async (notifications) => {
            console.log('get notifications', notifications);
        });

    }

    return (
        <>
            <Pressable
                style={NotificationsListStyles.overlay}
                onPress={() => setIsNotificationsOpen(false)}
            />
            <View style={NotificationsListStyles.notificationsMenu}>
                <ScrollView>
                    <Text style={NotificationsListStyles.notificationTitle}>{t('layout.notificaciones')}</Text>
                    {notifications.map((notif: any, index: number) => (
                        <View key={index} style={NotificationsListStyles.notificationItem}>
                            <Text style={NotificationsListStyles.notificationText}>
                                {notif.icon || '🔔'} {notif.message}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

            </View>
        </>
    );

}