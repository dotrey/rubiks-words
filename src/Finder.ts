import { Cube } from "./Cube";
import { Ui } from "./Ui";

export class Finder {
    private cube : Cube;
    private ui : Ui;
    wordlist : string[] = [];
    private moveset : string[] = ["F", "R", "U", "L", "B", "D", "F'", "R'", "U'", "L'", "B'", "D'"];
    private attempts : number = 0;
    maxAttempts : number = 10000;

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

    startRandom() {
        if (!this.cube) {
            return;
        }
        this.ui.clearList();
        this.attempts = 0;
        this.random();
    }

    private random() {
        this.attempts++;
        if (this.attempts % 1000 === 0) {
            this.ui.appendList("attempt #" + this.attempts);
        }
        let move = this.randomMoveNoCcw();
        this.cube.rotate(move[0], move.length > 1);
        this.check();
        this.ui.setMonospace(this.cube.prettyPrint());
        if (this.attempts < this.maxAttempts) {
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