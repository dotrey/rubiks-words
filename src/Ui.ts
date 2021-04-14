import { Cube } from "./Cube";
import { Finder } from "./Finder";

export class Ui {

    private resultList : HTMLElement;
    private monospace : HTMLElement;
    private wordlist : HTMLTextAreaElement;
    private counter : HTMLElement;
    private cubeFaces : HTMLElement[][] = [];

    constructor(private finder : Finder) {

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

    appendList(value : string) {
        if (!this.resultList) {
            this.resultList = document.querySelector("ol");
        }
        let e = document.createElement("li");
        e.innerText = value;
        this.resultList.append(e);
        e.scrollIntoView();
    }

    setMonospace(value : string) {
        if (!this.monospace) {
            this.monospace = document.querySelector(".monospace");
        }
        this.monospace.innerText = value;
    }

    set3d(cube : Cube) {
        for (let s : number = 0; s < 6; s++) {
            for (let f : number = 0; f < 9; f++) {
                let cf = cube.getFace(s, f);
                this.cubeFaces[s][f].innerText = cf.value;
                this.cubeFaces[s][f].setAttribute("data-color", "" + cf.side);
            }
        }
    }

    setCounter(value : string|number) {
        if (!this.counter) {
            return;
        }
        this.counter.innerText = "#" + value;
    }

    private createButtons() {
        let container = document.querySelector(".buttons");
        let btnCreate = document.createElement("button");
        btnCreate.type = "button";
        btnCreate.innerText = "create";
        btnCreate.addEventListener("click", () => {
            this.finder.build(this.exportInput());
        })
        container?.append(btnCreate);
        container?.append(document.createElement("br"));
        container?.append(document.createElement("br"));

        let btnImport = document.createElement("button");
        btnImport.innerText = "import";
        btnImport.type = "button";
        btnImport.addEventListener("click", () => {
            this.fillInputs(window.prompt("Provide Colors", "UUUUUUUUULLLLLLLLLFFFFFFFFFRRRRRRRRRBBBBBBBBBDDDDDDDDD"));
        })
        container?.append(btnImport);
        container?.append(" ");

        let btnExport = document.createElement("button");
        btnExport.innerText = "export";
        btnExport.type = "button";
        btnExport.addEventListener("click", () => {
            window.prompt("Current Colors:", this.exportInput());
        })
        container?.append(btnExport);

        this.createWordlist();
        this.createButtonsRotate();
        this.createButtonsExecute();
    }

    private createWordlist() {
        let container = document.querySelector(".random");
        
        let btnStartRandom = document.createElement("button");
        btnStartRandom.type = "button";
        btnStartRandom.innerText = "start random";
        btnStartRandom.addEventListener("click", () => {
            this.finder.startRandom(this.wordlist.value);
        })
        container?.append(btnStartRandom);

        container?.append(" ");
        
        let btnStopRandom = document.createElement("button");
        btnStopRandom.type = "button";
        btnStopRandom.innerText = "stop random";
        btnStopRandom.addEventListener("click", () => {
            this.finder.stopRandom();
        })
        container?.append(btnStopRandom);

        this.counter = document.createElement("span");
        container?.append(" ");
        container?.append(this.counter);


        this.wordlist = document.createElement("textarea");
        container?.append(this.wordlist);
    }

    private createButtonsRotate() {
        let container = document.querySelector(".buttons-rotate");
        let buttons : string[] = ["F", "B", "R", "L", "U", "D", "F'", "B'", "R'", "L'", "U'", "D'", "M", "E", "S", "M'", "E'", "S'"];

        for (let move of buttons) {
            let tmp = document.createElement("button");
            tmp.innerText = move;
            tmp.addEventListener("click", ((m : string) => {
                return () => {
                    this.finder.rotate(m);
                }
            })(move));
            container?.append(tmp);
        }
    }

    private createButtonsExecute() {
        let container = document.querySelector(".execute");
        let input = document.createElement("textarea");
        container?.append(input);

        let btn = document.createElement("button");
        btn.innerText = "execute";
        container?.append(btn);
        container?.append(document.createElement("br"));

        let lblDbl = document.createElement("label");
        let chkDbl = document.createElement("input");
        chkDbl.type = "checkbox";
        chkDbl.checked = true;
        lblDbl.append(chkDbl);
        lblDbl.append("2-layer");
        container?.append(lblDbl);

        let lblDe = document.createElement("label");
        let chkDe = document.createElement("input");
        chkDe.type = "checkbox";
        lblDe.append(chkDe);
        lblDe.append("de");
        container?.append(lblDe);
        
        btn.addEventListener("click", () => {
            this.finder.executeMoves(input.value, chkDbl.checked, chkDe.checked);
        });

    }

    private setup3d() {
        let container = document.querySelector(".cube3d-frame");
        if (!container) {
            return;
        }

        let startX : number = 0;
        let startY : number = 0;
        let rotationX : number = 0;
        let rotationY : number = 0;
        let mousedown : boolean = false;

        container.addEventListener("contextmenu", (event : MouseEvent) => {
            rotationX = 0;
            rotationY = 0;
            container.setAttribute("style", "--rotation-x: " + rotationX + "deg; --rotation-y: " + rotationY + "deg");
            event.preventDefault();
        });

        container.addEventListener("mousedown", (event : MouseEvent) => {
            mousedown = true;
            startX = event.clientX;
            startY = event.clientY;
        });

        container.addEventListener("mouseup", (event : MouseEvent) => {
            mousedown = false;
            let dX = event.clientX - startX;
            let dY = event.clientY - startY;

            rotationX += dY * -1;
            rotationY += dX * 1;
            container.setAttribute("style", "--rotation-x: " + rotationX + "deg; --rotation-y: " + rotationY + "deg");
        });

        container.addEventListener("mousemove", (event : MouseEvent) => {
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
        let gridArea : string = "abcdefghi";
        for (let s : number = 0; s < 6; s++) {
            this.cubeFaces[s] = [];
            let face = document.createElement("div");
            face.classList.add("face-" + faces[s]);
            cube.append(face);
            for (let f : number = 0; f < 9; f++) {
                let e = document.createElement("div");
                e.classList.add("cube-face");
                e.style.gridArea = gridArea[f];
                this.cubeFaces[s][f] = e;
                face.append(e);
            }
        }
        container.append(cube);
    }
    
    private createInputs(container : HTMLElement, prefix : string) {
        for (let i = 0; i < 9; i++) {
            let e = document.createElement("input");
            e.type = "text";
            e.maxLength = 1;
            e.name = prefix + i;
            e.style.gridArea = "abcdefghi"[i];
            container.append(e);
        }
    }
    
    fillInputs(values : string) {
        if (!values) {
            return;
        }
        document.querySelectorAll(".cube-side input").forEach((element : HTMLInputElement, index : number) => {
            if (typeof values[index] !== "undefined") {
                element.value = values[index];
            }
        });
    }
    
    exportInput(){
        let value = "";
        document.querySelectorAll(".cube-side input").forEach((element : HTMLInputElement, index : number) => {
            value += element.value || ".";
        });
        return value;
    }
}