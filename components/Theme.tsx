import { useColorScheme } from "react-native";

export type Theme = {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      white: string;
      black: string;
    };
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
  const theme: Theme = {
    colors: {
      primary: "#3498db",
      secondary: "#2ecc71",
      background: "#ecf0f1",
      text: TextColor,
      white: "#ffffff",
      black: "#000000",
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
  