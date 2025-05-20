
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '@/utils/getApiUrl';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // asegúrate de guardar el token como 'token'
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/notificaciones/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error('Error al obtener notificaciones');

      const data = await response.json();
      const unread = data.filter((n) => !n.read);
      setNotifications(data);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // actualiza cada 60s
    return () => clearInterval(interval);
  }, []);

  return { notifications, unreadCount };
}
