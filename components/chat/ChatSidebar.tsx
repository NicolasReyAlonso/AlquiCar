import React from 'react';
import { useState, useEffect } from 'react';
import { UserInterface } from '../../interfaces/User';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChatInterface } from '../../interfaces/Chat';
import {chatSidebarStyles, chatSidebarStylesMobile} from '../../css/ChatSidebar.styles';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageInterface } from '@/interfaces/Message';
import { TFunction } from 'i18next';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import ContactListElement from './ContactListElement';



interface ChatSidebarProps {
  chats: ChatInterface[];
  setSelectedChat: (chat: ChatInterface) => void;
  t: TFunction;
  isMobile: boolean;
}


export default function ChatSidebar({ chats, setSelectedChat, t, isMobile }: ChatSidebarProps) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageInterface | null>(null);

  const setUserFromStorage = async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(user ? JSON.parse(user) : null);
  }

  const getLastMessage = (messages: MessageInterface[]) => {
    if (messages.length < 1) return null;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.from_id === user?.id) return `Tú: ${lastMessage.content}`;
    return `${lastMessage.sender_name}: ${lastMessage.content}`;
  }


  useEffect(() => {
    setUserFromStorage();
  }, [])

  return (
    <View style={isMobile? chatSidebarStylesMobile.sidebar : chatSidebarStyles.sidebar}>
      <NativeViewGestureHandler>

        <ScrollView style={isMobile ? chatSidebarStylesMobile.scrollView : chatSidebarStyles.scrollView}>
          {chats.map((chat, index) => (
            <ContactListElement
              key={index}
              contact={chat}
              lastMessage={getLastMessage(chat.messages)}
              t={t}
              setSelectedChat={setSelectedChat}
              isMobile={isMobile}
              >
            </ContactListElement>
          ))}
        </ScrollView>
      </NativeViewGestureHandler>
    </View>
  );
}