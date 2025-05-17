import { Platform } from "react-native"

export const getApiUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:3000"
    } else {
        return "http://192.168.1.42:3000"
    }

}
export const getAppUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:8081"
    } else {
        return "http://192.168.1.42:8081"
    }
}