import { useWindowDimensions, Platform } from "react-native";

export const isMobileDevice = () => {
    const width = useWindowDimensions();
    return Platform.OS !== 'web' && width.width < 768; 
}