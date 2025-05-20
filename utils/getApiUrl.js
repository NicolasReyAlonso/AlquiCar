import { Platform } from "react-native"

export const getApiUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:3000"
    } else {
<<<<<<< HEAD
        return "http://10.193.139.24:3000"
=======
        return "http://192.168.1.42:3000"
>>>>>>> 1920fbd2385b47115dded084bf3d5ec64b90b80c
    }

}
export const getAppUrl = () => {
    if(Platform.OS === "web") {
        return "http://localhost:8081"
    } else {
        return "http://192.168.1.42:8081"
    }
}