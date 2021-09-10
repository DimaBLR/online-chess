import { Component } from '../component';

export class Channel extends Component {
  id: number;

  constructor(id:number, name:string) {
    super('div', ['game-channel'], name);
    this.id = id;
  }
}
