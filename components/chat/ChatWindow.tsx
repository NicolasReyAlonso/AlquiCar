import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { ChatInterface } from "../../interfaces/Chat";
import { UserInterface } from '../../interfaces/User';
import { Socket } from 'socket.io-client';
import { MessageInterface } from '../../interfaces/Message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, ScrollView } from 'react-native';
import chatWindowStyles from '../../css/ChatWindow.styles';
import { TouchableOpacity, NativeViewGestureHandler } from 'react-native-gesture-handler';
import { TFunction, use } from 'i18next';
import { useFocusEffect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';


interface ChatWindowProps {
    chat: ChatInterface,
    socket: Socket,
    updateContacts: (id: string, messages: MessageInterface[]) => void,
    t: TFunction;
    isMobile: boolean;
    setSelectedContact?: (contact: ChatInterface | null) => void;
}


export default function ChatWindow({ chat, socket, updateContacts, t, isMobile, setSelectedContact }: ChatWindowProps) {
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [scrollToEndAnimation, setScrollToEndAnimation] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const getUser = async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(user ? JSON.parse(user) : null);
    }

    useEffect(() => {
        getUser();
        setMessages(chat.messages);
    }, [chat]);



    const handleSendMessage = () => {

        if (messageInput.length < 1) return;
        if (!user) return;

        const newMessage = {
            content: messageInput,
            from_id: user.id,
            sender_name: user.name,
            to_id: chat.contact_id,
            status: 'sent',
            created_at: new Date().toISOString(),
        }

        const nuevo = [...messages, newMessage];

        setMessages(nuevo);
        setMessageInput('');

        socket.emit("send message", {
            newMessage,
        });
        updateContacts(chat.contact_id, [newMessage])

    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }


    return (
        <View style={chatWindowStyles.chatContainer}>
            <View style={chatWindowStyles.header}>
                {isMobile && <TouchableOpacity onPress={() => {
                    if (setSelectedContact) setSelectedContact(null);
                }}>
                    <FontAwesome5 name="arrow-left" size={24} color="white" />
                </TouchableOpacity>}
                <Text style={chatWindowStyles.contactName}>{chat.contact_name}</Text>
            </View>
            <NativeViewGestureHandler>

                <ScrollView
                    ref={scrollViewRef}
                    style={chatWindowStyles.chatMessages}
                    onContentSizeChange={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: false });
                    }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >

                    {messages.length < 1 ? (
                        <Text style={chatWindowStyles.noMessages}>{t('Chat.noMessages')}</Text>
                    ) : (
                        user && messages.map((message, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        chatWindowStyles.message,
                                        message.from_id === user.id ? chatWindowStyles.mine : chatWindowStyles.other
                                    ]}
                                >
                                    {message.from_id === user.id ? (
                                        <Text style={chatWindowStyles.senderName}>Tú</Text>
                                    ) : (
                                        <Text style={chatWindowStyles.senderName}>{message.sender_name}</Text>
                                    )}
                                    <Text style={chatWindowStyles.messageContent}>{message.content}</Text>
                                    <Text style={chatWindowStyles.messageTime}>{formatDate(message.created_at)}</Text>
                                </View>
                            )
                        })
                    )}
                </ScrollView>
            </NativeViewGestureHandler>

            <View style={chatWindowStyles.inputContainer}>
                <TextInput
                    style={chatWindowStyles.inputField}
                    placeholder={t('Chat.write')}
                    onChangeText={(text) => setMessageInput(text)}
                    value={messageInput}
                />
                <TouchableOpacity style={chatWindowStyles.sendButton} onPress={() => handleSendMessage()}>
                    <Text style={chatWindowStyles.sendButtonText}>{t('Chat.send')}</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
