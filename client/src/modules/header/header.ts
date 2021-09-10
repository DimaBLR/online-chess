import './header.scss';
import { Component } from '../component';

export class HeaderApp extends Component {
  arrLinks: Array<HTMLElement> = [];

  constructor() {
    super('header', ['header'], null, document.body, null);
    const link1 = new Component('a', ['link'], 'Game lobby', this.element, 'href', '#lobby');
    const link2 = new Component('a', ['link'], 'Statistics', this.element, 'href', '#statistics');
    const logo = new Component('img', ['site-logo'], null, this.element, 'src', `logo.png`);
    const link3 = new Component('a', ['link'], 'Play on PC', this.element, 'href', '#playpc');
    const link4 = new Component('a', ['link'], 'Play on bot', this.element, 'href', '#playbot');
    [link1.element, link2.element, link3.element, link4.element].forEach((el) => this.arrLinks.push(el));
  }
}
