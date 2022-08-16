import CellState from "./CellState.js";
import Winner from "./Winner.js";
import Cell from "./Cell.js";

export default class TicTacToePlayer {
    constructor(p, g) {
        this.turn = p;
        this.game = g;
    }
    minimax(matrix, currentPlayer = this.turn, depth = 0) {
        let res = this.game.endOfGame(matrix);
        if (res !== Winner.NONE || matrix.flat().filter(x => x === CellState.EMPTY).length === 0) {
            return { score: ((res === Winner.PLAYER1 && this.turn === CellState.PLAYER1) || (res === Winner.PLAYER2 && this.turn === CellState.PLAYER2)) ? 10 - depth : (res === Winner.DRAW ? 0 : depth - 10) };
        }
        let moves = this.getAvailableMoves(matrix, currentPlayer);
        let nextPlayer = currentPlayer === CellState.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
        for (let m of moves) {
            m.score = this.minimax(m.matrix, nextPlayer, depth + 1).score;
        }
        let f = this.turn === currentPlayer ? (v, max) => v > max : (v, max) => v < max;
        let index = moves.reduce((iMax, x, i, arr) => f(x.score, arr[iMax].score) ? i : iMax, 0);
        return moves[index];
    }
    getAvailableMoves(matrix, turn) {
        let moves = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j] === CellState.EMPTY) {
                    let clone = matrix.map(arr => arr.slice());
                    clone[i][j] = turn;
                    moves.push({ matrix: clone, cell: new Cell(i, j) });
                }
            }
        }
        return moves;
    }
}