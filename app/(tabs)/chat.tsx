import React from "react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ChatInterface } from "../../interfaces/Chat";
import { MessageInterface } from "@/interfaces/Message";
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, Platform } from 'react-native';
import LargeScreenView from "@/components/chat/LargeScreenView";
import MobileView from "@/components/chat/MobileView";
import { getApiUrl } from "@/utils/getApiUrl";
import { isMobileDevice } from "@/utils/isMobileDevice";
import { sortChatsByLastMessage } from "@/utils/sortChatsByLastMessage";
import { SocketManager } from "@/utils/SocketManager";


export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [contacts, setContacts] = useState<ChatInterface[]>([]);
    const [selectedContact, setSelectedChat] = useState<ChatInterface | null>(null);
    const selectedContactRef = useRef<ChatInterface | null>(null);
    const { t } = useTranslation();

    const isMobile = isMobileDevice();

    useEffect(() => {

        if(!socket) {
            const socketResponse: Socket | null = SocketManager.getSocket();
            setSocket(socketResponse)
            setSocketEvents(socketResponse);
            if (socketResponse) socketResponse.emit('get chats', {});
        }
    }, []);

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);


    const setSocketEvents = (socketResponse: Socket | null) => {
        if(!socketResponse) return
        socketResponse.on('connect', () => {
            console.log('Conectado al servidor de WebSocket');
        });

        socketResponse.on('disconnect', () => {
            console.log('Desconectado del servidor de WebSocket');
        });
        socketResponse.on('get chats', (contacts) => {
            console.log('get chats', contacts);
            var sortedContacts = sortChatsByLastMessage(contacts.chats);
            setContacts(sortedContacts);
        });
        socketResponse.on('new message', (message) => {
            updateContacts(message[0].from_id, message);
        });
        socketResponse.on('new notification', (notification) => {
            console.log('new notification: ', notification);
            
        });

    }





    const updateContacts = (id: string, messages: MessageInterface[]) => {
        /*setContacts((prevContacts) => {
            return prevContacts.map(contact => {
                if (contact.contact_id === id) {
                    const newcontact = {
                        ...contact,
                        messages: [...contact.messages, ...messages],
                    };
                    if (selectedContactRef.current?.contact_id === id) setSelectedChat(newcontact);
                    return newcontact;
                }
                return contact;
            });
        });*/


        setContacts((prevContacts) => {
            const updatedContacts = prevContacts.map(contact => {
                if (contact.contact_id === id) {
                    const newContact = {
                        ...contact,
                        messages: [...contact.messages, ...messages],
                    };
                    if (selectedContactRef.current?.contact_id === id) setSelectedChat(newContact);
                    return newContact;
                }
                return contact;
            });

            const sortedContacts = sortChatsByLastMessage(updatedContacts);
            return sortedContacts;
        });
    }


    return (
        isMobile ?
            <MobileView contacts={contacts} selectedContact={selectedContact} setSelectedChat={setSelectedChat} socket={socket} updateContacts={updateContacts} t={t} />
            : <LargeScreenView contacts={contacts} selectedContact={selectedContact} setSelectedChat={setSelectedChat} socket={socket} updateContacts={updateContacts} t={t} />
    );
}