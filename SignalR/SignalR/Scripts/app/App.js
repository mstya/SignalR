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
        $("#inputButton").click(() => {
            self.nick = $("#nick").val();
            $("#helloMsg").text(`Hello ${self.nick}!`);
            $(".chat-row").show();
            $('#message').focus();
            $(".nick-form").hide();

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
        debugger;
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
        //alert("res");

        $(".disable-control").prop("disabled", !isEnabled);
    }
    recieveMsg(from, encryptedMessage) {
        debugger;
        var msg = this.AES.decrypt(encryptedMessage);
        //$('#discussion').append(`<li><strong>${from}</strong>: ${msg}</li>`);

        if (from === this.nick) {
            msg = `<li class="right clearfix">
                            <span class="chat-img pull-right">
                                <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
                            </span>
                            <div class="chat-body clearfix">
                                <div class="header">
                                    <small class=" text-muted">&nbsp;</small>
                                    <strong class ="pull-right primary-font">${from}</strong>
                                </div>
                                <p>
                                    ${msg}
                                </p>
                            </div>
                        </li>`;
        } else {
            msg = `<li class="left clearfix">
                            <span class="chat-img pull-left">
                                <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                            </span>
                            <div class="chat-body clearfix">
                                <div class="header">
                                    <strong class ="primary-font">${from}</strong>
                                </div>
                                <p>
                                    ${msg}
                                </p>
                            </div>
                        </li>`;
        }

        $(".chat").append(msg);
        $("#message").val("");

    }
}
