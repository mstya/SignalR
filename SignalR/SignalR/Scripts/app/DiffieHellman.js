class DiffieHellman {
    constructor() {
        this.P = 11;
        this.A = 7;
        this.generatePrivate();
    }
    generatePrivate() {
        this.X = this.getRandomIntInclusive(3, 10);
        var pow = Math.pow(this.A, this.X);
        this.Z = (pow % this.P);
    }
    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    recalculateZ(otherZ) {
        this.key = Math.pow(otherZ, this.X) % this.P;
    }
}