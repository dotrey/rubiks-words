(function () {
    'use strict';

    class Cube {
        constructor() {
            this.sides = [];
            this.sideOrder = "ULFRBD";
            this.adjacentFaces = {
                "U": [
                    "F2", "F1", "F0", "L2", "L1", "L0", "B2", "B1", "B0", "R2", "R1", "R0"
                ],
                "L": [
                    "F0", "F3", "F6", "D0", "D3", "D6", "B8", "B5", "B2", "U0", "U3", "U6"
                ],
                "F": [
                    "U6", "U7", "U8", "R0", "R3", "R6", "D2", "D1", "D0", "L8", "L5", "L2"
                ],
                "R": [
                    "U8", "U5", "U2", "B0", "B3", "B6", "D8", "D5", "D2", "F8", "F5", "F2"
                ],
                "B": [
                    "U2", "U1", "U0", "L0", "L3", "L6", "D6", "D7", "D8", "R8", "R5", "R2"
                ],
                "D": [
                    "F6", "F7", "F8", "R6", "R7", "R8", "B6", "B7", "B8", "L6", "L7", "L8"
                ]
            };
            this.sides = [];
            for (let i = 0; i < 6; i++) {
                this.sides[i] = (new Array(9)).fill(this.sideOrder[i]);
            }
        }
        get(index) {
            let { side, face } = this.getSideFace(index);
            return this.sides[side][face];
        }
        set(index, value) {
            let { side, face } = this.getSideFace(index);
            this.sides[side][face] = value;
        }
        getSideFace(index) {
            if (index.length !== 2) {
                throw new Error("Invalid index " + index);
            }
            index = index.toUpperCase();
            let r = {
                side: this.sideOrder.indexOf(index[0]),
                face: parseInt(index[1])
            };
            if (r.side < 0 || r.face < 0 || r.face > 8 || isNaN(r.face)) {
                throw new Error("Index " + index + " is out of bounds");
            }
            return r;
        }
        toString() {
            return this.sides.map((side) => {
                return side.join("");
            }).join(" ");
        }
        prettyPrint() {
            let r = `
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
        rotate(side, ccw = false) {
            side = side.toUpperCase();
            if (this.sideOrder.indexOf(side) < 0) {
                throw new Error("Unknown side " + side);
            }
            let changes = {};
            changes[side + "0"] = side + "2";
            changes[side + "1"] = side + "5";
            changes[side + "2"] = side + "8";
            changes[side + "5"] = side + "7";
            changes[side + "8"] = side + "6";
            changes[side + "7"] = side + "3";
            changes[side + "6"] = side + "0";
            changes[side + "3"] = side + "1";
            for (let i = 0; i < 12; i++) {
                changes[this.adjacentFaces[side][i]] = this.adjacentFaces[side][(i + 3) % 12];
            }
            if (ccw) {
                let tmp = {};
                for (let key in changes) {
                    tmp[changes[key]] = key;
                }
                changes = tmp;
            }
            this.changeFaces(changes);
        }
        changeFaces(changes) {
            let sourceValues = {};
            for (let source in changes) {
                sourceValues[source] = this.get(source);
            }
            for (let source in changes) {
                this.set(changes[source], sourceValues[source]);
            }
        }
        static fromString(colors) {
            if (typeof colors === "string") {
                colors = colors.split("");
            }
            let cube = new Cube();
            for (let s = 0; s < 6; s++) {
                for (let f = 0; f < 9; f++) {
                    let i = s * 9 + f;
                    let val = ".";
                    if (typeof colors[i] !== "undefined") {
                        val = colors[i];
                    }
                    cube.sides[s][f] = val;
                }
            }
            return cube;
        }
    }

    let cube = null;
    function buildCube() {
        let order = "ULFRBD";
        let colors = [];
        document.querySelectorAll(".cube-side input").forEach((element) => {
            let i = order.indexOf(element.name[0]);
            let position = i * 9 + parseInt(element.name[1]);
            colors[position] = element.value;
        });
        let cube = Cube.fromString(colors);
        return cube;
    }
    function rotateCube(cube) {
        let rotation = [0, 0, 0, 0, 0, 0];
        let sides = "ULFRBD";
        let list = document.querySelector("ol");
        let append = (value) => {
            let e = document.createElement("li");
            e.innerText = value;
            list.append(e);
            e.scrollIntoView();
        };
        append(cube.toString());
        let done = false;
        let next = () => {
            rotation[0]++;
            cube.rotate(sides[0]);
            for (let i = 0; i < 6; i++) {
                if (rotation[i] >= 4) {
                    if (i + 1 >= 6) {
                        done = true;
                    }
                    else {
                        rotation[i] = 0;
                        cube.rotate(sides[i + 1]);
                        rotation[i + 1]++;
                    }
                }
            }
            append(cube.toString());
            if (!done) {
                window.requestAnimationFrame(next);
            }
        };
        next();
    }
    function createButtons() {
        var _a;
        let button = document.createElement("button");
        button.type = "button";
        button.innerText = "start";
        button.addEventListener("click", () => {
            cube = buildCube();
            rotateCube(cube);
        });
        (_a = document.querySelector(".buttons")) === null || _a === void 0 ? void 0 : _a.append(button);
    }
    function createInputs(container, prefix) {
        for (let i = 0; i < 9; i++) {
            let e = document.createElement("input");
            e.type = "text";
            e.maxLength = 1;
            e.name = prefix + i;
            e.style.gridArea = "abcdefghi"[i];
            container.append(e);
        }
    }
    function fillInputs(values) {
        document.querySelectorAll(".cube-side input").forEach((element, index) => {
            if (typeof values[index] !== "undefined") {
                element.value = values[index];
            }
        });
    }
    window.exportInput = () => {
        let value = "";
        document.querySelectorAll(".cube-side input").forEach((element, index) => {
            value += element.value || ".";
        });
        return value;
    };
    createButtons();
    createInputs(document.querySelector(".cube-side.up"), "U");
    createInputs(document.querySelector(".cube-side.left"), "L");
    createInputs(document.querySelector(".cube-side.front"), "F");
    createInputs(document.querySelector(".cube-side.right"), "R");
    createInputs(document.querySelector(".cube-side.back"), "B");
    createInputs(document.querySelector(".cube-side.down"), "D");
    fillInputs("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12");

}());
