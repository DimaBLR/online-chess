import './statistics.scss';
import { Component } from "../component";
import { StatItem } from './statItem';
import { IReplay } from '../interfaces';

export class Statistics extends Component {
    
    constructor(parent: HTMLElement) {
        super('div', ['statistics-page', 'hidden'], '<progress></progress>');
        parent.appendChild(this.element);
    }

    getStatistics() {}

    renderStatistics(arr:Array<IReplay>) {
        this.element.innerHTML = '';        
        arr.forEach((el:IReplay) => {
            if (el.active) {
            let activeStatus = (el.player1Key && el.player2Key) ? true:false;
            let winer = (el.winner) ? el.winner : 'not ended';
            let endTime = (el.gameEndTime) ? el.gameEndTime : 'not ended';
            const stat = new StatItem(el.player1Name, el.player2Name, winer, endTime, el.moveHistory.length, el.moveHistory, activeStatus);
            stat.btnReplay.element.onclick = () => {this.viewReplay(stat.replay)}
            this.element.appendChild(stat.element);
           }
        });
    }

    viewReplay(stat: Array<IReplay>) {}
}


