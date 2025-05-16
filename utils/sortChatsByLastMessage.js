export const sortChatsByLastMessage = (chats) => {
    if (!(chats instanceof Array)) return [];
    return chats.sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];

        if (!lastMessageA && !lastMessageB) return 0;
        if (!lastMessageA) return 1;
        if (!lastMessageB) return -1;

        return new Date(lastMessageB.created_at).getTime() - new Date(lastMessageA.created_at).getTime();
    });
}