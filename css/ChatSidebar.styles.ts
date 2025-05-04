import { StyleSheet } from "react-native";

// ChatSidebar.styles.ts

const chatSidebarStyles = StyleSheet.create({
  contactCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    width: '95%',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // para Android
  },
  contactName: {
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    fontSize: 14,
    color: '#bbbbbb',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#1e1e1e',
    color: 'white',
    justifyContent: 'center', // Alinea el contenido dentro de la barra lateral
    alignItems: 'center', // Centra los items en el eje horizontal
    padding: 10,
  },
  scrollView: {
    width: '100%',
    overflow: 'scroll',
  },

});

export default chatSidebarStyles;
