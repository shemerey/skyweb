export interface IConversation {
    id:string;
    name?:string;
}

export interface ThreadProperties {
    createdat:string; // unix
    creatorcid:string; // idk
    creator:string;// the creator's id
    topic:string; // thread topic
    joiningenabled:boolean; // duh
    capabilities:string[]; // capabilities enum thing
}

export interface ThreadMemberInfo {
    id:string;
    type:string; // = "ThreadMember"
    userLink:string; // URL
    role:string;
    capabilities:number[]; // i THINK
    linkedMri:string; // wtf
    cid: number; //idk
    userTile:string; // idk
    friendlyName:string; // well it's unused aparenly
}

export interface ThreadInfo {
    id:string;
    type:string; // = "Thread"
    properties:ThreadProperties;
    members:ThreadMemberInfo[];
    version:number;
    messages:string; // some url
}