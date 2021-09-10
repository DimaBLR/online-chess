import { Component } from '../../component';
import { IMessage } from '../../interfaces';
import './chatMessage.scss';

export const userAva = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1NiA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxjaXJjbGUgY3g9IjI4IiBjeT0iMjgiIHI9IjI4IiBmaWxsPSIjQjlENUQ5Ii8+DQo8cGF0aCBkPSJNMjggMThDMjUuMjQ3NSAxOCAyMyAyMC4yNDc1IDIzIDIzQzIzIDI1Ljc1MjUgMjUuMjQ3NSAyOCAyOCAyOEMzMC43NTI1IDI4IDMzIDI1Ljc1MjUgMzMgMjNDMzMgMjAuMjQ3NSAzMC43NTI1IDE4IDI4IDE4Wk0yOCAxOS41QzI5Ljk0MTkgMTkuNSAzMS41IDIxLjA1ODEgMzEuNSAyM0MzMS41IDI0Ljk0MTkgMjkuOTQxOSAyNi41IDI4IDI2LjVDMjYuMDU4MSAyNi41IDI0LjUgMjQuOTQxOSAyNC41IDIzQzI0LjUgMjEuMDU4MSAyNi4wNTgxIDE5LjUgMjggMTkuNVpNMjEuOTg5MyAzMEMyMC44OTk0IDMwIDIwIDMwLjg5OTQgMjAgMzEuOTg5M1YzMi43NUMyMCAzNC41NTIxIDIxLjEzOTYgMzUuOTQ2MSAyMi42NTMzIDM2Ljc4MTJDMjQuMTY3IDM3LjYxNjQgMjYuMDg0MSAzOCAyOCAzOEMyOS45MTU5IDM4IDMxLjgzMyAzNy42MTY0IDMzLjM0NjcgMzYuNzgxMkMzNC42MzczIDM2LjA2OTIgMzUuNjA4NyAzNC45MzEzIDM1Ljg4MDkgMzMuNUgzNi4wMDFWMzEuOTg5M0MzNi4wMDEgMzAuODk5NCAzNS4xMDA2IDMwIDM0LjAxMDcgMzBIMjEuOTg5M1pNMjEuOTg5MyAzMS41SDM0LjAxMDdDMzQuMjg5OCAzMS41IDM0LjUwMSAzMS43MTAyIDM0LjUwMSAzMS45ODkzVjMySDM0LjVWMzIuNzVDMzQuNSAzMy45NDc5IDMzLjgyNzEgMzQuODAzOSAzMi42MjIxIDM1LjQ2ODhDMzEuNDE3IDM2LjEzMzYgMjkuNzA5MSAzNi41IDI4IDM2LjVDMjYuMjkwOSAzNi41IDI0LjU4MyAzNi4xMzM2IDIzLjM3NzkgMzUuNDY4OEMyMi4xNzI5IDM0LjgwMzkgMjEuNSAzMy45NDc5IDIxLjUgMzIuNzVWMzEuOTg5M0MyMS41IDMxLjcxMDIgMjEuNzEwMiAzMS41IDIxLjk4OTMgMzEuNVoiIGZpbGw9IndoaXRlIi8+DQo8cGF0aCBkPSJNMjggMThDMjUuMjQ3NSAxOCAyMyAyMC4yNDc1IDIzIDIzQzIzIDI1Ljc1MjUgMjUuMjQ3NSAyOCAyOCAyOEMzMC43NTI1IDI4IDMzIDI1Ljc1MjUgMzMgMjNDMzMgMjAuMjQ3NSAzMC43NTI1IDE4IDI4IDE4Wk0yMS45ODkzIDMwQzIwLjg5OTQgMzAgMjAgMzAuODk5NCAyMCAzMS45ODkzVjMyLjc1QzIwIDM0LjU1MjEgMjEuMTM5NiAzNS45NDYxIDIyLjY1MzMgMzYuNzgxMkMyNC4xNjcgMzcuNjE2NCAyNi4wODQxIDM4IDI4IDM4QzI5LjkxNTkgMzggMzEuODMzIDM3LjYxNjQgMzMuMzQ2NyAzNi43ODEyQzM0LjYzNzMgMzYuMDY5MiAzNS42MDg3IDM0LjkzMTMgMzUuODgwOSAzMy41SDM2LjAwMVYzMS45ODkzQzM2LjAwMSAzMC44OTk0IDM1LjEwMDYgMzAgMzQuMDEwNyAzMEgyMS45ODkzWiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K';

export class ChatMessage extends Component {
  avatar: Component;

  wrapper: Component;

  userDataMessage: Component;

  userMessage: Component;

  constructor(message: IMessage) {
    super('div', ['chat-user-message']);
    this.avatar = new Component('img', ['user-avatar'], null, this.element, 'src', userAva);
    this.wrapper = new Component('div', ['data-wrapper'], null, this.element);
    
    this.userDataMessage = new Component('div', ['user-data-message'], `(${message.userName})    ---    ${message.msgTime}`, this.wrapper.element);
    this.userMessage = new Component('div', ['user-message'], `${message.data}`, this.wrapper.element);
  }
}



