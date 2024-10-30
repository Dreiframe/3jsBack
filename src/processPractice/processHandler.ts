import { fork } from 'child_process'

export const processHandler = () => {
    let child = fork(__dirname + '/subProcess.js');
    let child_alive = false
    
    child.on('spawn', () => {
        child_alive = true
        console.log(`child ${child.pid} spawned`)

        child.send({action: 'func'})
    })

    child.on('message', (message) => {
        //console.log('master', message)
    })

    child.on('close', (code) => {
        console.log(`child ${child.pid} exited with code ${code}`);
        child_alive = false
    });
    
    setInterval(() => {
        if (child_alive) {
            child.send({ action: 'get_status' });
        }
    }, 1000)

    setTimeout(() => {
        //child.kill()
        child.send({action: 'kill'})
    }, 5000)
}
