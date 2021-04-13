import { Cube } from "./Cube";
import { MovePlanner } from "./MovePlanner";
import { Ui } from "./Ui";

export class Finder {
    private cube : Cube;
    private ui : Ui;
    private planner : MovePlanner;
    wordlist : string[] = [];
    
    private attempts : number = 0;
    private randomRunning : boolean = false;

    constructor() {
        this.planner = new MovePlanner();
        this.ui = new Ui(this);
        this.ui.build();
        this.ui.fillInputs("scinsushlmtmoneiyifateebneertstmrindescthekatdlnabitna");
        this.build(this.export());
    }

    build(colors : string) {
        this.cube = Cube.fromString(colors);
        this.ui.setMonospace(this.cube.pretty());
        this.ui.set3d(this.cube)
    }

    rotate(move : string) {
        if (!this.cube || !this.planner.validMove(move)) {
            return;
        }
        this.cube.rotate(move[0], move.length === 2);
        this.ui.setMonospace(this.cube.pretty());
        this.ui.set3d(this.cube)
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

    private random() {
        this.attempts++;
        let move = this.planner.randomMoveNoCcw();
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

    /**
     * Executes all moves in a given string. Invalid characters are ignored.
     * 
     * - allowDoubleLayers: if true, lower case letters will be allowed to move two layers at 
     *   once, see https://en.wikipedia.org/wiki/Rubik%27s_Cube#Move_notation
     *   Lower case f will be converted to FS, lower case b will be converted to BS'
     *   - if false, given raw moves will be converted to uppercase to improve compatibility
     * - germanNotation: if true, move-letters will be treated as german notation and converted
     *   to english notation
     * 
     * @param rawMoves 
     * @param allowDoubleLayers 
     * @param germanNotation 
     */
    executeMoves(rawMoves : string, allowDoubleLayers : boolean = false, germanNotation : boolean = false) {        
        let moves : string[] = this.planner.plan(rawMoves, allowDoubleLayers, germanNotation);

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

    export() : string {
        return this.ui.exportInput();
    }

    import(colors : string) {
        this.ui.fillInputs(colors);
    }
}