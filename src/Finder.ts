import { Cube } from "./Cube";
import { Ui } from "./Ui";

export class Finder {
    private cube : Cube;
    private ui : Ui;
    wordlist : string[] = [];
    private moveset : string[] = ["F", "R", "U", "L", "B", "D", "M", "E", "S", "F'", "R'", "U'", "L'", "B'", "D'", "M'", "E'", "S'"];
    private germanMovesetMap : {[index : string] : string} = {
        "V" : "F",
        "H" : "B",
        "L" : "L",
        "R" : "R",
        "U" : "D",
        "O" : "U"
    };
    private attempts : number = 0;
    private randomRunning : boolean = false;

    constructor() {
        this.ui = new Ui(this);
        this.ui.build();
        this.ui.fillInputs("scinsushlmtmoneiyifateebneertstmrindescthekatdlnabitna");
    }

    build(colors : string) {
        this.cube = Cube.fromString(colors);
        this.ui.setMonospace(this.cube.prettyPrint());
    }

    rotate(move : string) {
        if (!this.cube || this.moveset.indexOf(move) < 0) {
            return;
        }
        this.cube.rotate(move[0], move.length === 2);
        this.ui.setMonospace(this.cube.prettyPrint());
    }

    startRandom(rawWords : string) {
        if (!this.cube) {
            return;
        }
        this.wordlist = rawWords.split(",").map((value : string) => {
            return value.trim().toLowerCase();
        });
        this.ui.clearList();
        this.attempts = 0;
        this.randomRunning = true;
        this.random();
    }

    stopRandom() {
        this.randomRunning = false;
    }

    executeMoves(rawMoves : string, germanMap : boolean = false) {
        if (germanMap) {
            for (let de in this.germanMovesetMap) {
                rawMoves = rawMoves.replace(new RegExp(de, "g"), this.germanMovesetMap[de]);
            }
        }

        let moves : string[] = [];
        for (let i = 0, ic = rawMoves.length; i < ic; i++) {
            let tmp = rawMoves[i];
            if (tmp === "'" && moves.length > 0) {
                if (moves[moves.length - 1].length === 1) {
                    moves[moves.length - 1] += "'";
                }
            }else if (this.moveset.indexOf(tmp) > -1) {
                moves.push(tmp)
            }
        }

        console.log("executing moves: " + moves.join(" "));
        let executor = () => {
            if (!moves.length) {
                return;
            }
            this.rotate(moves.shift());
            window.requestAnimationFrame(executor);
        }
        executor();
    }

    private random() {
        this.attempts++;
        let move = this.randomMoveNoCcw();
        this.cube.rotate(move[0], move.length > 1);
        this.check();
        this.ui.setMonospace(this.cube.prettyPrint());
        this.ui.setCounter(this.attempts);
        if (this.randomRunning) {
            window.requestAnimationFrame(() => {
                this.random();
            });
        }
    }

    private check() {
        let value = this.cube.toString();
        // duplicate to avoid missing a word if it stretches over the end+start
        let double = value + value;
        let reversed = double.split("").reverse().join("");
        value = this.cube.toString(" ");
        // check for the words in the list and print strings with matches
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

    private randomMove() : string {
        return this.moveset[Math.floor(Math.random() * this.moveset.length)];
    }

    private randomMoveNoCcw() : string {
        return this.moveset[Math.floor(Math.random() * this.moveset.length * 0.5)];
    }

    export() : string {
        return this.ui.exportInput();
    }

    import(colors : string) {
        this.ui.fillInputs(colors);
    }
}