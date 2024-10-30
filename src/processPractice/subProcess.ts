var process_status = 0

interface messageType {
    action: 'get_status' | 'kill' | 'func'
}
process.on('message', (message: messageType) => {
    console.log('sub', message, process.pid)

    switch(message.action){
        case 'kill':
            process.exit(70)
        
        case 'get_status':
            process.send!({status: process_status})
            break;

        case 'func':
            setTimeout(() => {
                process.send!({func: 'done'})
            }, 1000)
            break;
    }
})


process.on('exit', (code) => {
    //console.log('exit code:', code)
})


setInterval(() => {
    process_status += 500
}, 1000)