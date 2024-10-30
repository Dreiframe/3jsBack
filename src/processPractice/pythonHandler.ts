import { fork, spawn } from 'child_process'


export const pythonHandler = () => {
    let child = spawn('python', [__dirname + '/pythonSub.py'], {
        stdio:['inherit', 'inherit', 'inherit', 'ipc']
    })

    child.on('spawn', () => {
        console.log('child spawned, PID:', child.pid)

        child.send({message: 'first message'})

        setTimeout(() => {
            child.send({message: 'last message'})
        }, 250)

        setTimeout(() => {
            child.send({action: 'send'})
        }, 500)

        setTimeout(() => {
            child.send({action: 'kill'})
        }, 750)
    })

    child.on('message', (message) => {
        console.log('Node:', message)
    })

    child.on('close', (code, signal) => {
        console.log('Closes with code:', code, ',signal:', signal)
        // code 0 = ok, code 1 = error, code 69 = closed by request
    })

    setTimeout(() => {
        child.kill()
    },1000)
}
