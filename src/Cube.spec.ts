import { expect } from "chai";
import "mocha";
import { Cube } from "./Cube";

describe("Cube", () => {

    it("create from string", () => {
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12";
        let cube = Cube.fromString(str);
        expect(cube.toString().replace(/\s/g, "")).to.equal(str);
    });

    it("rotates", () => {
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12";
        let cube = Cube.fromString(str);
        expect(cube.toString().replace(/\s/g, "")).to.equal(str);

        let sides : string[] = "ULFRBDMES".split("");
        for(let side of sides) {
            // rotate back and forth
            cube.rotate(side);
            cube.rotate(side, true);
            
            expect(cube.toString().replace(/\s/g, "")).to.equal(str);
            
            // rotate full circle
            cube.rotate(side);
            cube.rotate(side);
            cube.rotate(side);
            cube.rotate(side);
            expect(cube.toString().replace(/\s/g, "")).to.equal(str);
        }
    });

    it("rotate complex", () => {
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12";
        let cube = Cube.fromString(str);
        expect(cube.toString().replace(/\s/g, "")).to.equal(str);

        let sides : string[] = "ULFRBDMES".split("");
        for(let side of sides) {
            cube.rotate(side);
        }
        for(let side of sides.reverse()) {
            cube.rotate(side, true);
        }
        expect(cube.toString().replace(/\s/g, "")).to.equal(str);

    })
});