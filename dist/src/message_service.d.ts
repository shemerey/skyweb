import SkypeAccount from './skype_account';
import { CookieJar } from "request";
export declare class MessageService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    getThreadInfo(skypeAccount: SkypeAccount, threadID: string, callback: (threadInfo: any) => void): void;
    getConversations(skypeAccount: SkypeAccount, callback: (convos: any) => void): void;
    fetchHistory(skypeAccount: SkypeAccount, conversationId: string, callback: (messages: any) => void): void;
    sendMessage(skypeAccount: SkypeAccount, conversationId: string, message: string, messagetype?: string, contenttype?: string): void;
}
export default MessageService;
