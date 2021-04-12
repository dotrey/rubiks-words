export class CubeFace {
    value : string = "";
    side : number = -1;
    face : number = -1;

    constructor(value : string, side : number, face : number) {
        this.value = value;
        this.side = side;
        this.face = face;
    }

    toString() {
        return this.value;
    }
}