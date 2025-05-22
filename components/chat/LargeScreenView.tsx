import React from "react";
import { View, Text } from 'react-native';
import ChatWindow from "@/components/chat/ChatWindow";
import mainChatStyles from "../../css/MainChat.styles";
import { ChatInterface } from '@/interfaces/Chat';
import { MessageInterface } from '@/interfaces/Message';
import { TFunction } from 'i18next';
import { Socket } from 'socket.io-client';
import ChatSidebar from "@/components/chat/ChatSidebar";

interface LargeScreenViewProps {
    contacts: ChatInterface[];
    updateContacts: (id: string, messages: MessageInterface[]) => void;
    selectedContact: ChatInterface | null;
    socket: Socket | null;
    setSelectedChat: (chat: ChatInterface) => void;
    t: TFunction;
}


export default function LargeScreenView({contacts, selectedContact, setSelectedChat, socket, updateContacts, t}: LargeScreenViewProps) {
    return (
        <View style={mainChatStyles.appContainer}>
            <ChatSidebar chats={contacts} setSelectedChat={setSelectedChat} t={t} isMobile={false}/>
            {selectedContact ? socket && selectedContact && <ChatWindow chat={selectedContact} updateContacts={updateContacts} socket={socket} t={t} isMobile={false}/> : 
            <Text> Seleccione un Chat</Text>
            }
        </View>
    )
}