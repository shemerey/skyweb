"use strict";
var request = require("request");
var Consts = require("./consts");
var utils_1 = require("./utils");
var MessageService = (function () {
    function MessageService(cookieJar) {
        this.requestWithJar = request.defaults({ jar: cookieJar });
    }
    MessageService.prototype.getThreadInfo = function (skypeAccount, threadID, callback) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/threads/' + encodeURIComponent(threadID), {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            },
            qs: {
                "view": "msnp24Equivalent"
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var json = JSON.parse(body);
                callback(json);
            }
            else {
                utils_1.default.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    MessageService.prototype.getConversations = function (skypeAccount, callback) {
        this.requestWithJar.get(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/', {
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            },
            qs: {
                'pageSize': 200,
                'targetType': "Passport|Skype|Lync|Thread|PSTN|Agent",
                "view": "msnp24Equivalent"
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var json = JSON.parse(body);
                callback(json.conversations);
            }
            else {
                utils_1.default.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    MessageService.prototype.sendMessage = function (skypeAccount, conversationId, message, messagetype, contenttype) {
        var requestBody = JSON.stringify({
            'content': message,
            'messagetype': messagetype || 'RichText',
            'contenttype': contenttype || 'text'
        });
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 201) {
            }
            else {
                utils_1.default.throwError('Failed to send message.' +
                    '.\n Error code: ' + response.statusCode +
                    '.\n Error: ' + error +
                    '.\n Body: ' + body);
            }
        });
    };
    return MessageService;
}());
exports.MessageService = MessageService;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageService;
//# sourceMappingURL=message_service.js.map