import { StyleSheet } from 'react-native';

const chatWindowStyles = StyleSheet.create({
 
    chatContainer: {
      flex: 1,
      backgroundColor: 'transparent', 
      flexDirection: 'column',
      justifyContent: 'flex-start', 
      color: 'white',
    },
    chatMessages: {
      padding: 16,
      flex: 8, 
      overflow: 'scroll',
    },
    chatMessage: {
      marginBottom: 16,
    },
    senderName: {
      fontWeight: '600',
      color: 'white',
    },
    messageContent: {
      marginTop: 4,
      color: 'white',
    },
    inputContainer: {
      flex: 0.05,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      bottom: 0,
      width: '100%',
      backgroundColor: '#2d2d2d', 
    },
    inputField: {
      padding: 8,
      borderRadius: 8,
      color: 'white',
      backgroundColor: '#333',
      borderWidth: 0,
      flex: 1,
    },
    sendButton: {
      color: 'white',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8, 
      backgroundColor: '#3a3a3a',
      alignSelf: 'center', 
      flex: 2,
    },
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
    mine: {
      alignSelf: 'flex-end',
      backgroundColor: '#3a3a3a',
      color: 'white',
    },
    other: {
      alignSelf: 'flex-start',
      backgroundColor: '#1e1e1e',
      color: 'white',
    },
    sendButtonText: {
      color: 'white',
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2d2d2d',
      padding: 10,
      marginBottom: 3,
      gap: 10,
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