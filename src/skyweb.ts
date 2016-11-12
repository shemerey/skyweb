/// <reference path="../typings/index.d.ts" />

import * as poll from './polling/poll';
import SkypeAccount from './skype_account';
import ContactsService from './contacts_service';
import * as request from 'request';
import {CookieJar} from "request";
import Login from "./login";
import Poll from "./polling/poll";
import MessageService from "./message_service";
import StatusService from "./status_service";
import AuthRequest from "./polling/auth_request";
import RequestService from "./request_service";
import Status from "./status/status";
import {Promise} from "es6-promise";

import {ThreadInfo,IConversation} from "./interfaces";

export class Skyweb {
  public messagesCallback:(messages:Array<any>)=>void;
  public authRequestCallback:(messages:Array<any>)=>void;
  public skypeAccount:SkypeAccount;
  public contactsService:ContactsService;
  public messageService:MessageService;
  private requestService:RequestService;
  private statusService:StatusService;
  /**
  * CookieJar that is used for this Skyweb instance
  */
  private cookieJar:CookieJar;

  constructor() {
    this.cookieJar = request.jar();
    this.contactsService = new ContactsService(this.cookieJar);
    this.messageService = new MessageService(this.cookieJar);
    this.requestService = new RequestService(this.cookieJar);
    this.statusService = new StatusService(this.cookieJar);
  }

  login(username: any, password: any):Promise<{}> {
    this.skypeAccount = new SkypeAccount(username, password);
    return new Login(this.cookieJar).doLogin(this.skypeAccount).then((skypeAccount:SkypeAccount)=> {
      return new Promise(this.contactsService.loadContacts.bind(this.contactsService, skypeAccount));
    }).then((skypeAccount:SkypeAccount) => {
      new Poll(this.cookieJar).pollAll(skypeAccount, (messages:Array<any>)=> {
        if (this.messagesCallback) {
          this.messagesCallback(messages);
        }
      });
      new AuthRequest(this.cookieJar).pollAll(skypeAccount, (requestData: any) => {
        if (this.authRequestCallback) {
          this.authRequestCallback(requestData);
        }
      });
      return skypeAccount;
    });
  }

  getThreadInfo(threadID: string, callback: (thread:Object) => void) {
    this.messageService.getThreadInfo(this.skypeAccount, threadID, callback);
  }

  getConversations(callback:(convos:Array<any>) => void) {
    this.messageService.getConversations(this.skypeAccount, callback);
  }

  fetchHistory(conversationId:string, callback:(messages:Array<any>) => void) {
    this.messageService.fetchHistory(this.skypeAccount, conversationId, callback);
  }

  sendMessage(conversationId:string, message:any, callback:(err:any, data:any) => void) {
    this.messageService.sendMessage(this.skypeAccount, conversationId, message, callback);
  }

  setStatus(status:Status) {
    this.statusService.setStatus(this.skypeAccount, status);
  }

  acceptAuthRequest(username: any) {
    return this.requestService.accept(this.skypeAccount, username);
  }

  declineAuthRequest(username: any) {
    return this.requestService.decline(this.skypeAccount, username);
  }
}
