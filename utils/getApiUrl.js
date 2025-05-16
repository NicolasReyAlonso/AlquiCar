import { Platform } from "react-native"

export const getApiUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:3000"
    } else {
        return "http://192.168.196.30:3000"
    }

}