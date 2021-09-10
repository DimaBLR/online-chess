import { Component } from '../../component';

export class Figure extends Component {
  typeFigure: string;

  firstMove: boolean | undefined;

  constructor(typeFigure: string) {
    super('img', [], null, null, 'src', `fig/${typeFigure}.png`);
    this.typeFigure = typeFigure;
    if (typeFigure !== typeFigure.toLowerCase()) this.element.classList.add('figure-white');
    if (typeFigure.toLowerCase() == 'p') this.firstMove = true;
  }
}
