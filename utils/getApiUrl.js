import { Platform } from "react-native"

export const getApiUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:3000"
    } else {
        return "http://172.20.10.4:3000"
    }

}