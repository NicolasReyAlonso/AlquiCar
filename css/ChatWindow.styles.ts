import { StyleSheet } from 'react-native';

const chatWindowStyles = StyleSheet.create({
    // Contenedor principal
    chatContainer: {
      flex: 1,
      backgroundColor: 'transparent', // Como el background-size: cover no aplica, solo usamos transparencia
      flexDirection: 'column',
      justifyContent: 'flex-start', // Alinea el contenido en la parte inferior
      color: 'white',
    },
  
    // Sección de mensajes
    chatMessages: {
      padding: 16,
      flex: 8, 
      overflow: 'scroll',
    },
  
    // Estilos para cada mensaje
    chatMessage: {
      marginBottom: 16,
    },
  
    // Nombre del remitente
    senderName: {
      fontWeight: '600',
      color: 'white',
    },
  
    // Contenido del mensaje
    messageContent: {
      marginTop: 4,
      color: 'white',
    },
  
    // Barra de entrada (fija en la parte inferior)
    inputContainer: {
      flex: 0.05,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      bottom: 0,
      width: '100%',
      backgroundColor: '#2d2d2d', // Para que tenga fondo en la parte inferior
    },
  
    // Estilo del campo de input
    inputField: {
      padding: 8,
      borderRadius: 8, // 0.375rem es aproximadamente 8px
      color: 'white',
      backgroundColor: '#333', // Para asegurar que tenga fondo visible
      borderWidth: 0,
      flex: 1, // Para que ocupe el espacio disponible
    },
  
    // Estilo del botón de enviar
    sendButton: {
      color: 'white',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8, // 0.375rem es aproximadamente 8px
      backgroundColor: '#3a3a3a',
      alignSelf: 'center', // Para que se mantenga alineado
    },
  
    // Estilos específicos para los mensajes
    message: {
      borderRadius: 10,
      padding: 10,
      margin: 10,
    },

    messageTime: {
      fontSize: 10,
      color: 'white',
      marginTop: 4,
    },
  
    // Estilo para los mensajes propios (alineados a la derecha)
    mine: {
      alignSelf: 'flex-end',
      backgroundColor: '#3a3a3a',
      color: 'white',
    },
  
    // Estilo para los mensajes del otro (alineados a la izquierda)
    other: {
      alignSelf: 'flex-start',
      backgroundColor: '#1e1e1e',
      color: 'white',
    },
  
    // Estilos adicionales para el botón de enviar
    sendButtonText: {
      color: 'white',
    },
    header: {
      backgroundColor: '#2d2d2d',
      padding: 10,
      marginBottom: 3,
    },
    contactName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#2d2d2d',
    },
    noMessages: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },

  });
  
  export default chatWindowStyles;