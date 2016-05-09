class AES {
    constructor(dh) {
        this.ivLen = 16;
        this.DH = dh;
        this.sha256Service = new Sha256Service();
    }
    createCryptoKey() {
        var self = this;
        return this.sha256Service.sha256(this.DH.key).then(function (digest) {
            self.keyHash = digest;
        });
    }
    encrypt(data) {
        return Aes.Ctr.encrypt(data, self.keyHash, 256);
    }

    decrypt(data) {
        return Aes.Ctr.decrypt(data, self.keyHash, 256);
    }
}