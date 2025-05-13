import AsyncStorage from '@react-native-async-storage/async-storage';

export const isUserUploaded = async ()=> {
    const user = await AsyncStorage.getItem('user');
    if(!user) return false;
    return true;
}