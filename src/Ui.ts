import { Finder } from "./Finder";

export class Ui {

    private resultList : HTMLElement;
    private monospace : HTMLElement;

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

    private createButtons() {
        let btns1 = document.querySelector(".buttons-main");
        let btnCreate = document.createElement("button");
        btnCreate.type = "button";
        btnCreate.innerText = "create";
        btnCreate.addEventListener("click", () => {
            this.finder.build(this.exportInput());
        })
        btns1?.append(btnCreate);
        
        let btnRandom = document.createElement("button");
        btnRandom.type = "button";
        btnRandom.innerText = "random";
        btnRandom.addEventListener("click", () => {
            this.finder.startRandom();
        })
        btns1?.append(btnRandom);

        let btns2 = document.querySelector(".buttons-rotate");
        let buttons : {[index : string] : string} = {
            "F" : "Front",
            "R" : "Right",
            "U" : "Up",
            "L" : "Left",
            "B" : "Back",
            "D" : "Down",
            "F'" : "Front CCW",
            "R'" : "Right CCW",
            "U'" : "Up CCW",
            "L'" : "Left CCW",
            "B'" : "Back CCW",
            "D'" : "Down CCW"
        }

        for (let key in buttons) {
            let tmp = document.createElement("button");
            tmp.innerText = buttons[key];
            tmp.addEventListener("click", ((m : string) => {
                return () => {
                    this.finder.rotate(m);
                }
            })(key));
            btns2?.append(tmp);
        }
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