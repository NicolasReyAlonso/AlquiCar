import ChatSidebar from "@/components/chat/ChatSidebar";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { View } from 'react-native';
import { ChatInterface } from "../../interfaces/Chat";
import mainChatStyles from "../../css/MainChat.styles";
import { MessageInterface } from "@/interfaces/Message";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useWindowDimensions, Platform } from 'react-native';
import LargeScreenView from "@/components/chat/LargeScreenView";
import MobileView from "@/components/chat/MobileView";
import { getApiUrl } from "@/utils/getApiUrl";




const isMobieleDevice = () => {
    const width = useWindowDimensions();
    return Platform.OS !== 'web' && width.width < 768; 
}

export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [contacts, setContacts] = useState<ChatInterface[]>([]);
    const [selectedContact, setSelectedChat] = useState<ChatInterface | null>(null);
    const selectedContactRef = useRef<ChatInterface | null>(null);
    const { contactId } = useLocalSearchParams();
    const { t } = useTranslation();

    const isMobile = isMobieleDevice();

    useEffect(() => {

        if (!socket) {
            const socketResponse: Socket = io(`${getApiUrl()}`, 
                {
                    withCredentials: true
                });
            setSocket(socketResponse);
            setSocketEvents(socketResponse);
            socketResponse.emit('get chats', {});
        }
    }, []);

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);


    const setSocketEvents = (socketResponse: Socket) => {
        socketResponse.on('connect', () => {
            console.log('Conectado al servidor de WebSocket');
        });

        socketResponse.on('disconnect', () => {
            console.log('Desconectado del servidor de WebSocket');
        });
        socketResponse.on('get chats', (contacts) => {
            setContacts(contacts.chats);

        });
        socketResponse.on('new message', (message) => {
            //addMessage(message[0]);
            updateContacts(message[0].from_id, message);
        })

    }

    /*
    useEffect(() => {
        if (!contactId || contacts.length === 0) return;
      
        const foundChat = contacts.find((chat: ChatInterface) => chat.contact_id === contactId);
        if (foundChat) {
          setSelectedChat(foundChat);
        }
      }, [contactId, contacts]);*/


    const updateContacts = (id: string, messages: MessageInterface[]) => {
        setContacts((prevContacts) => {
            return prevContacts.map(contact => {
                console.log("Contact", contact.contact_id === id, contact.contact_id, id);
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
        });
    }


    return (
        /*<GestureHandlerRootView style={{ flex: 1 }}>
            <View style={mainChatStyles.appContainer}>
                <ChatSidebar chats={contacts} setSelectedChat={setSelectedChat} t={t} />
                {socket && selectedContact && <ChatWindow chat={selectedContact} updateContacts={updateContacts} socket={socket} t={t} />}
            </View>
        </GestureHandlerRootView>*/
        isMobile ? <MobileView contacts={contacts} selectedContact={selectedContact} setSelectedChat={setSelectedChat} socket={socket} updateContacts={updateContacts} t={t} /> :
        <LargeScreenView contacts={contacts} selectedContact={selectedContact} setSelectedChat={setSelectedChat} socket={socket} updateContacts={updateContacts} t={t} />
    );
}