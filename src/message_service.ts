import * as request from 'request';
import * as Consts from './consts';
import SkypeAccount from './skype_account';
import Utils from './utils';
import * as http from 'http';
import {CookieJar} from "request";

import {ThreadInfo,IConversation} from "./interfaces";

export class MessageService {
    private requestWithJar: any;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    public getThreadInfo(skypeAccount:SkypeAccount, threadID:string, callback:(threadInfo: any) => void) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/threads/' + encodeURIComponent(threadID), {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            },
            qs: {
                "view": "msnp24Equivalent"
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                let json = JSON.parse(body);
                callback(json);
            } else {
                Utils.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }

    public getConversations(skypeAccount:SkypeAccount, callback:(convos:any) => void) {

        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/', {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            },
            qs: {
                'pageSize': 20,
                'targetType': "Passport|Skype|Lync|Thread|PSTN|Agent",
                "view": "msnp24Equivalent"
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
                let json = JSON.parse(body);
                callback(json.conversations);
            } else {
                Utils.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }

    public fetchHistory(skypeAccount:SkypeAccount, conversationId:string, callback:(messages:any) => void) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            },
            qs: {
                'startTime': 0,
                 'pageSize': 51,
                 'view': 'msnp24Equivalent|supportsMessageProperties',
                 'targetType': 'Passport|Skype|Lync|Thread|PSTN',
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 200) {
              let json = JSON.parse(body);
              callback(json.messages);
            } else {
                Utils.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }

    public sendMessage(skypeAccount:SkypeAccount, conversationId:string, message:any, callback:(err:Object, data:Object) => void) {
        var requestBody = JSON.stringify({
            ///'clientmessageid': Utils.getCurrentTime() + '', //fixme looks like we don't need this?(at least if we don't want to
            // have the ability to modify text(content) of the message.)
            'content': message.text,
            'messagetype': message.messagetype || 'RichText',
            'contenttype': message.contenttype || 'text'
        });
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 201) {
                let json = JSON.parse(body);
                callback(null, json);
            } else {
                callback(error, null);
                Utils.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body
                );
            }
        });
    }
}

export default MessageService;
