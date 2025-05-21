import React from "react";
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NotificationsListStyles } from "@/css/NotificationsList.styles";
import { useTranslation } from 'react-i18next';
import { Notification } from "@/interfaces/Notification";
import { formatDate } from "@/utils/formatDate";

interface NotificationsListProps {
    setIsNotificationsOpen: (isNotificationsOpen: boolean) => void,
    notifications: Notification[]
    setUnreadNotifications: (unreadNotifications: number) => void
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
}

export default function NotificationsList({ setIsNotificationsOpen, notifications, setUnreadNotifications, setNotifications }: NotificationsListProps) {


    const { t } = useTranslation();


    return (
        <>
            <Pressable
                style={NotificationsListStyles.overlay}
                onPress={() => {
                    setIsNotificationsOpen(false)
                    setNotifications(prev => {
                        return prev.map(notification => {
                          if (!notification.seen) {
                            return { ...notification, seen: true };
                          }
                          return notification;
                        })})
                    setUnreadNotifications(0);
                }}
            />
            <View style={NotificationsListStyles.notificationsMenu}>
                <ScrollView style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                    <Text style={NotificationsListStyles.notificationTitle}>{t('layout.notificaciones')}</Text>
                    {notifications.length > 0 ? notifications.map((notif: Notification, index: number) => (
                        <View key={index} style={NotificationsListStyles.notificationItem}>
                            {!notif.seen && (
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'blue',
                                        marginRight: 8,
                                    }}
                                />
                            )}
                            <Text style={{ color: 'black' }}>
                                {notif.content} | {formatDate(notif.created_at)}
                            </Text>
                        </View>
                    )): <Text style={{ color: 'black', textAlign: 'center' }}>{t('layout.sinNotificaciones')}</Text>}
                </ScrollView>

            </View>
        </>
    );

}