import { Component } from "../component";
import { CellPos } from "../interfaces";

export class StatItem extends Component {
    players: Component;    
    winner: Component;
    gameTime: Component;
    moves: Component;
    gameActivity: Component;
    replay: any;
    btnReplay: Component;
    constructor(player1: string, player2: string, winner: string, gameTime: string, moves: number, replay: CellPos[], gameActivity:boolean) {
        super('div', ['stat-item']);
        this.players = new Component('div', ['stat-player'], `${player1} vs ${player2}`, this.element);
        this.winner = new Component('div', ['stat-winner'], `Winner: ${winner}`, this.element);
        this.moves = new Component('div', ['stat-moves'], `Moves: ${moves}`, this.element);
        this.gameTime = new Component('div', ['stat-time'], `Game ended: ${gameTime}`, this.element);        
        const active = (gameActivity) ? 'active': 'completed';
        this.gameActivity = new Component('div', ['stat-active'], active, this.element);
        this.btnReplay = new Component('div', ['btn-replay'], 'view replay', this.element);
        this.replay = replay;

        
    }

    
}