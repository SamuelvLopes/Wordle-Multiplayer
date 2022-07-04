import {CellState} from "./CellState.js";
import {TicTacToe} from "./TicTacToe.js";
import {Player} from "./Player.js";
import {Cell} from "./Cell.js";

function GUI() {
    let game;
    function registerEvents() {
        init();
    }
    function init() {
        game = new TicTacToe();
        let tab = game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < tab[i].length; j++) {
                let td = document.createElement("td");
                td.onclick = play;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        changeMessage();
    }
    function coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    function setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    function changeMessage(m) {
        let objs = {DRAW: "Draw!", PLAYER2: "'O' win!", PLAYER1: "'X' win!"};
        if (objs[m]) {
            setMessage(`Game Over! ${objs[m]}`);
        } else {
            let msgs = {PLAYER1: "'X' turn.", PLAYER2: "'O' turn."};
            setMessage(msgs[game.getTurn()]);
        }
    }
    function play() {
        let cell = coordinates(this);
        try {
            let mr = game.move(cell);
            this.textContent = game.getTurn() === Player.PLAYER1 ? "O" : "X";
            changeMessage(mr);
        } catch (ex) {
            setMessage(ex.message);
        }
    }
    return {registerEvents};
}
let gui = new GUI();
gui.registerEvents();