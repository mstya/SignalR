class SRCommunication {
    constructor(options) {
        this.chatHub = $.connection.chatHub;
        this.chatHub.client.addNewMessageToPage = options.addNewMessage;
        this.chatHub.client.recieveZ = options.onRecieveZ;
        this.chatHub.client.recieveMsg = options.recieveMsg;
    }
    openConnection(callback) {
        $.connection.hub.start().done(function () {
            callback && callback();
        });
    }
    exchangeZ(z) {
        this.chatHub.server.exchangeZ(z);
    }
    sendMessage(name, msg) {
        this.chatHub.server.sendMsg(name, msg);
    }
}