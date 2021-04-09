import { Finder } from "./Finder";

export class Ui {

    private resultList : HTMLElement;

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

    private createButtons() {
        let button = document.createElement("button");
        button.type = "button";
        button.innerText = "start";
        button.addEventListener("click", () => {
            this.finder.start(this.exportInput());
        })
        document.querySelector(".buttons")?.append(button);
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