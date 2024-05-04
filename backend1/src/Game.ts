import { WebSocket } from "ws"
import {Chess} from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {
    public  player1: WebSocket;
    public player2: WebSocket;
    private board : Chess;
    private startTime: Date;
    private moveCount : number = 0;
    constructor(player1 : WebSocket, player2 : WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : 'black'
            }
        }));
    }
    makeMove(player : WebSocket, move : {
        from : string,
        to : string
    }){
        console.log("making move");
        
        if(this.moveCount % 2 === 0 && player !== this.player1){
            console.log('not your turn 1');
            
            return;
        }
        if(this.moveCount % 2 === 1 && player !== this.player2){
            console.log('not your turn 2');
            return;
        }
        try {
            this.board.move(move); // we donot need to update the board as the library does it for us
        } catch (error) {
            console.log(error);
            
            return;
        }
        //check if the game is over
        if(this.board.isGameOver()){
            console.log('game over');
            this.player1.emit(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
            this.player2.emit(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
        }

        if(this.moveCount % 2 === 0){
            console.log('sending to player 2');
            this.player2.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }else{
            console.log('sending to player 1');
            this.player1.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }
        this.moveCount++;
    
    }
}