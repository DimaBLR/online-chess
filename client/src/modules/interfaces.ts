export interface CellPos {
  y: number,
  x: number
}

export interface IMove {
  active: boolean,
  from: string, 
  to: string, 
  figure: string, 
  time: string
}

export interface IFigureColor {  
    k: string,
    K: string,  
}

export interface IFigure {
  y:number,
  x:number,
  type: string
}

export interface IMessage {
  userName: string,
  msgTime:string,
  data:string
}

export interface IReplay {
  active: boolean,
  player1Key:string,
  player2Key:string,
  player1Name:string,
  player2Name:string,
  winner:string,
  gameEndTime: string
  moveHistory: Array<CellPos>
}

export interface ICurrentGame {
  channelId: number | null, 
  player: string | null, 
  color: string | null
}