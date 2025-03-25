import { useColorScheme } from "react-native";

export type Theme = {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      titles: string;
    };
    lightTemplate: {
      textColor: string;
    }
    fonts: {
      regular: string;
      bold: string;
    };
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
  };
  const colorScheme = useColorScheme();
  const TextColor = colorScheme === 'dark' ? 'white' : 'black';
  const BackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const backgroundSecomdary = colorScheme === 'dark' ? '#bbbbbb' : 'white'; 
  const TabColor = '#4472C4'
  const theme: Theme = {
    colors: {
      primary: "#3498db",
      secondary: backgroundSecomdary,
      background: BackgroundColor,
      text: TextColor,
      titles: "#1626ff"
    },
    lightTemplate: {
      textColor: "#141414",
    },
    fonts: {
      regular: "System",
      bold: "System-Bold",
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  };
  
  export default theme;
  