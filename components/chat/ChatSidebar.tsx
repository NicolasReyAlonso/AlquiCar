import React from 'react';
import { useState, useEffect } from 'react';
import { UserInterface } from '../../interfaces/User';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChatInterface } from '../../interfaces/Chat';
import chatSidebarStyles from '../../css/ChatSidebar.styles';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageInterface } from '@/interfaces/Message';
import { TFunction } from 'i18next';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';



interface ChatSidebarProps {
  chats: ChatInterface[];
  setSelectedChat: (chat: ChatInterface) => void;
  t: TFunction;
}


export default function ChatSidebar({ chats, setSelectedChat, t }: ChatSidebarProps) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageInterface | null>(null);

  const setUserFromStorage = async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(user ? JSON.parse(user) : null);
  }

  const getSenderAndLastMessage = (messages: MessageInterface[]) => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.from_id === user?.id) return `Tú: ${lastMessage.content}`;
    return `${lastMessage.sender_name}: ${lastMessage.content}`;
  }


  useEffect(() => {
    setUserFromStorage();
  }, [])

  return (
    <View style={chatSidebarStyles.sidebar}>
      <NativeViewGestureHandler>

        <ScrollView style={chatSidebarStyles.scrollView}>
          {chats.map((chat, index) => (
            <TouchableOpacity
              key={index}
              style={chatSidebarStyles.contactCard}
              onPress={() => {
                setSelectedChat(chat);
              }}
            >
              <Text style={chatSidebarStyles.contactName}>{chat.contact_name}</Text>
              {
                (chat.messages.length > 0) ?
                  <Text style={chatSidebarStyles.lastMessage}>{getSenderAndLastMessage(chat.messages)}</Text>
                  :
                  <Text style={chatSidebarStyles.lastMessage}>{t("Chat.noMessages")}</Text>

              }
            </TouchableOpacity>
          ))}
        </ScrollView>
      </NativeViewGestureHandler>
    </View>
  );
}