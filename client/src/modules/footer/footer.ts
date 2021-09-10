import './footer.scss';
import { Component } from '../component';

export class FooterApp extends Component {
  constructor() {
    super('footer', ['footer'], null, document.body, null);

    this.element.innerHTML = 'RS School 2021. Dmitry Belov';
  }
}
