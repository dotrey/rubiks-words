export class MovePlanner {
    private moveset : string[] = ["F", "R", "U", "L", "B", "D", "M", "E", "S", "F'", "R'", "U'", "L'", "B'", "D'", "M'", "E'", "S'"];
    private germanMovesetMap : {[index : string] : string} = {
        "V" : "F",
        "H" : "B",
        "L" : "L",
        "R" : "R",
        "U" : "D",
        "O" : "U",
        "v" : "f",
        "h" : "b",
        "l" : "l",
        "r" : "r",
        "u" : "d",
        "o" : "u"
    };

    validMove(move : string) {
        return this.moveset.indexOf(move) > -1;
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
    plan(rawMoves : string, allowDoubleLayers : boolean = false, germanNotation : boolean = false) : string[] {
        // for double-moves the notation must be X2, where X is the original move
        // -> R'R' must be written as R'2 and not R2'
        // -> we correct this here
        rawMoves = rawMoves.replace(/2'/g, "'2");

        if (germanNotation) {
            rawMoves = this.convertGermanNotation(rawMoves);
        }

        if (allowDoubleLayers) {
            rawMoves = this.convertDoubleLayerMoves(rawMoves);
        }else{
            rawMoves = rawMoves.toUpperCase()
        }

        let moves : string[] = [];
        for (let i = 0, ic = rawMoves.length; i < ic; i++) {
            let tmp = rawMoves[i];
            if (tmp === "'" && moves.length > 0) {
                if (moves[moves.length - 1].length === 1) {
                    moves[moves.length - 1] += "'";
                }
            }else if (tmp === "2" && moves.length > 0) {
                moves.push(moves[moves.length - 1]);
            }else if (this.moveset.indexOf(tmp) > -1) {
                moves.push(tmp);
            }else if (tmp.trim()) {
                console.log("unknown move: '" + tmp + "'");
            }
        }

        return moves;
    }

    /**
     * Converts moves in German notation to English notation.
     * Note that German notation is contains ambigous U/u, so don't use on English notation!
     * @param moves 
     * @returns 
     */
    private convertGermanNotation(moves : string) : string {
        for (let de in this.germanMovesetMap) {
            moves = moves.replace(new RegExp(de, "g"), this.germanMovesetMap[de]);
        }
        return moves;
    }

    private convertDoubleLayerMoves(moves : string) : string {
        // duplicate double moves
        moves = moves.replace(/([fbudlr]'?)2/g, "$1$1");

        // two front layers = Front and Standing
        moves = moves.replace(/f'/g, "F'S'");
        moves = moves.replace(/f/g, "FS");

        // two back layers = Back and Standing CCW
        moves = moves.replace(/b'/g, "B'S");
        moves = moves.replace(/b/g, "BS'");

        // two top layers = Up and Equator CCW
        moves = moves.replace(/u'/g, "U'E");
        moves = moves.replace(/u/g, "UE'");

        // two bottom layers = Down and Equator
        moves = moves.replace(/d'/g, "D'E'");
        moves = moves.replace(/d/g, "DE");

        // two left layers = Left and Middle
        moves = moves.replace(/l'/g, "L'M'");
        moves = moves.replace(/l/g, "LM");

        // two right layers = Right and Middle CCW
        moves = moves.replace(/r'/g, "R'M");
        moves = moves.replace(/r/g, "RM'");

        return moves;
    }

    randomMove() : string {
        return this.moveset[Math.floor(Math.random() * this.moveset.length)];
    }

    randomMoveNoCcw() : string {
        return this.moveset[Math.floor(Math.random() * this.moveset.length * 0.5)];
    }
}