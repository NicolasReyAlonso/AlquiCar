export interface MessageInterface {
    id?:number,
    content: string,
    from_id: string,
    sender_name: string,
    to_id: string,
    status: 'Sent' | 'Delivered' | 'Read' | string,
    created_at: string,
}