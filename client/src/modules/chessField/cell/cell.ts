import { CellPos } from '../../interfaces';
import { Figure } from './figure';

export class Cell {
  element: HTMLElement;   

  figure: Figure | null = null;

  readonly position: CellPos;

  readonly notation: string;

  constructor(typeFigure: string, parent: HTMLElement, styles: string[], position: CellPos, notation:string) {
    this.element = document.createElement('div');
    this.element.classList.add(...styles);
    this.position = position;
    this.notation = notation;

    // this.element.appendChild(this.id.element);
    parent.appendChild(this.element);

    if (typeFigure !== ' ') {
      this.figure = new Figure(typeFigure);
      this.element.appendChild(this.figure.element);
    }

    this.element.onclick = () => {
      this.onClick(this);
    };
    
  }
  onClick(arg0: this) {
    throw new Error('Method not implemented.');
  }
}
