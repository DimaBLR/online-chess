import { CellPos, IFigure } from '../interfaces';

export class MoveModel {
  gameState: Array<string> = [];

  constructor() {}

  getRoute(typeFigure: string, pos: CellPos, state: Array<string>) {
    this.gameState = state;
    const lowerCase = typeFigure.toLowerCase();
    if (lowerCase == 'r') return this.getRookMoves(typeFigure, pos);
    if (lowerCase == 'h') return this.getHorseMoves(typeFigure, pos);
    if (lowerCase == 'b') return this.getBishopMoves(typeFigure, pos);
    if (lowerCase == 'q') return this.getQueenMoves(typeFigure, pos);
    if (lowerCase == 'k') return this.getKingMoves(typeFigure, pos);
    if (lowerCase == 'p') return this.getPawnMoves(typeFigure, pos);
  }

  private getRookMoves(typeFigure: string, pos: CellPos) {
    const arrMove: Array<Array<IFigure>> = [[], [], [], []];

    let minX = 10; let minY = 10; let flagY = true;
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[y].length; x++) {
        if (pos.y == y) {
          arrMove[0].push({ y, x, type: this.gameState[y][x] });
          if (this.gameState[y][x] !== ' ' && x < pos.x) {
            const ras = pos.x - x;
            if (ras < minX) {
              minX = ras;
              arrMove[0] = [];
              arrMove[0].push({ y, x, type: this.gameState[y][x] });
            }
          }

          if (x > pos.x) {
            if (this.gameState[y][x] == ' ') {
              arrMove[1].push({ y, x, type: this.gameState[y][x] });
            } else {
              arrMove[1].push({ y, x, type: this.gameState[y][x] });
              break;
            }
          }
        }

        if (pos.x == x) {
          if (y < pos.y) {
            arrMove[2].push({ y, x, type: this.gameState[y][x] });
            if (this.gameState[y][x] !== ' ' && y < pos.y) {
              const ras = pos.y - y;
              if (ras < minY) {
                minY = ras;
                arrMove[2] = [];
                arrMove[2].push({ y, x, type: this.gameState[y][x] });
              }
            }
          }

          if (y > pos.y) {
            if (this.gameState[y][x] == ' ' && flagY) {
              arrMove[3].push({ y, x, type: this.gameState[y][x] });
            } else {
              if (flagY) arrMove[3].push({ y, x, type: this.gameState[y][x] });
              flagY = false;
            }
          }
        }
      }
    }

    return this.cleanArr(typeFigure, arrMove);
  }

  private getHorseMoves(typeFigure:string, pos: CellPos) {
    const arrMove = [];
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[y].length; x++) {
        if (
          (Math.abs(y - pos.y) == 1 && Math.abs(x - pos.x) == 2)
          || (Math.abs(x - pos.x) == 1 && Math.abs(y - pos.y) == 2)
        ) {
          arrMove.push({ y, x, type: this.gameState[y][x] });
        }
      }
    }
    return this.cleanArr(typeFigure, arrMove);
  }

  private getBishopMoves(typeFigure:string, pos: CellPos) {
    const arrMove:Array<Array<IFigure>> = [[], [], [], []];
    let minY = 10; let minX = 10; let flagY = true; let flagX = true;
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[y].length; x++) {
        if (pos.x - pos.y == x - y) {
          if (y < pos.y) {
            arrMove[0].push({ y, x, type: this.gameState[y][x] });
            if (this.gameState[y][x] !== ' ' && y < pos.y) {
              const ras = pos.y - y;
              if (ras < minY) {
                minY = ras;
                arrMove[0] = [];
                arrMove[0].push({ y, x, type: this.gameState[y][x] });
              }
            }
          }

          if (y > pos.y) {
            if (this.gameState[y][x] == ' ' && flagY) {
              arrMove[1].push({ y, x, type: this.gameState[y][x] });
            } else {
              if (flagY) arrMove[1].push({ y, x, type: this.gameState[y][x] });
              flagY = false;
            }
          }
        }

        if (pos.x + pos.y == x + y) {
          if (y < pos.y) {
            arrMove[2].push({ y, x, type: this.gameState[y][x] });
            if (this.gameState[y][x] !== ' ' && y < pos.y) {
              const ras = pos.y - y;
              if (ras < minX) {
                minX = ras;
                arrMove[2] = [];
                arrMove[2].push({ y, x, type: this.gameState[y][x] });
              }
            }
          }

          if (y > pos.y) {
            if (this.gameState[y][x] == ' ' && flagX) {
              arrMove[3].push({ y, x, type: this.gameState[y][x] });
            } else {
              if (flagX) arrMove[3].push({ y, x, type: this.gameState[y][x] });
              flagX = false;
            }
          }
        }
      }
    }

    return this.cleanArr(typeFigure, arrMove);
  }

  private getQueenMoves(typeFigure:string, pos: CellPos) {
    const a = this.getBishopMoves(typeFigure, pos);
    const b = this.getRookMoves(typeFigure, pos);
    return a.concat(b);
  }

  private getKingMoves(typeFigure:string, pos: CellPos) {
    const arrMove = [];
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[y].length; x++) {
        if (
          (Math.abs(y - pos.y) == 1 && Math.abs(x - pos.x) == 1)
          || (Math.abs(y - pos.y) == 1 && x == pos.x)
          || (y == pos.y && Math.abs(x - pos.x) == 1)
        ) { arrMove.push({ y, x, type: this.gameState[y][x] }); }
      }
    }
    return this.cleanArr(typeFigure, arrMove);
  }

  private getPawnMoves(typeFigure: string, pos: CellPos) {
    if (typeFigure.toLowerCase() == typeFigure) {
      const arrMove = [];
      if (this.gameState[pos.y + 1][pos.x] == ' ') arrMove.push({ y: pos.y + 1, x: pos.x, type: ' ' });

      if (this.gameState[pos.y + 1][pos.x + 1] !== ' ' && pos.x + 1 < 8) {
        arrMove.push({ y: pos.y + 1, x: pos.x + 1, type: this.gameState[pos.y + 1][pos.x + 1] });
      }
      if (this.gameState[pos.y + 1][pos.x - 1] !== ' ' && pos.x - 1 >= 0) {
        arrMove.push({ y: pos.y + 1, x: pos.x - 1, type: this.gameState[pos.y + 1][pos.x - 1] });
      }
      return this.cleanArr(typeFigure, arrMove);
    }

    if (typeFigure.toLowerCase() !== typeFigure) {
      const arrMove = [];
      if (this.gameState[pos.y - 1][pos.x] == ' ') arrMove.push({ y: pos.y - 1, x: pos.x, type: ' ' });
      if (this.gameState[pos.y - 1][pos.x + 1] !== ' ' && pos.x + 1 < 8) {
        arrMove.push({ y: pos.y - 1, x: pos.x + 1, type: this.gameState[pos.y - 1][pos.x + 1] });
      }
      if (this.gameState[pos.y - 1][pos.x - 1] !== ' ' && pos.x - 1 >= 0) {
        arrMove.push({ y: pos.y - 1, x: pos.x - 1, type: this.gameState[pos.y - 1][pos.x - 1] });
      }
      return this.cleanArr(typeFigure, arrMove);
    }
  }

  cleanArr(typeFigure:string, arrMove:any) {
    const small = (typeFigure.toLowerCase() == typeFigure);
    const newArr = arrMove.flat().filter((el: { type: string; }) => {
      const big = (el.type.toUpperCase() == el.type);
      if (el.type == ' ' || small == big) return el;
    });
    return newArr;
  }
}
