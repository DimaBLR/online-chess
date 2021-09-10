import './chessField.scss';
import { Component } from '../component';
import { Cell } from './cell/cell';
import { MoveModel } from './moveModel';
import { PlayerPanel } from './playerPanel/playerPanel';
import { CellPos, ICurrentGame, IFigureColor } from '../interfaces';

export class ChessField extends Component {
 
  cellField: Array<Cell> = [];

  activeCell: Cell | null = null;  

  moveModel = new MoveModel();

  player1 = new PlayerPanel(this.element);

  chessBoard = new Component('div', ['chess-board'], null, this.element);

  player2 = new PlayerPanel(this.element);

  moveHistory:Array<{}> = [];

  gameChannel: number | null = null;

  currentGame:ICurrentGame = {channelId: null, player: null, color: null};

  myMove:boolean = false;

  userName:string | null = 'noName';
  currentField: any;
  private readonly defaultField: any;

  constructor(parent:HTMLElement) {
    super('div', ['chess-field']);

    parent.appendChild(this.element);
    this.defaultField = [
      'rhbqkbhr',
      'pppppppp',
      '        ',
      '        ',
      '        ',
      '        ',
      'PPPPPPPP',
      'RHBQKBHR',
    ];
    

    this.updateStateField();
    this.player2.reverseBtn();
    this.player2.colorName.element.innerHTML = 'BLACK FIGURE';
    this.drawСells();
   
    this.player1.btnEntry.element.onclick = ()=> {this.joinPlayer1();}
    this.player2.btnEntry.element.onclick = ()=> {this.joinPlayer2();}
    
  }  

  setNameinChat(name:string | null) {}

  joinPlayer1() {
    this.currentGame = {channelId: this.gameChannel, player: 'player1', color: 'P'};
    let name = prompt('Введите Ваше имя');
    this.userName = name;
    this.player1.userName.element.innerHTML = `${name}`;
    this.setNameinChat(name);
    this.sendData({type: 'entryGame', data: this.gameChannel, player: 'player1', playerName: name});
    this.player2.disableBtn();
    this.player1.changeBtnMode();
  }

  joinPlayer2() {
    this.currentGame = {channelId: this.gameChannel, player: 'player2', color: 'p'};
    let name = prompt('Введите Ваше имя');
    this.userName = name;
    this.player2.userName.element.innerHTML = `${name}`;
    this.sendData({type: 'entryGame', data: this.gameChannel, player: 'player2', playerName: name});
    this.flipBoard(true);
    this.player1.disableBtn();
    this.player2.changeBtnMode();
    
    console.log(this.currentGame)
  }

  flipBoard(flip:boolean) {
    (flip) ? this.chessBoard.element.classList.add('flip-element') : this.chessBoard.element.classList.remove('flip-element');
    this.cellField.forEach(el => {
      (flip) ? el.figure?.element.classList.add('flip-element') : el.figure?.element.classList.remove('flip-element');
    })
  }

  drawСells() {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (const y in this.defaultField) {
      for (const x in this.defaultField[y]) {
        let cellStyle; const type = this.defaultField[y][x];
        (+y % 2 === 0) ? cellStyle = (+x % 2 == 0) ? 'cell-white' : 'cell-black'
          : cellStyle = (+x % 2 === 0) ? 'cell-black' : 'cell-white';
        const cell = new Cell(type, this.chessBoard.element, [`${cellStyle}`], { y: +y, x: +x }, `${letters[+x]}${Math.abs(+y - 8)}`);
        cell.onClick = (el) => { this.getMove(el);};
        this.cellField.push(cell);
      }
    }
  }
  

  transferFigure(from:string, to:string, moveMode: boolean = true) {
    this.updateStateField();     
    let fromCell:any = this.cellField.find(el => { return el.notation == from});
    let toCell:any = this.cellField.find(el => {return el.notation == to});
    this.writeMoveHistory(from, to, fromCell.figure.typeFigure);
    if (toCell.figure) {
      toCell.figure.element.remove();
      toCell.figure = null;
    };
    toCell.element.appendChild(fromCell.figure.element);
    toCell.figure = fromCell.figure;
    fromCell.figure = null;
    this.activeCell = null;
    this.updateStateField();
    
    if (moveMode) {      
      this.sendData({type: 'iMoved', channelId: this.currentGame.channelId, player: this.currentGame.player, move: {from:from, to:to}, field: this.currentField});
    }
    this.updateStateField(); 
    this.switchStyles('All', 'del', 'king-under-atack');
    this.switchStyles('All', 'del', 'atack');
    this.checkToKings(moveMode);

  }


  writeMoveHistory(from: string, to: string, figure: string) {
    let move = {
      from: from,
      to: to,
      figure: figure,
      time: '1.30',
      active: false
    };
    (figure.toLowerCase() !== figure) ? this.player1.addMove(move):this.player2.addMove(move);
    this.moveHistory.push({from: from, to:to});
  }

  getMove(cell:Cell) {
    this.updateStateField();
    if (!this.currentGame.player || !this.myMove) return;
    this.switchStyles('All', 'del', 'can-move');
    this.switchStyles('All', 'del', 'active-cell'); 

      if (!this.activeCell && cell.figure) { //если активной фигуры нет - устанавливаем и выходим
        if (!this.currentGame.color) throw new Error('No color')
        let myFigure = this.currentGame.color.toLowerCase() == this.currentGame.color;
        let targetFigure = cell.figure.typeFigure.toLowerCase() == cell.figure.typeFigure;
        
        if (myFigure == targetFigure) {
        this.activeCell = cell;
        this.getAvailableSteps(cell);
        cell.element.classList.add('active-cell');
        return;
        }
        return
      }

      if (this.activeCell) { //если активная фигура есть
        
          if (cell.figure) { //если есть активная фигура и клетка назначения имеет фигуру
            if (!this.activeCell.figure) throw new Error('No figure find');
            let colorActive = this.activeCell.figure.typeFigure.toLowerCase() == this.activeCell.figure.typeFigure;
            let colorTarget = cell.figure.typeFigure.toLowerCase() == cell.figure.typeFigure;
            

            if (colorActive == colorTarget) { //если цвет активной фигуры и фигуры в клетке назначения совпадают
              this.getAvailableSteps(cell);
              cell.element.classList.add('active-cell');
              this.activeCell = cell;
            } 

            if (colorActive !== colorTarget) { //если цвет активной фигуры и фигуры в клетке назначения НЕ совпадают
              if (!this.activeCell.figure) throw new Error('No figure find');
              let canMovs = this.moveModel.getRoute(this.activeCell.figure.typeFigure, this.activeCell.position, this.currentField);
              let targetMove = canMovs.find((el:CellPos) => {
               return el.x == cell.position.x && el.y == cell.position.y
              });
              if (targetMove) { //бьём фигуру противника
                  this.transferFigure(this.activeCell.notation, cell.notation);
                  this.myMove = false;
              } else {
                this.getAvailableSteps(this.activeCell);
                this.activeCell.element.classList.add('active-cell');
              }
            }
          }
          
          if (!cell.figure) { //если активная фигура есть и клетка назначения пуста
            if (!this.activeCell.figure) throw new Error('No figure find');
            let canMovs = this.moveModel.getRoute(this.activeCell.figure.typeFigure, this.activeCell.position, this.currentField);
            let targetMove = canMovs.find((el: CellPos) => {
             return el.x == cell.position.x && el.y == cell.position.y
            });
            if (targetMove) {
              this.transferFigure(this.activeCell.notation, cell.notation);
              this.myMove = false;
            } else {
              this.getAvailableSteps(this.activeCell);
              this.activeCell.element.classList.add('active-cell');
            }
          
          }
      }
  }

  getAvailableSteps(cell:Cell) {
    if (!cell.figure) throw new Error('No figure find');
    const arrMoves = this.moveModel.getRoute(cell.figure.typeFigure, cell.position, this.currentField);
    if (!arrMoves) return;
    this.switchStyles(arrMoves, 'add', 'can-move');
  }

  switchStyles(arrPos:Array<CellPos> | string, method:string, style:string) {      
    if (arrPos == 'All') {
        this.cellField.forEach((el) => { 
            if (method == 'add') el.element.classList.add(style); 
            if (method == 'del') el.element.classList.remove(style); 
        });
      } else {
        this.cellField.forEach((el) => {
        if (Array.isArray(arrPos)) arrPos.forEach((pos: CellPos) => {
          if (el.position.x === pos.x && el.position.y === pos.y) {
            if (method == 'add') el.element.classList.add(style);
            if (method == 'del') el.element.classList.remove(style);
          }
        });
      });
    } 
      
  }

  updateStateField() {
    const state = this.cellField.map((el) => ((el.figure?.typeFigure == null) ? ' ' : el.figure?.typeFigure));
    const newState = [];
    while (state.length > 0) newState.push(state.splice(0, 8));
    this.currentField = newState;
  }

  sendData(data:{}) {}

  checkToKings(moveMode:boolean) {
    let kingWhite:CellPos; let kingBlack:CellPos;
    this.cellField.forEach((el) => {
      if (el.figure?.typeFigure == 'K') kingWhite = el.position;
      if (el.figure?.typeFigure == 'k') kingBlack = el.position;
    });

    const strikeToWhite = []; const strikeToBlack = [];
    for (let y = 0; y < this.currentField.length; y++) {
      for (let x = 0; x < this.currentField[y].length; x++) {
        if (this.currentField[y][x] !== ' ') {
          this.moveModel.getRoute(this.currentField[y][x], { y, x }, this.currentField).forEach((el: { x: number; y: number; }) => {
            if (el.x == kingWhite.x && el.y == kingWhite.y) {
              console.log('Шах белым! Король под ударом фигуры', { y, x }, this.currentField[y][x]);
              this.switchStyles([kingWhite], 'add', 'king-under-atack');
              this.switchStyles([{y:y, x:x}], 'add', 'atack');
              if (moveMode) this.sendData({ type: 'chatMessage', data: `Шах белым ! Король под ударом фигуры ${this.currentField[y][x]}: позиция y:${y}, x:${x}`, channel: this.currentGame.channelId, userName: 'SERVER', msgTime: new Date().toLocaleString()});
              this.checkAvailableMoves(kingWhite, 'K');
            }
            
            if (el.x == kingBlack.x && el.y == kingBlack.y) {
              console.log('Шах черным! Король под ударом фигуры', { y, x }, this.currentField[y][x]);
              this.switchStyles([kingBlack], 'add', 'king-under-atack');
              this.switchStyles([{y:y, x:x}], 'add', 'atack');
              if (moveMode) this.sendData({ type: 'chatMessage', data: `Шах чёрным ! Король под ударом фигуры ${this.currentField[y][x]}: позиция y:${y}, x:${x}`, channel: this.currentGame.channelId, userName: 'SERVER', msgTime: new Date().toLocaleString()});
              this.checkAvailableMoves(kingBlack, 'k');
            }
          });
        }
      }
    }
  }

  checkAvailableMoves(pos:CellPos, type:string) {
    const color = (type.toLowerCase() == type);
    const canMoves = this.moveModel.getRoute(type, pos, this.currentField);
    const atackMoves:Array<CellPos> = []; const protectMoves:Array<CellPos> = [];
    canMoves.forEach((move: CellPos) => {
      for (let y = 0; y < this.currentField.length; y++) {
        for (let x = 0; x < this.currentField[y].length; x++) {
          const enemyColor = (this.currentField[y][x].toLowerCase() == this.currentField[y][x]);
          if (this.currentField[y][x] !== ' ' && color !== enemyColor) {
            this.moveModel.getRoute(this.currentField[y][x], { y, x }, this.currentField).forEach((el: CellPos) => {
              if (el.x === move.x && el.y === move.y) {
                atackMoves.push(move);
              }
            });
          }
          if (this.currentField[y][x] !== ' ' && color == enemyColor && type !== this.currentField[y][x]) {
            this.moveModel.getRoute(this.currentField[y][x], { y, x }, this.currentField).forEach((el: CellPos) => {
              if (el.x === move.x && el.y === move.y) {
                protectMoves.push(move);
              }
            });
          }
        }
      }
    });

    /* const name: IFigureColor = {
      k: 'черным',
      K: 'белым',
    }; */

    const name = (type.toLocaleLowerCase() === type) ? 'чёрным' : 'белым';
    
    if (this.removeDuplicates(canMoves).length == this.removeDuplicates(atackMoves).length && protectMoves.length == 0) {
    this.sendData({ type: 'chatMessage', data: `Шах и Мат ${name}`, channel: this.currentGame.channelId, userName: 'SERVER', msgTime: new Date().toLocaleString() });
    this.sendData({ type: 'gameOver', loser: type, channel: this.currentGame.channelId, timeEnded: new Date().toLocaleString()});
    }
    // console.log('может ходить', this.removeDuplicates(canMoves))
    // console.log('атака по "может ходить"', this.removeDuplicates(atackMoves))
    // console.log('можно прикрыть атаку', this.removeDuplicates(protectMoves));
  }

  removeDuplicates(arr: any) {
    const result:any = [];
    const duplicatesIndices:any = [];

    arr.forEach((current: { [x: string]: any; }, index: number) => {
      if (duplicatesIndices.includes(index)) return;
      result.push(current);

      for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
        const comparison = arr[comparisonIndex];
        const currentKeys = Object.keys(current);
        const comparisonKeys = Object.keys(comparison);

        if (currentKeys.length !== comparisonKeys.length) continue;

        const currentKeysString = currentKeys.sort().join('').toLowerCase();
        const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase();
        if (currentKeysString !== comparisonKeysString) continue;

        let valuesEqual = true;
        for (let i = 0; i < currentKeys.length; i++) {
          const key = currentKeys[i];
          if (current[key] !== comparison[key]) {
            valuesEqual = false;
            break;
          }
        }
        if (valuesEqual) duplicatesIndices.push(comparisonIndex);
      }
    });
    return result;
  }
}
