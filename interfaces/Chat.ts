import { MessageInterface } from "./Message";

export interface ChatInterface {
    contact_id: string,
    contact_name: string,
    messages: MessageInterface[],
}