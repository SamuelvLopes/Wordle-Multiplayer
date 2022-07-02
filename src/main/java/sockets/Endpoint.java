package sockets;

import java.io.IOException;

import jakarta.websocket.CloseReason;
import jakarta.websocket.EncodeException;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import model.Cell;
import model.Player;
import model.TicTacToe;
import model.Winner;

@ServerEndpoint(value = "/tictactoe", encoders = MessageEncoder.class, decoders = CellDecoder.class)
public class Endpoint {

    private static Session s1;
    private static Session s2;
    private static TicTacToe game;

    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
        if (s1 == null) {
            s1 = session;
            s1.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER1));
        } else if (s2 == null) {
            game = new TicTacToe();
            s2 = session;
            s2.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER2));
            sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard()));
        } else {
            session.close();
        }
    }

    @OnMessage
    public void onMessage(Session session, Cell beginCell) throws IOException, EncodeException {
        try {
            Winner ret = game.move(session == s1 ? Player.PLAYER1 : Player.PLAYER2, beginCell);
            if (ret == Winner.NONE) {
                sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard()));
            } else {
                sendMessage(new Message(ConnectionType.ENDGAME, ret, game.getBoard()));
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) throws IOException, EncodeException {
        switch (reason.getCloseCode().getCode()) {
            case 4000:
                if (session == s1) {
                    s1 = null;
                } else {
                    s2 = null;
                }
                break;
            case 4001:
                if (session == s1) {
                    s2.getBasicRemote()
                            .sendObject(new Message(ConnectionType.ENDGAME, Winner.PLAYER2, game.getBoard()));
                    s1 = null;
                } else {
                    s1.getBasicRemote()
                            .sendObject(new Message(ConnectionType.ENDGAME, Winner.PLAYER1, game.getBoard()));
                    s2 = null;
                }
                break;
            default:
                System.out.println(String.format("Close code %d incorrect", reason.getCloseCode().getCode()));
        }
    }

    private void sendMessage(Message msg) throws EncodeException, IOException {
        s1.getBasicRemote().sendObject(msg);
        s2.getBasicRemote().sendObject(msg);
    }
}
