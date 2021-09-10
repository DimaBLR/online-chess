import './main.scss';
import { Component } from '../component';

export class MainApp extends Component {
  constructor() {
    super('main', ['content'], null, document.body, null);
  }
}
