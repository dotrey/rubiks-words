import { Cube } from "./Cube";

let cube : Cube = null;

function buildCube() : Cube {
    let order = "ULFRBD";
    let colors : string[] = [];

    document.querySelectorAll(".cube-side input").forEach((element : HTMLInputElement) => {
        let i = order.indexOf(element.name[0]);                
        let position = i * 9 + parseInt(element.name[1]);
        colors[position] = element.value;
    });

    let cube = Cube.fromString(colors);

    return cube;
}

function rotateCube(cube : Cube) {
    let rotation = [0, 0, 0, 0, 0, 0]
    let sides = "ULFRBD";
    let list = document.querySelector("ol");
    let append = (value : string) => {
        let e = document.createElement("li");
        e.innerText = value;
        list.append(e);
        e.scrollIntoView();
    }
    append(cube.toString());
    let done : boolean = false;
    let next = () => {
        rotation[0]++;
        cube.rotate(sides[0]);
        for (let i = 0; i < 6; i++) {
            if (rotation[i] >= 4) {
                if (i + 1 >= 6) {
                    done = true;
                }else{
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
    }
    next();
}

function createButtons() {
    let button = document.createElement("button");
    button.type = "button";
    button.innerText = "start";
    button.addEventListener("click", () => {
        cube = buildCube();
        rotateCube(cube);
    })
    document.querySelector(".buttons")?.append(button);
}

function createInputs(container : HTMLElement, prefix : string) {
    for (let i = 0; i < 9; i++) {
        let e = document.createElement("input");
        e.type = "text";
        e.maxLength = 1;
        e.name = prefix + i;
        e.style.gridArea = "abcdefghi"[i];
        container.append(e);
    }
}

function fillInputs(values : string) {
    document.querySelectorAll(".cube-side input").forEach((element : HTMLInputElement, index : number) => {
        if (typeof values[index] !== "undefined") {
            element.value = values[index];
        }
    });
}

(window as any).exportInput = () => {
    let value = "";
    document.querySelectorAll(".cube-side input").forEach((element : HTMLInputElement, index : number) => {
        value += element.value || ".";
    });
    return value;
}

createButtons();
createInputs(document.querySelector(".cube-side.up"), "U");
createInputs(document.querySelector(".cube-side.left"), "L");
createInputs(document.querySelector(".cube-side.front"), "F");
createInputs(document.querySelector(".cube-side.right"), "R");
createInputs(document.querySelector(".cube-side.back"), "B");
createInputs(document.querySelector(".cube-side.down"), "D");
fillInputs("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12");
// fillInputs("012345678012345678012345678012345678012345678012345678");