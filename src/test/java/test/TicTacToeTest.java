package test;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import model.Cell;
import model.Move;
import model.Player;
import model.TicTacToe;
import model.Winner;

public class TicTacToeTest {
    
    @Test
    public void player1win() {
        System.out.println("player1win");
        TicTacToe t = new TicTacToe();
        Winner mr;
        
        mr = t.move(Player.PLAYER1, new Cell(0, 0));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(0, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(1, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(2, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(2, 2));
        Assertions.assertSame(Winner.PLAYER1, mr);
    }

    @Test
    public void player2win() {
        System.out.println("player2win");
        TicTacToe t = new TicTacToe();
        Winner mr;
        
        mr = t.move(Player.PLAYER1, new Cell(0, 0));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(0, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(0, 2));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(1, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(2, 2));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(2, 1));
        Assertions.assertSame(Winner.PLAYER2, mr);
    }

    @Test
    public void draw() {
        System.out.println("draw");
        TicTacToe t = new TicTacToe();
        Winner mr;
        
        mr = t.move(Player.PLAYER1, new Cell(0, 0));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(0, 2));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(0, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(1, 0));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(1, 2));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(1, 1));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(2, 0));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER2, new Cell(2, 2));
        Assertions.assertSame(Move.VALID, mr);
        mr = t.move(Player.PLAYER1, new Cell(2, 1));
        Assertions.assertSame(Winner.DRAW, mr);
    }
}
