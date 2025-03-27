import { Appearance } from 'react-native';

export type Theme = {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      tabColor: string;
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
  const colorScheme = Appearance.getColorScheme();
  const TextColor = colorScheme === 'dark' ? 'white' : 'black';
  const BackgroundColor = colorScheme === 'dark' ? '#1f1f1f' : 'white';
  const backgroundSecomdary = colorScheme === 'dark' ? '#bbbbbb' : '#dadada'; 
  const TabColor = '#4472C4'
  const theme: Theme = {
    colors: {
      primary: "#3498db",
      secondary: backgroundSecomdary,
      background: BackgroundColor,
      text: TextColor,
      tabColor: TabColor,
      titles: "#4472C4"
    },
    lightTemplate: {
      textColor: "#141414",
    },
    fonts: {
      regular: "sans-serif'",
      bold: "sans-serif",
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  };
  
  export default theme;
  