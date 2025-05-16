import React from 'react';
import { StyleSheet } from 'react-native';

const contactListStyles = StyleSheet.create({
    // Contenedor principal
    contactListContainer: {
        flex: 1,
        backgroundColor: 'transparent', // Como el background-size: cover no aplica, solo usamos transparencia
        flexDirection: 'column',
        justifyContent: 'flex-start', // Alinea el contenido en la parte inferior
        color: 'white',
    },

    // Sección de contactos
    contactListSection: {
        padding: 16,
        flex: 8,
        overflow: 'scroll',
    },

    // Estilos para cada contacto
    contactCard: {
        marginBottom: 16,
        overflow: 'hidden',
    },

    // Nombre del contacto
    contactName: {
        fontWeight: '600',
        color: 'white',
    },

    // Último mensaje del contacto
    lastMessage: {
        marginTop: 4,
        color: 'white',

    },
});

export default contactListStyles;