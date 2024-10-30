/*
import { randomUUID } from "crypto";
import { Players } from "./jobTesting/omg";
let league = new Players()

//http://localhost:3001/job/d3265546-a867-4447-94b6-5cf284ca4610
app.get('/job/:name', (request, response) => {
    const player = league.getPlayerByName(request.params.name)

    if(!player){
        response.send('<h1>no matching id</h1>')
        return
    }

    response.status(200).json({
        name: player.get_name,
        status: player.get_status
    })
})

//do later with post??
//http://localhost:3001/job/ creates new job "Player" and returns job_id "name for it"
app.get('/job', (request, response) => {
    const jobUID = randomUUID()
    const player = league.newPlayer(jobUID)

    player.play()

    console.log(league.players)
    console.log(league.numberOfPlayers)

    response.status(200).json({
        name: player.get_name
    })
})


setInterval(() => {
    league.updatePlayers()
}, 1000)
*/