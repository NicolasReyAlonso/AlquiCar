import React from "react";
import { View } from 'react-native';
import ChatWindow from "@/components/chat/ChatWindow";
import mainChatStyles from "../../css/MainChat.styles";
import { ChatInterface } from '@/interfaces/Chat';
import { MessageInterface } from '@/interfaces/Message';
import { TFunction } from 'i18next';
import { Socket } from 'socket.io-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';
import { useCallback } from "react";


import ChatSidebar from "@/components/chat/ChatSidebar";

interface MobileViewProps {
    contacts: ChatInterface[];
    updateContacts: (id: string, messages: MessageInterface[]) => void;
    selectedContact: ChatInterface | null;
    socket: Socket | null;
    setSelectedChat: (chat: ChatInterface | null) => void;
    t: TFunction;
}


export default function MobileView({ contacts, selectedContact, setSelectedChat, socket, updateContacts, t }: MobileViewProps) {
    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedChat(null);
            }
        }, [])
    )

    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {selectedContact ?
                (socket && selectedContact && <ChatWindow chat={selectedContact} updateContacts={updateContacts} socket={socket} t={t} isMobile={true} setSelectedContact={setSelectedChat} />)
                : <ChatSidebar chats={contacts} setSelectedChat={setSelectedChat} t={t} isMobile={true} />
            }
        </GestureHandlerRootView>
    )
}