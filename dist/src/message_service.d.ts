import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { ThreadInfo, IConversation } from "./interfaces";
export declare class MessageService {
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    getThreadInfo(skypeAccount: SkypeAccount, threadID: string, callback: (threadInfo: ThreadInfo) => void): void;
    getConversations(skypeAccount: SkypeAccount, callback: (convos: IConversation[]) => void): void;
    sendMessage(skypeAccount: SkypeAccount, conversationId: string, message: string, messagetype?: string, contenttype?: string): void;
}
export default MessageService;
