const WebSocket = require("ws");
const MongoClient = require("mongodb").MongoClient;
const mongoServer = "mongodb+srv://dima:1311986b@cluster0.zdpbf.mongodb.net/Cluster0?retryWrites=true&w=majority";


class MongoDB{  
  constructor(mongoServer){
    this.db = null;
    this.initDB();
  }

  async initDB(url){
    let mongo = new MongoClient(mongoServer, { useNewUrlParser:true, useUnifiedTopology:true });

    await mongo.connect().then(()=>{
      this.db = mongo.db('chess');
      console.log('MongoDB connected');
    });

    //this.getReplays();
    //this.addReplay();
  }

  async getReplays() {    
    //database.db.collection('replays').findOne({ gameId: 'test' }, {}).then((res) => {console.log(res)}); 
    this.dbChannels = await this.db.collection('replays').find().toArray();
    console.log('Mongo Response', this.dbChannels);
    return this.dbChannels      
}

  async addReplay(gamedata) {
    let res = await this.db.collection('replays').insertOne(gamedata, function (err, result) {
      if (err) return console.log(err);
      console.log('Mongo Response', result.ops);
    }); 
  }

}



class SocketServer {
  constructor() {
    this.server = new WebSocket.Server({ port: process.env.PORT || 3000 });
    this.server.on("connection", (user) => {
      this.sendAmountUsers();
      this.onConnection(user);
      user.on("message", (mes) => {
        this.onMessage(mes, user);
      });
      user.on("close", (code) => {
        this.onClose(code, user);
      });
    });
  }

  onConnection(user) {
    console.log("New user connection");
  }

  onMessage(mes, user) {}

  onClose(code, user) {
    console.log("User disconnected", code);
    this.sendAmountUsers();
  }

  sendAmountUsers() {
    const data = { type: "amountUsers", value: this.server.clients.size };
    this.server.clients.forEach((el) => el.send(JSON.stringify(data)));
  }
}

class GameChannel {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.mesages = [{data: `Welcome to the new gaming channel (${name})` , userName: 'SERVER', msgTime: new Date().toLocaleString()}];
    this.users = [];
    this.winner = null;
    this.gameEndTime = null;
    this.player1Connect = null;
    this.player2Connect = null;
    this.player1Name = 'Player 1';
    this.player2Name = 'Player 2';
    this.player1Key = null;
    this.player2Key = null;
    this.fieldHistory = [];
    this.moveHistory = [];
    this.active = false;
  }
}

class Server {
  constructor() {
    this.keyArr = [];
    this.gameChannels = [];
    this.mongo = new MongoDB(mongoServer);
    this.socket = new SocketServer();
    this.socket.onMessage = (mes, user) => {
      this.handlingMessage(mes, user);
    };

    this.publicChannel = new GameChannel(0,'Public');
    this.gameChannels.push(this.publicChannel);
  }

  generateKey() {
    let arr = []
    while(arr.length < 8){
      let randomnumber = Math.floor(Math.random()*100) + 1;
      if(arr.indexOf(randomnumber) > -1) continue;
      arr[arr.length] = randomnumber;
    }

    let key = arr.join('');
    console.log(key);
    let test = this.keyArr.find(el => {return el == key});
    if (test) {
      return this.generateKey();
    } else {
      this.keyArr.push(key);
      console.log('New game key generated');
      return key;
    }
  }

  handlingMessage(mes, user) { 
    mes = JSON.parse(mes);
    console.log(mes);

    if (mes.type == "chatMessage") {
      this.socket.server.clients.forEach((el) => el.send(JSON.stringify(mes)));
      let toChannel = this.gameChannels.find((el) => {
        return el.id == mes.channel;
      });
      if (toChannel) toChannel.mesages.push(mes);
    }

    if (mes.type == "addChannel") {
      let channel = new GameChannel(this.gameChannels.length, mes.data);
      this.gameChannels.push(channel);
      this.socket.server.clients.forEach((el) =>
        el.send(JSON.stringify({ type: "newChannel", data: channel }))
      );
    }

    if (mes.type == "getAllChannels") {
      user.send(
        JSON.stringify({ type: "listChannels", data: this.gameChannels })
      );
      if (this.gameChannels.length > 0) {
        let firstCahnnel = this.gameChannels[0];
        user.send(
          JSON.stringify({ type: "channelData", data: firstCahnnel.mesages })
        );
      }
    }

    if (mes.type == "getChannelData") {
      let targetCahnnel = this.gameChannels.find((el) => {
        return el.id == mes.id;
      });
      user.send(
        JSON.stringify({ type: "channelData", data: targetCahnnel.mesages })
      );
    }

    if (mes.type == 'getStatistics') {
      this.mongo.getReplays().then(res => {
        res.push(...this.gameChannels)
       return user.send(JSON.stringify({type: 'statistics', data: res}));
      })
      //user.send(JSON.stringify({type: 'statistics', data: [test]}));      
    }

    if (mes.type == 'entryGame') {
      const entryChannel = this.gameChannels.find(el => {return el.id == mes.data});
      
      if (entryChannel.player1Connect == null && mes.player == 'player1') {
        entryChannel.player1Connect = user;
        let userKey = this.generateKey();
        entryChannel.player1Key = userKey;
        entryChannel.player1Name = mes.playerName;
        user.send(JSON.stringify({type: 'gameKey', gameKey: userKey, gameId: mes.data, color: 'player1', data:entryChannel}));
        let channelRefresh = {
          type: 'userEntryGame',
          id: entryChannel.id,
          user: 'player1',
          userName: mes.playerName
          //data:entryChannel
        }
        this.socket.server.clients.forEach((el) => { 
          if (el !== user) el.send(JSON.stringify(channelRefresh))
          });

      }
      if (entryChannel.player2Connect == null && mes.player == 'player2') {
        entryChannel.player2Connect = user;
        let userKey = this.generateKey();
        entryChannel.player2Key = userKey;
        entryChannel.player2Name = mes.playerName;
        user.send(JSON.stringify({type: 'gameKey', gameKey: userKey, gameId: mes.data, color: 'player2', data:entryChannel}));
        let channelRefresh2 = {
          type: 'userEntryGame',
          id: entryChannel.id,
          user: 'player2',
          userName: mes.playerName
          //data:entryChannel

        }

        this.socket.server.clients.forEach((el) => { 
        if (el !== user) el.send(JSON.stringify(channelRefresh2))
        });
      }
      
      if (entryChannel.player1Connect && entryChannel.player2Connect) {
        entryChannel.player1Connect.send(JSON.stringify({ type: "startGame", data: 'test'}));
        entryChannel.player1Connect.send(JSON.stringify({ type: "yourFirstMove", data: 'player1'}));
        entryChannel.player2Connect.send(JSON.stringify({ type: "startGame", data: 'test'}));
        entryChannel.active = true;
      }
    }


    if (mes.type == 'iMoved') {
     let toChannel = this.gameChannels.find(el => {return el.id == mes.channelId});
     toChannel.moveHistory.push(mes.move);
     toChannel.fieldHistory.push(mes.field);
      if (mes.player == 'player1') {
        toChannel.player2Connect.send(JSON.stringify({ type: 'yourMove', playerMoved: mes.move, player: mes.player}));
      }
      if (mes.player == 'player2') {
        toChannel.player1Connect.send(JSON.stringify({ type: 'yourMove', playerMoved: mes.move, player: mes.player}));
      }
    }

    if (mes.type == 'gameOver') {
      let overChannel = this.gameChannels.find(el => {return el.id == mes.channel});      
      let winner = (mes.loser.toLowerCase() == mes.loser) ? overChannel.player1Name : overChannel.player2Name;
      let gameEndTime = mes.timeEnded;

      
      let replayBD = {
        name: overChannel.name,
        mesages: overChannel.mesages,
        winner: winner,
        gameEndTime: gameEndTime,
        player1Name: overChannel.player1Name,
        player2Name: overChannel.player2Name,        
        fieldHistory: overChannel.fieldHistory,
        moveHistory: overChannel.moveHistory,
        active: true
      }

      if (replayBD.moveHistory) this.mongo.addReplay(replayBD);

      overChannel.player1Connect = null;
      overChannel.player2Connect = null;      
      overChannel.player1Key = null;
      overChannel.player2Key = null;
      overChannel.moveHistory = null;
      overChannel.fieldHistory = null;
      overChannel.mesages = [{data: `Welcome to the new gaming channel (${overChannel.name})` , userName: 'SERVER', msgTime: new Date().toLocaleString()}];
      overChannel.active = false; 
     
    }
  }
}

const server = new Server();
