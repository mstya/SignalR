class App {
    constructor() {
        this.DH = new DiffieHellman();
        this.AES = new AES(this.DH);
        this.signalr = new SRCommunication({
            addNewMessage: this.addNewMessage,
            onRecieveZ: function (senderConnectionId, z) {
                this.onRecieveZ(senderConnectionId, z);
            }.bind(this),
            recieveMsg: function (from, encryptedMessage) {
                this.recieveMsg(from, encryptedMessage);
            }.bind(this)
        });

        this.addHandlers();
    }
    addHandlers() {
        let self = this;
        $("#inputButton").click((event) => {
            var button = $(event.target);
            var row = button.closest(".input-row");
            self.nick = row.find("#nick").val();
            $("#helloMsg").text(`Hello ${self.nick}!`);
            row.hide().closest(".container").find(".chat-row").show();
            $('#message').focus();

            this.signalr.openConnection(function () {
                this.signalr.exchangeZ(this.DH.Z);
            }.bind(this));
        });

        $("#sendmessage").click(function () {
            var message = $("#message").val();
            var encryptedMessage = self.AES.encrypt(message);
            self.signalr.sendMessage(self.nick, encryptedMessage);
        });
    }

    onRecieveZ(senderConnectionId, z) {
        this.DH.recalculateZ(z);
        this.AES.createCryptoKey();
        this.signalr.exchangeZ(this.DH.Z);
        this.toggleSendForm(true);
    }
    htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
    toggleSendForm(isEnabled) {
        $(".disable-control").prop("disabled", !isEnabled);
    }
    recieveMsg(from, encryptedMessage) {
        var msg = this.AES.decrypt(encryptedMessage);
        $('#discussion').append(`<li><strong>${from}</strong>: ${msg}</li>`);
    }
}
