package sockets;

import model.CellState;
import model.Player;
import model.Winner;

public record Message(ConnectionType type, Player turn, CellState[][] board, Winner winner) {

}