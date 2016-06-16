export interface IConversation {
    id: string;
    name?: string;
}
export interface ThreadProperties {
    createdat: string;
    creatorcid: string;
    creator: string;
    topic: string;
    joiningenabled: boolean;
    capabilities: string[];
}
export interface ThreadMemberInfo {
    id: string;
    type: string;
    userLink: string;
    role: string;
    capabilities: number[];
    linkedMri: string;
    cid: number;
    userTile: string;
    friendlyName: string;
}
export interface ThreadInfo {
    id: string;
    type: string;
    properties: ThreadProperties;
    members: ThreadMemberInfo[];
    version: number;
    messages: string;
}
