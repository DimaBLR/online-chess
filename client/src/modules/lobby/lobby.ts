import './lobby.scss';
import { Component } from '../component';
import { ChatMessage } from './chatMessage/chatMessage';
import { Channel } from './channel';
import { IMessage } from '../interfaces';

export class Lobby extends Component {
  sendMessage: (mess:any) => void = () => {};

  private name = new Component('h1', ['lobby-name'], 'Game field', this.element);

  private amountUsers = new Component('span', ['server-users'], 'Online: 0', this.element);

  private channels = new Component('div', ['server-channels'], '<h2>channels</h2>', this.element);

  private btnAddChannel = new Component('div', ['btn-add-channel'], 'New channel', this.channels.element);

  private channelUsers = new Component('div', ['channel-users'], '<h3>users</h3>', this.element);

  private wrapper = new Component('div', ['lobby-wrapper'], null, this.element);

  game = new Component('div', ['game-field'], null, this.wrapper.element);

  chat = new Component('div', ['chat-field'], null, this.wrapper.element);

  private chatName = new Component('span', ['chat-name'], 'Chat', this.chat.element);

  chatMessages = new Component('div', ['chat-messages'], null, this.chat.element);

  chatSendMessage = new Component('div', ['chat-send-message'], null, this.chat.element);

  messageInput = new Component('input', ['message-input'], null, this.chatSendMessage.element, 'type', 'text');

  messageSubmit = new Component('div', ['message-submit'], 'SEND', this.chatSendMessage.element);

  activeChannel: number | null = null;
  
  userName:string | null = 'Unknown User'

  constructor(parent: HTMLElement) {
    super('div', ['lobby-field']);
    parent.appendChild(this.element);
    this.messageSubmit.element.onclick = () => { this.preparData(); };
    this.messageInput.element.onkeydown = (e) => { if (e.code === 'Enter' || e.code === 'NumpadEnter') this.preparData(); };
    this.btnAddChannel.element.onclick = () => { this.addChannel(); };


   // this.chatMessages.element.scrollTop = this.chatMessages.element.scrollHeight;   
    //this.chatMessages.element.scrollTop = this.chatMessages.element.scrollHeight - this.chatMessages.element.clientHeight;
    //this.chatMessages.element.scrollIntoView(false);
  }

  setOnlineAmount(n: number) {
    this.amountUsers.element.innerHTML = `online: ${n}`;
  }

  preparData() {
    const message = (this.messageInput.element as HTMLInputElement);
    if (message.value == '' || this.activeChannel == null) return;
    const data = { type: 'chatMessage', data: message.value, channel: this.activeChannel, userName: this.userName, msgTime: new Date().toLocaleString()};
    this.sendMessage(data);
    message.value = '';
  }

  addChatMessage(mes:IMessage, id:number) {
    if (this.activeChannel == id) {
      const message = new ChatMessage(mes);
      this.chatMessages.element.appendChild(message.element);
      this.chatMessages.element.scrollTop = this.chatMessages.element.scrollHeight;
    }
  }

  addChannel() {
    const name = prompt('Enter name channel');
    const channel = {
      type: 'addChannel',
      data: name,
    };
    if (name !== '') this.sendMessage(channel);
  }

  insertNewChannel(id:number, name:string) {
    const channel = new Channel(+id, name);
    channel.element.onclick = () => {
      this.sendMessage({ type: 'getChannelData', id: channel.id });
      this.setActiveChannel(channel.id);
    };
    this.channels.element.appendChild(channel.element);
    if (this.activeChannel == null) this.activeChannel = id;
  }

  setActiveChannel(id:number) {
    this.activeChannel = id;
    this.sendToChessField(id);
  }

  sendToChessField(id:number) {}

  renderChannelMessages(arr:Array<IMessage>) {
    console.log(arr)
    this.chatMessages.element.innerHTML = '';
    arr.forEach((el: IMessage) => {
      const message = new ChatMessage(el);
      this.chatMessages.element.appendChild(message.element);
      this.chatMessages.element.scrollTop = this.chatMessages.element.scrollHeight;
    });

    
  }

  
}
