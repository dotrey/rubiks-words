import { Finder } from "./Finder";

export class Ui {

    private resultList : HTMLElement;
    private monospace : HTMLElement;
    private wordlist : HTMLTextAreaElement;
    private counter : HTMLElement;

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
        container?.append(" ");

        let lbl = document.createElement("label");
        let chk = document.createElement("input");
        chk.type = "checkbox";
        lbl.append(chk);
        lbl.append(" de");
        container?.append(lbl);

        
        btn.addEventListener("click", () => {
            this.finder.executeMoves(input.value, chk.checked);
        });

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