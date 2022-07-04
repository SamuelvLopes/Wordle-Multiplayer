import {TicTacToe} from "./TicTacToe.js";
import {Player} from "./Player.js";
import {Cell} from "./Cell.js";
import {Winner} from "./Winner.js";

function Test() {
    function player1win() {
        console.log("player1win");
        let t = new TicTacToe();
        let mr;        
        mr = t.move(new Cell(0, 0));
        console.assert(Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(0, 1));
        console.assert(Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(1, 1));
        console.assert(Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(2, 1));
        console.assert(Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(2, 2));
        console.assert(mr === Winner.PLAYER1, "Jogador 1 não venceu");
    }
    return {player1win};
}

let t = new Test();
t.player1win();