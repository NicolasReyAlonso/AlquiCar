import ChatSidebar from "@/components/chat/ChatSidebar";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { View } from 'react-native';
import { ChatInterface } from "../../interfaces/Chat";
import mainChatStyles from "../../css/MainChat.styles";
import { MessageInterface } from "@/interfaces/Message";
import ChatWindow from "@/components/chat/ChatWindow";



export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [contacts, setContacts] = useState<ChatInterface[]>([]);
    const [selectedContact, setSelectedChat] = useState<ChatInterface | null>(null);
    const selectedContactRef = useRef<ChatInterface | null>(null);

    useEffect(() => {

        if (!socket) {
            const socketResponse: Socket = io('http://localhost:3000',
                {
                    withCredentials: true
                });
            console.log("Socket response", socketResponse.id);
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
        socketResponse.on('get chats', (contacts) => { setContacts(contacts.chats); console.log("Contacts", contacts); });
        socketResponse.on('new message', (message) => {
            addMessage(message[0]);

        })

    }

    const addMessage = (message: MessageInterface) => {
        setContacts((prevContacts) => {
            return prevContacts.map(contact => {
                if (contact.contact_id === message.from_id) {
                    return {
                        ...contact,
                        messages: [...contact.messages, message],
                    };
                }
                return contact;
            });
        });

        console.log("Message", selectedContact?.contact_id);
        if (message.from_id === selectedContactRef.current?.contact_id) {
            const newSelectedContact = {
                ...selectedContactRef.current,
                messages: [...selectedContactRef.current!.messages, message],
            };
            setSelectedChat(newSelectedContact);
        }

    }


    const updateContacts = (id: string, messages: MessageInterface[]) => {
        setContacts((prevContacts) => {
            return prevContacts.map(contact => {
                if (contact.contact_id === id) {
                    return {
                        ...contact,
                        messages: [...messages],
                    };
                }
                return contact;
            });
        });

        if (selectedContactRef.current?.contact_id) {
            const newSelectedContact = {
                ...selectedContactRef.current,
                messages: [...selectedContactRef.current!.messages, ...messages],
            };
            setSelectedChat(newSelectedContact);

        }
    }


    return (
        <View style={mainChatStyles.appContainer}>
            <ChatSidebar chats={contacts} setSelectedChat={setSelectedChat} />
            {socket && selectedContact && <ChatWindow chat={selectedContact} updateContacts={updateContacts} socket={socket} />}
        </View>

    );
}