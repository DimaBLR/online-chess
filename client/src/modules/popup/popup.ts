import './popup.scss';
import { Component } from "../component";
import { ChessField } from '../chessField/chessField';
import { CellPos, IMove } from '../interfaces';

export class Popup extends Component {
    content: Component;
    btnClose: Component;
    constructor(parent: HTMLElement) {
        super('div', ['popup-window', 'hidden']);
        parent.appendChild(this.element);
        this.content = new Component('div', ['popup-content'], null, this.element);
        this.btnClose = new Component('div', ['popup-btn-close'], 'CLOSE');
        this.btnClose.element.onclick = () => {
            this.content.element.innerHTML = '';
            this.element.classList.add('hidden');
        }
    }


    show() {
        this.element.classList.remove('hidden');
    }


    showStatistics(data:any) {
      let x = 0;
      const speedControl = new Component('div', ['speed-control'], 'Select replay speed', this.content.element);
      const speed1 = new Component('div', ['speed-x'], '1X', speedControl.element);
      const speed2 = new Component('div', ['speed-x'], '2X', speedControl.element);
      const speed3 = new Component('div', ['speed-x'], '3X', speedControl.element);
      speed1.element.onclick = () => {changeSpeed(1000)};
      speed2.element.onclick = () => {changeSpeed(2000)};
      speed3.element.onclick = () => {changeSpeed(3000)};

      function viewReplay() {
        if (x == data.length) return clearInterval(replay);  
             board.transferFigure(data[x].from, data[x].to, false)  
             x++;
      }

      function changeSpeed(speedTime:number) {
        clearInterval(replay);
        replay = setInterval(viewReplay,speedTime); 
      }
      
      const board = new ChessField(this.content.element);      
      let replay:NodeJS.Timeout = setInterval(viewReplay,500);
      this.content.element.appendChild(this.btnClose.element);
    }



}