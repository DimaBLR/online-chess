import { ChessField } from '../chessField/chessField';
import { FooterApp } from '../footer/footer';
import { HeaderApp } from '../header/header';
import { Lobby } from '../lobby/lobby';
import { MainApp } from '../main/main';
import { Popup } from '../popup/popup';
import { Router } from '../router';
import { Statistics } from '../statistics/statistics';
import { UserSocket } from '../webSocket/websocket';

export class App {
  private socket = new UserSocket() ;

  header = new HeaderApp();

  private main = new MainApp();

  private footer = new FooterApp();

  router = new Router(this.header, this.main);

  private lobby = new Lobby(this.main.element);

  private chessField = new ChessField(this.lobby.game.element);
  
  statistics = new Statistics(this.main.element);
  popup = new Popup(this.main.element)

  constructor() {
    this.router.getRoute();
    this.router.viewLobby = () => {this.viewLobby()}
    this.router.viewStatistics = () => {this.viewStatistics()}
    this.chessField.sendData = (data) => { this.socket.sendData(data); };
    this.socket.onMessage = (mes) => { this.onMessage(mes); };
    this.lobby.sendMessage = (mes) => { this.socket.sendData(mes); };
    this.statistics.getStatistics = () => { this.socket.sendData({ type: 'getStatistics'}); };        
    this.router.loadStatistics = () => {this.socket.sendData({ type: 'getStatistics'});}
    this.statistics.viewReplay = (stat) => {
      this.popup.show();
      this.popup.showStatistics(stat);
    }

    this.lobby.sendToChessField = (id) => {this.chessField.gameChannel = id};
    this.chessField.setNameinChat = (name) => {this.lobby.userName = name;}
  }

  onMessage(mes: { data?: any}): void {
    const data = JSON.parse(mes.data);
    console.log('App', JSON.parse(mes.data));
    if (data.type === 'amountUsers') this.lobby.setOnlineAmount(data.value);
    if (data.type === 'chatMessage') this.lobby.addChatMessage(data, data.channel);
    if (data.type === 'newChannel') this.lobby.insertNewChannel(data.data.id, data.data.name);
    if (data.type === 'listChannels') {
      for (const channel of data.data) {
        this.lobby.insertNewChannel(channel.id, channel.name);
      }
      if (data.data.length > 0) this.lobby.setActiveChannel(data.data[0].id);
    }
    if (data.type === 'channelData') {
      this.lobby.renderChannelMessages(data.data);
    }

    if (data.type === 'statistics') {
      this.statistics.renderStatistics(data.data);
    }

    if (data.type === 'userEntryGame') {
      console.log(this.chessField.currentGame)
      //if (!this.chessField.currentGame.player && this.lobby.activeChannel == data.id) {
        if (data.user == 'player1') {
          this.chessField.player1.disableBtn();
          this.chessField.player1.userName.element.innerHTML = `${data.userName}`;
        }
        if (data.user == 'player2') {
          this.chessField.player2.disableBtn();
          this.chessField.player2.userName.element.innerHTML = `${data.userName}`;
        }
      //}
    }

    if (data.type === 'startGame') {
      this.chessField.player1.btnEntry.element.innerHTML = 'in game';
      this.chessField.player2.btnEntry.element.innerHTML = 'in game';
    }

    if (data.type === 'gameKey') {
      localStorage.setItem('chessActiveGame', data.gameKey);
     }

    if (data.type === 'yourFirstMove') {
     this.chessField.myMove = true;
    }

    if (data.type === 'yourMove') {
      this.chessField.transferFigure(data.playerMoved.from, data.playerMoved.to, false);
      this.chessField.myMove = true;
     }


  }

  viewLobby() {
    console.log('lobby')
    this.statistics.element.classList.add('hidden');
    this.lobby.element.classList.remove('hidden')
  }

  viewStatistics() {
    console.log('stat')
    this.statistics.element.classList.remove('hidden');
    this.lobby.element.classList.add('hidden')
  }
}
