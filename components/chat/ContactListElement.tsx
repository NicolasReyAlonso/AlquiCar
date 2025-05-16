import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ChatInterface } from '../../interfaces/Chat';
import { TFunction } from 'i18next';
import {chatSidebarStyles, chatSidebarStylesMobile} from '../../css/ChatSidebar.styles';




interface ContactListElementProps {
    contact: ChatInterface;
    lastMessage: string | null;
    t: TFunction;
    setSelectedChat: (chat: ChatInterface) => void;
    isMobile: boolean;
}

export default function ContactListElement({ contact, lastMessage, t, setSelectedChat, isMobile }: ContactListElementProps) {
    
    
    return (
        <TouchableOpacity
              key={contact.contact_id}
              style={chatSidebarStyles.contactCard}
              onPress={() => {
                setSelectedChat(contact);
              }}
            >
              <Text style={chatSidebarStyles.contactName}>{contact.contact_name}</Text>
              {
                lastMessage ?
                  <Text style={chatSidebarStyles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
                  :
                  <Text style={chatSidebarStyles.lastMessage}>{t("Chat.noMessages")}</Text>

              }
            </TouchableOpacity>
    )
}