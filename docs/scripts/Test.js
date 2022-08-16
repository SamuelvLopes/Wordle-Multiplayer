import TicTacToe from "./TicTacToe.js";
import TicTacToePlayer from "./TicTacToePlayer.js";
import Player from "./Player.js";
import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";

class Test {
    player1win() {
        console.log("player1win");
        let t = new TicTacToe(Player.PLAYER1);
        let mr;
        mr = t.move(new Cell(0, 0));
        console.assert(mr === Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(0, 1));
        console.assert(mr === Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(1, 1));
        console.assert(mr === Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(2, 1));
        console.assert(mr === Winner.NONE, "Jogada válida");
        mr = t.move(new Cell(2, 2));
        console.assert(mr === Winner.PLAYER1, "Jogador 1 venceu");
    }
    computer() {
        console.log("computer");
        let t = new TicTacToe(Player.PLAYER1);
        let c = new TicTacToePlayer(CellState.PLAYER2, t);
        let mr;
        do {
            mr = null;
            do {
                let row = parseInt(prompt("Row"));
                let col = parseInt(prompt("Column"));
                try {
                    mr = t.move(new Cell(row, col));
                } catch (ex) {
                    console.log(ex.message);
                }
            } while (mr === null);
            if (mr !== Winner.NONE) break;
            let matrix = t.getBoard();
            console.table(matrix);
            let ret = c.minimax(matrix);
            mr = t.move(ret.cell);
            matrix = t.getBoard();
            console.table(matrix);
        } while (mr === Winner.NONE);
        console.log("Vencedor: ", mr);
    }
}

let t = new Test();
t.player1win();