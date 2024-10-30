// Write Javascript code here
import { ChildProcess, fork } from 'child_process'

export const omg_processes = () => {
    let child = fork(__dirname + '/sub.js');
    console.log(child.pid)

    child.on('message', function (m) {
        console.log('Parent process received:', m);
    });

    child.send({ hello: 'from parent process' });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}


// An individual player. Holds properties and behaviour for one player
class Player {
    name: string;
    status: string;

    constructor(name: string) {
        this.name = name;
        this.status = 'accepted'
    }

    play() {
      setTimeout(() => {
        this.status = 'succesful'
        this.finish()
      }, 1000)
    }

    finish() {
        setTimeout(() => {
            this.status = 'finished'
        }, 2000)
    }

    get get_name(){
        return this.name
    }

    get get_status(){
        return this.status
    }
}

// Class that holds a collection of players and properties and functions for the group
export class Players {
    players: Player[];

    constructor(){
      this.players = []
    }

    // create a new player and save it in the collection
    newPlayer(name: string){
      let p = new Player(name)
      this.players.push(p)
      return p
    }

    getPlayerByName(name: string){
        return this.players.filter((player) => player.get_name === name)[0]
    }

    // setup finished players for garbage collection
    updatePlayers(){
        this.players = this.players.filter((player) => player.status !== 'finished')
    }

    // this could include summary stats like average score, etc. For simplicity, just the count for now
    get numberOfPlayers(){
        return this.players.length
    }
}