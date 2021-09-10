export class UserSocket {
  socket: WebSocket = new WebSocket('ws://localhost:3000');
  //socket: WebSocket = new WebSocket('wss://rs-chess.herokuapp.com/');

  constructor() {
    this.socket.addEventListener('open', (event) => {
      console.log('Соеденение с сервером установлено');
      this.sendData({ type: 'getAllChannels' });
    });

    this.socket.addEventListener('close', (event) => {
      console.log('Соединение с сервером потеряно');
      this.initSocket();
    });

    this.socket.addEventListener('message', (event) => {
      // console.log(event.data);
      // let data2 = JSON.parse(event.data)
      // console.log(data2);
      this.onMessage(event);
    });
    this.noSleep();
  }

  onMessage(mes: {}) {}

  sendData(mes: {}) {
    const data = JSON.stringify(mes);
    this.socket.send(data);
  }

  initSocket() {
    // this.socket = new WebSocket('ws://localhost:3000');
  }

  noSleep() {
    setInterval(() => {
      this.sendData({ type: 'nosleep', data: 'nosleep' });
    }, 30000);
  }
}
