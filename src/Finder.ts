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

    start(colors : string) {
        this.cube = Cube.fromString(colors);
        this.ui.clearList();
        this.attempts = 0;
        this.random();
    }

    private random() {
        this.attempts++;
        if (this.attempts % 1000 === 0) {
            this.ui.appendList("attempt #" + this.attempts);
        }
        let move = this.randomMove();
        this.cube.rotate(move[0], move.length > 1);
        this.check();
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

    export() : string {
        return this.ui.exportInput();
    }

    import(colors : string) {
        this.ui.fillInputs(colors);
    }
}