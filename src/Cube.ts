export class Cube {

    /**
     * These are the 6 sides of the cube, each containing 9 individual faces.
     * The order of the sides is Up, Left, Front, Right, Back, Down arranged
     * like this:
     *   U
     * L F R B
     *   D
     * Inside the sides, the faces are ordered from left to right and top to bottom,
     * resulting in a cube like this:
     *            +––––––––––+
     *            | U0 U1 U2 |
     *            | U3 U4 U5 |
     *            | U6 U7 U8 |
     * +––––––––––+––––––––––+––––––––––+––––––––––+
     * | L0 L1 L2 | F0 F1 F2 | R0 R1 R2 | B0 B1 B2 |
     * | L3 L4 L5 | F3 F4 F5 | R3 R4 R5 | B3 B4 B5 |
     * | L6 L7 L8 | F6 F7 F8 | R6 R7 R8 | B6 B7 B8 |
     * +––––––––––+––––––––––+––––––––––+––––––––––+
     *            | D0 D1 D2 |
     *            | D3 D4 D5 |
     *            | D6 D7 D8 |
     *            +––––––––––+
     */
    private sides : string[][] = [];
    private sideOrder : string = "ULFRBD";
    // adjacent faces in the order they would rotate if the primary side is rotated clockwise
    private adjacentFaces : {[index : string]:string[]} = {
        "U" : [
            "F2", "F1", "F0", "L2", "L1", "L0", "B2", "B1", "B0", "R2", "R1", "R0"
        ],
        "L" : [
            "F0", "F3", "F6", "D0", "D3", "D6", "B8", "B5", "B2", "U0", "U3", "U6"
        ],
        "F" : [
            "U6", "U7", "U8", "R0", "R3", "R6", "D2", "D1", "D0", "L8", "L5", "L2"
        ],
        "R" : [
            "U8", "U5", "U2", "B0", "B3", "B6", "D8", "D5", "D2", "F8", "F5", "F2"
        ],
        "B" : [
            "U2", "U1", "U0", "L0", "L3", "L6", "D6", "D7", "D8", "R8", "R5", "R2"
        ],
        "D" : [
            "F6", "F7", "F8", "R6", "R7", "R8", "B6", "B7", "B8", "L6", "L7", "L8"
        ]
    }

    constructor() {
        this.sides = [];
        for (let i = 0; i < 6; i++) {
            this.sides[i] = (new Array(9)).fill(this.sideOrder[i]);
        }
    }

    get(index : string) : string {
        let {side, face} = this.getSideFace(index);
        return this.sides[side][face];
    }

    set(index : string, value : string) {
        let {side, face} = this.getSideFace(index);
        this.sides[side][face] = value;
    }

    getSideFace(index : string) : { side : number, face : number } {
        if (index.length !== 2) {
            throw new Error("Invalid index " + index);
        }
        index = index.toUpperCase();
        let r = {
            side : this.sideOrder.indexOf(index[0]),
            face : parseInt(index[1])
        };
        if (r.side < 0 || r.face < 0 || r.face > 8 || isNaN(r.face)) {
            throw new Error("Index " + index + " is out of bounds");
        }

        return r;
    }

    toString() {
        return this.sides.map((side : string[]) => {
            return side.join("");
        }).join(" ");
    }

    prettyPrint() {
        let r = 
`
         +–––––––+
         | ${this.sides[0][0]} ${this.sides[0][1]} ${this.sides[0][2]} |
         | ${this.sides[0][3]} ${this.sides[0][4]} ${this.sides[0][5]} |
         | ${this.sides[0][6]} ${this.sides[0][7]} ${this.sides[0][8]} |
 +–––––––+–––––––+–––––––+–––––––+
 | ${this.sides[1][0]} ${this.sides[1][1]} ${this.sides[1][2]} | ${this.sides[2][0]} ${this.sides[2][1]} ${this.sides[2][2]} | ${this.sides[3][0]} ${this.sides[3][1]} ${this.sides[3][2]} | ${this.sides[4][0]} ${this.sides[4][1]} ${this.sides[4][2]} |
 | ${this.sides[1][3]} ${this.sides[1][4]} ${this.sides[1][5]} | ${this.sides[2][3]} ${this.sides[2][4]} ${this.sides[2][5]} | ${this.sides[3][3]} ${this.sides[3][4]} ${this.sides[3][5]} | ${this.sides[4][3]} ${this.sides[4][4]} ${this.sides[4][5]} |
 | ${this.sides[1][6]} ${this.sides[1][7]} ${this.sides[1][8]} | ${this.sides[2][6]} ${this.sides[2][7]} ${this.sides[2][8]} | ${this.sides[3][6]} ${this.sides[3][7]} ${this.sides[3][8]} | ${this.sides[4][6]} ${this.sides[4][7]} ${this.sides[4][8]} |
 +–––––––+–––––––+–––––––+–––––––+
         | ${this.sides[5][0]} ${this.sides[5][1]} ${this.sides[5][2]} |
         | ${this.sides[5][3]} ${this.sides[5][4]} ${this.sides[5][5]} |
         | ${this.sides[5][6]} ${this.sides[5][7]} ${this.sides[5][8]} |
         +–––––––+
`;
        console.log(r);
        return r;
    }

    /**
     * Rotates the front by 90 degree. Default is clockwise rotatation, unless
     * ccw is set to true -> counter-clockwise.
     * @param side The side to rotate, e.g. "F"
     * @param ccw 
     */
    rotate(side : string, ccw : boolean = false) {
        side = side.toUpperCase();
        if (this.sideOrder.indexOf(side) < 0) {
            throw new Error("Unknown side " + side);
        }
        let changes : {[index : string] : string} = {};
        // Main rotation
        changes[side + "0"] = side + "2";
        changes[side + "1"] = side + "5";
        changes[side + "2"] = side + "8";
        changes[side + "5"] = side + "7";
        changes[side + "8"] = side + "6";
        changes[side + "7"] = side + "3";
        changes[side + "6"] = side + "0";
        changes[side + "3"] = side + "1";
        // Adjacent sides
        for (let i = 0; i < 12; i++) {
            changes[this.adjacentFaces[side][i]] = this.adjacentFaces[side][(i + 3) % 12];
        }

        if (ccw) {
            // reverse
            let tmp : {[index : string] : string} = {};
            for (let key in changes) {
                tmp[changes[key]] = key;
            }
            changes = tmp;
        }

        this.changeFaces(changes);
    }

    /**
     * Changes the values of faces as defined in given "changes", where the key
     * is the source face and the value is the target faces.
     * So a "changes" like { "U0" : "U1" } would reasign the value of U0 to U1.
     * Since there is no reassignment of U1 in this case, the value of U1 is lost.
     * To swap U0 and U1, use { "U0" : "U1", "U1" : "U0" }. This works, because all
     * changes are executed simultaenously and not in sequence.
     * @param changes 
     */
    private changeFaces(changes : {[index : string] : string}) {
        // collect values of all sources
        let sourceValues : {[index : string] : string} = {};
        for (let source in changes) {
            sourceValues[source] = this.get(source);
        }

        // assign collected values to new targets
        for (let source in changes) {
            this.set(changes[source], sourceValues[source]);
        }
    }

    /**
     * Expects a number of strings representing the colors for the individual faces, ordered
     * by side and face: ["U0", "U1", ..., "L0", ..., "F0", ..., "R0", ..., "B0", ..., "D0", ..., "D8"].
     * Missing faces will be set to ".".
     * @param colors 
     */
    static fromString(colors : string|string[]) {
        if (typeof colors === "string") {
            colors = colors.split("");
        }
        let cube = new Cube();
        for (let s : number = 0; s < 6; s++) {
            for (let f : number = 0; f < 9; f++) {
                let i = s * 9 + f;
                let val = "."
                if (typeof colors[i] !== "undefined") {
                    val = colors[i];
                }
                cube.sides[s][f] = val;
            }
        }
        return cube;
    }
}