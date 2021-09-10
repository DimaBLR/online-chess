import { Component } from '../../component';
import { IMove } from '../../interfaces';
import { userAva } from '../../lobby/chatMessage/chatMessage';
import './playerPanel.scss';


export class PlayerPanel extends Component {
  colorName = new Component('h1', ['figure-color'], 'WHITE FIGURE', this.element);
  userBlock = new Component('div', ['user-block'], null, this.element);

  leftBtns = new Component('div', ['left-btns'], null, this.userBlock.element);
  btnСraven = new Component('div', ['btn-craven', 'disable-btn'], 'СДАТЬСЯ', this.leftBtns.element);
  btnFora = new Component('div', ['btn-fora', 'disable-btn'], 'ДАТЬ ФОРУ', this.leftBtns.element);

  userData = new Component('div', ['user-ava-name'], null, this.userBlock.element);

  userAva = new Component('img', ['user-panel--ava'], null, this.userData.element, 'src', userAva);

  userName = new Component('div', ['user-panel-name'], 'Empty', this.userData.element);

  rightBtns = new Component('div', ['right-btns'], null, this.userBlock.element);
  btnEntry = new Component('div', ['btn-entry'], 'СЕСТЬ ТУТ', this.rightBtns.element);
  btnСastling = new Component('div', ['btn-castling', 'disable-btn'], 'РОКИРОВКА', this.rightBtns.element);

  moveHistory = new Component('div', ['panel-history'], null, this.element);

  figureHistory = new Component('div', ['figure-history'], '<h4>move</h4>', this.moveHistory.element);

  timeHistory = new Component('div', ['time-history'], '<h4>time</h4>', this.moveHistory.element);


  
  constructor(parent: HTMLElement) {
    super('div', ['player-panel']);
    parent.appendChild(this.element);
  }

  addMove(move:IMove) {    
    const time = new Component('div', ['time-item'], move.time, this.timeHistory.element);
    const moveWrap = new Component('div', ['wrap-item'], null, this.figureHistory.element);    
    const figure = new Component('img', [], null, moveWrap.element, 'src', `fig/${move.figure}.png`);
    if (move.figure !== move.figure.toLowerCase()) figure.element.classList.add('figure-white');
    const moveItem = new Component('div', ['move-item'], `${move.from} - ${move.to}`, moveWrap.element);    
  }

  reverseBtn() {
    this.rightBtns.element.style.order = '1';
    this.userData.element.style.order = '2'
    this.leftBtns.element.style.order = '3';
  }

  disableBtn() {
    this.leftBtns.element.classList.add('hidden');
    this.rightBtns.element.classList.add('hidden');
  }

  changeBtnMode() {
    this.btnEntry.element.classList.add('disable-btn');
    this.btnEntry.element.innerHTML = 'Await rival';
    this.btnСastling.element.classList.remove('disable-btn');
    this.btnFora.element.classList.remove('disable-btn');
    this.btnСraven.element.classList.remove('disable-btn');
  }

}
