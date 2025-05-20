import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './getApiUrl';

export const isUserUploaded = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return false;
    const verificationTokenResponse = await fetch(`${getApiUrl()}/auth/verifyToken`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!verificationTokenResponse.ok) {
        return false;
    }
    const verificationTokenResponseJson =  await verificationTokenResponse.json()
    await AsyncStorage.setItem('user', JSON.stringify(verificationTokenResponseJson.user));
    return true;
}