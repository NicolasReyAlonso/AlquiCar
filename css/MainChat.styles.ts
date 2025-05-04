import { StyleSheet } from 'react-native';

const mainChatStyles = StyleSheet.create({
    appContainer: {
      flexDirection: 'row', // Establece el layout en fila (como en `display: flex;` en CSS)
      height: '100%', // Hace que el contenedor ocupe toda la pantalla
    },
    sidebar: {
      width: '25%',
      backgroundColor: '#1e1e1e',
      color: 'white',
      justifyContent: 'center', // Alinea el contenido dentro de la barra lateral
      alignItems: 'center', // Centra los items en el eje horizontal
      padding: 10,
    },
    chatWindow: {
      width: '75%',
      backgroundColor: '#2d2d2d',
      color: 'white',
      padding: 16,
    },
  });

  export default mainChatStyles;