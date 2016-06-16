import SkypeAccount from './skype_account';
import { CookieJar } from "request";
import { IContact } from "./interfaces";
export declare class ContactsService {
    contacts: IContact[];
    private requestWithJar;
    constructor(cookieJar: CookieJar);
    loadContacts(skypeAccount: SkypeAccount, resolve: (skypeAccount: SkypeAccount, contacts: Array<{}>) => {}, reject: any): void;
}
export default ContactsService;
