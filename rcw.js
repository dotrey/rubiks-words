(function () {
    'use strict';

    class CubeFace {
        constructor(value, side, face) {
            this.value = "";
            this.side = -1;
            this.face = -1;
            this.value = value;
            this.side = side;
            this.face = face;
        }
        toString() {
            return this.value;
        }
    }

    class Cube {
        constructor() {
            this.sides = [];
            this.sideOrder = "ULFRBD";
            this.axis = "MES";
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
                for (let j = 0; j < 9; j++) {
                    this.sides[i] = (new Array(9)).fill(new CubeFace(this.sideOrder[i], i, j));
                }
            }
        }
        get(index) {
            let { side, face } = this.getSideFace(index);
            return this.sides[side][face];
        }
        getFace(side, face) {
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
        toString(spacer = "") {
            return this.sides.map((side) => {
                return side.map((face) => {
                    return face.value;
                }).join("");
            }).join(spacer);
        }
        pretty() {
            let r = `         +–––––––+
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
         +–––––––+`;
            return r;
        }
        prettyPrint() {
            let r = this.pretty();
            console.log(r);
            return r;
        }
        rotate(side, ccw = false) {
            side = side.toUpperCase();
            if (this.axis.indexOf(side) > -1) {
                this.rotateAxis(side, ccw);
                return;
            }
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
        rotateAxis(axis, ccw = false) {
            let changes = {};
            if (axis === "M") {
                changes["F1"] = "D1";
                changes["F4"] = "D4";
                changes["F7"] = "D7";
                changes["D1"] = "B1";
                changes["D4"] = "B4";
                changes["D7"] = "B7";
                changes["B1"] = "U1";
                changes["B4"] = "U4";
                changes["B7"] = "U7";
                changes["U1"] = "F1";
                changes["U4"] = "F4";
                changes["U7"] = "F7";
            }
            else if (axis === "E") {
                changes["F3"] = "R3";
                changes["F4"] = "R4";
                changes["F5"] = "R5";
                changes["R3"] = "B3";
                changes["R4"] = "B4";
                changes["R5"] = "B5";
                changes["B3"] = "L3";
                changes["B4"] = "L4";
                changes["B5"] = "L5";
                changes["L3"] = "F3";
                changes["L4"] = "F4";
                changes["L5"] = "F5";
            }
            else if (axis === "S") {
                changes["U3"] = "R1";
                changes["U4"] = "R4";
                changes["U5"] = "R7";
                changes["R1"] = "D5";
                changes["R4"] = "D4";
                changes["R7"] = "D3";
                changes["D3"] = "L1";
                changes["D4"] = "L4";
                changes["D5"] = "L7";
                changes["L1"] = "U5";
                changes["L4"] = "U4";
                changes["L7"] = "U3";
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
                    cube.sides[s][f] = new CubeFace(val, s, f);
                }
            }
            return cube;
        }
    }

    class Ui {
        constructor(finder) {
            this.finder = finder;
            this.cubeFaces = [];
        }
        build() {
            this.createButtons();
            this.createInputs(document.querySelector(".cube-side.up"), "U");
            this.createInputs(document.querySelector(".cube-side.left"), "L");
            this.createInputs(document.querySelector(".cube-side.front"), "F");
            this.createInputs(document.querySelector(".cube-side.right"), "R");
            this.createInputs(document.querySelector(".cube-side.back"), "B");
            this.createInputs(document.querySelector(".cube-side.down"), "D");
            this.setup3d();
        }
        clearList() {
            if (!this.resultList) {
                this.resultList = document.querySelector("ol");
            }
            this.resultList.innerHTML = "";
        }
        appendList(value) {
            if (!this.resultList) {
                this.resultList = document.querySelector("ol");
            }
            let e = document.createElement("li");
            e.innerText = value;
            this.resultList.append(e);
            e.scrollIntoView();
        }
        setMonospace(value) {
            if (!this.monospace) {
                this.monospace = document.querySelector(".monospace");
            }
            this.monospace.innerText = value;
        }
        set3d(cube) {
            for (let s = 0; s < 6; s++) {
                for (let f = 0; f < 9; f++) {
                    let cf = cube.getFace(s, f);
                    this.cubeFaces[s][f].innerText = cf.value;
                    this.cubeFaces[s][f].setAttribute("data-color", "" + cf.side);
                }
            }
        }
        setCounter(value) {
            if (!this.counter) {
                return;
            }
            this.counter.innerText = "#" + value;
        }
        createButtons() {
            let container = document.querySelector(".buttons");
            let btnCreate = document.createElement("button");
            btnCreate.type = "button";
            btnCreate.innerText = "create";
            btnCreate.addEventListener("click", () => {
                this.finder.build(this.exportInput());
            });
            container === null || container === void 0 ? void 0 : container.append(btnCreate);
            container === null || container === void 0 ? void 0 : container.append(document.createElement("br"));
            container === null || container === void 0 ? void 0 : container.append(document.createElement("br"));
            let btnImport = document.createElement("button");
            btnImport.innerText = "import";
            btnImport.type = "button";
            btnImport.addEventListener("click", () => {
                this.fillInputs(window.prompt("Provide Colors", "UUUUUUUUULLLLLLLLLFFFFFFFFFRRRRRRRRRBBBBBBBBBDDDDDDDDD"));
            });
            container === null || container === void 0 ? void 0 : container.append(btnImport);
            container === null || container === void 0 ? void 0 : container.append(" ");
            let btnExport = document.createElement("button");
            btnExport.innerText = "export";
            btnExport.type = "button";
            btnExport.addEventListener("click", () => {
                window.prompt("Current Colors:", this.exportInput());
            });
            container === null || container === void 0 ? void 0 : container.append(btnExport);
            this.createWordlist();
            this.createButtonsRotate();
            this.createButtonsExecute();
        }
        createWordlist() {
            let container = document.querySelector(".random");
            let btnStartRandom = document.createElement("button");
            btnStartRandom.type = "button";
            btnStartRandom.innerText = "start random";
            btnStartRandom.addEventListener("click", () => {
                this.finder.startRandom(this.wordlist.value);
            });
            container === null || container === void 0 ? void 0 : container.append(btnStartRandom);
            container === null || container === void 0 ? void 0 : container.append(" ");
            let btnStopRandom = document.createElement("button");
            btnStopRandom.type = "button";
            btnStopRandom.innerText = "stop random";
            btnStopRandom.addEventListener("click", () => {
                this.finder.stopRandom();
            });
            container === null || container === void 0 ? void 0 : container.append(btnStopRandom);
            this.counter = document.createElement("span");
            container === null || container === void 0 ? void 0 : container.append(" ");
            container === null || container === void 0 ? void 0 : container.append(this.counter);
            this.wordlist = document.createElement("textarea");
            container === null || container === void 0 ? void 0 : container.append(this.wordlist);
        }
        createButtonsRotate() {
            let container = document.querySelector(".buttons-rotate");
            let buttons = ["F", "B", "R", "L", "U", "D", "F'", "B'", "R'", "L'", "U'", "D'", "M", "E", "S", "M'", "E'", "S'"];
            for (let move of buttons) {
                let tmp = document.createElement("button");
                tmp.innerText = move;
                tmp.addEventListener("click", ((m) => {
                    return () => {
                        this.finder.rotate(m);
                    };
                })(move));
                container === null || container === void 0 ? void 0 : container.append(tmp);
            }
        }
        createButtonsExecute() {
            let container = document.querySelector(".execute");
            let input = document.createElement("textarea");
            container === null || container === void 0 ? void 0 : container.append(input);
            let btn = document.createElement("button");
            btn.innerText = "execute";
            container === null || container === void 0 ? void 0 : container.append(btn);
            container === null || container === void 0 ? void 0 : container.append(" ");
            let lbl = document.createElement("label");
            let chk = document.createElement("input");
            chk.type = "checkbox";
            lbl.append(chk);
            lbl.append(" de");
            container === null || container === void 0 ? void 0 : container.append(lbl);
            btn.addEventListener("click", () => {
                this.finder.executeMoves(input.value, chk.checked);
            });
        }
        setup3d() {
            let container = document.querySelector(".cube3d-frame");
            if (!container) {
                return;
            }
            let startX = 0;
            let startY = 0;
            let rotationX = 0;
            let rotationY = 0;
            let mousedown = false;
            container.addEventListener("contextmenu", (event) => {
                rotationX = 0;
                rotationY = 0;
                container.setAttribute("style", "--rotation-x: " + rotationX + "deg; --rotation-y: " + rotationY + "deg");
                event.preventDefault();
            });
            container.addEventListener("mousedown", (event) => {
                mousedown = true;
                startX = event.clientX;
                startY = event.clientY;
            });
            container.addEventListener("mouseup", (event) => {
                mousedown = false;
                let dX = event.clientX - startX;
                let dY = event.clientY - startY;
                rotationX += dY * -1;
                rotationY += dX * 1;
                container.setAttribute("style", "--rotation-x: " + rotationX + "deg; --rotation-y: " + rotationY + "deg");
            });
            container.addEventListener("mousemove", (event) => {
                if (mousedown) {
                    let dX = event.clientX - startX;
                    let dY = event.clientY - startY;
                    let rX = rotationX + dY * -1;
                    let rY = rotationY + dX * 1;
                    container.setAttribute("style", "--rotation-x: " + rX + "deg; --rotation-y: " + rY + "deg");
                }
            });
            let faces = [
                "up", "left", "front", "right", "back", "down"
            ];
            let cube = document.createElement("div");
            cube.classList.add("cube3d");
            let gridArea = "abcdefghi";
            for (let s = 0; s < 6; s++) {
                this.cubeFaces[s] = [];
                let face = document.createElement("div");
                face.classList.add("face-" + faces[s]);
                cube.append(face);
                for (let f = 0; f < 9; f++) {
                    let e = document.createElement("div");
                    e.classList.add("cube-face");
                    e.style.gridArea = gridArea[f];
                    this.cubeFaces[s][f] = e;
                    face.append(e);
                }
            }
            container.append(cube);
        }
        createInputs(container, prefix) {
            for (let i = 0; i < 9; i++) {
                let e = document.createElement("input");
                e.type = "text";
                e.maxLength = 1;
                e.name = prefix + i;
                e.style.gridArea = "abcdefghi"[i];
                container.append(e);
            }
        }
        fillInputs(values) {
            if (!values) {
                return;
            }
            document.querySelectorAll(".cube-side input").forEach((element, index) => {
                if (typeof values[index] !== "undefined") {
                    element.value = values[index];
                }
            });
        }
        exportInput() {
            let value = "";
            document.querySelectorAll(".cube-side input").forEach((element, index) => {
                value += element.value || ".";
            });
            return value;
        }
    }

    class Finder {
        constructor() {
            this.wordlist = [];
            this.moveset = ["F", "R", "U", "L", "B", "D", "M", "E", "S", "F'", "R'", "U'", "L'", "B'", "D'", "M'", "E'", "S'"];
            this.germanMovesetMap = {
                "V": "F",
                "H": "B",
                "L": "L",
                "R": "R",
                "U": "D",
                "O": "U"
            };
            this.attempts = 0;
            this.randomRunning = false;
            this.ui = new Ui(this);
            this.ui.build();
            this.ui.fillInputs("scinsushlmtmoneiyifateebneertstmrindescthekatdlnabitna");
            this.build(this.export());
        }
        build(colors) {
            this.cube = Cube.fromString(colors);
            this.ui.setMonospace(this.cube.pretty());
            this.ui.set3d(this.cube);
        }
        rotate(move) {
            if (!this.cube || this.moveset.indexOf(move) < 0) {
                return;
            }
            this.cube.rotate(move[0], move.length === 2);
            this.ui.setMonospace(this.cube.pretty());
            this.ui.set3d(this.cube);
        }
        startRandom(rawWords) {
            if (!this.cube) {
                return;
            }
            this.wordlist = rawWords.split(",").map((value) => {
                return value.trim().toLowerCase();
            });
            this.ui.clearList();
            this.attempts = 0;
            this.randomRunning = true;
            this.random();
        }
        random() {
            this.attempts++;
            let move = this.randomMoveNoCcw();
            this.cube.rotate(move[0], move.length > 1);
            this.check();
            this.ui.setMonospace(this.cube.pretty());
            this.ui.set3d(this.cube);
            this.ui.setCounter(this.attempts);
            if (this.randomRunning) {
                window.requestAnimationFrame(() => {
                    this.random();
                });
            }
        }
        stopRandom() {
            this.randomRunning = false;
        }
        executeMoves(rawMoves, germanMap = false) {
            if (germanMap) {
                for (let de in this.germanMovesetMap) {
                    rawMoves = rawMoves.replace(new RegExp(de, "g"), this.germanMovesetMap[de]);
                }
            }
            rawMoves = rawMoves.replace(/2'/g, "'2");
            let moves = [];
            for (let i = 0, ic = rawMoves.length; i < ic; i++) {
                let tmp = rawMoves[i];
                if (tmp === "'" && moves.length > 0) {
                    if (moves[moves.length - 1].length === 1) {
                        moves[moves.length - 1] += "'";
                    }
                }
                else if (tmp === "2" && moves.length > 0) {
                    moves.push(moves[moves.length - 1]);
                }
                else if (this.moveset.indexOf(tmp) > -1) {
                    moves.push(tmp);
                }
                else if (tmp.trim()) {
                    console.log("unknown move: '" + tmp + "'");
                }
            }
            console.log("executing moves: " + moves.join(" "));
            let executor = () => {
                if (!moves.length) {
                    return;
                }
                this.rotate(moves.shift());
                window.requestAnimationFrame(executor);
            };
            executor();
        }
        check() {
            let value = this.cube.toString();
            let double = value + value;
            let reversed = double.split("").reverse().join("");
            value = this.cube.toString(" ");
            for (let word of this.wordlist) {
                if (!word) {
                    continue;
                }
                if (double.indexOf(word) > -1) {
                    this.ui.appendList(value + " -> " + word);
                }
                if (reversed.indexOf(word) > -1) {
                    this.ui.appendList(value + " <- " + word);
                }
            }
        }
        randomMove() {
            return this.moveset[Math.floor(Math.random() * this.moveset.length)];
        }
        randomMoveNoCcw() {
            return this.moveset[Math.floor(Math.random() * this.moveset.length * 0.5)];
        }
        export() {
            return this.ui.exportInput();
        }
        import(colors) {
            this.ui.fillInputs(colors);
        }
    }

    window.rcw = new Finder();

}());
