export interface Notification {
    id: string;
    user_id: string;
    type: string;
    content: string;
    seen: boolean;
    created_at: string;
}