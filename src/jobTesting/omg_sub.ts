
process.on('message', function (m) {
    console.log('Child process received:', m)
})

process.send!({ hello: 'from child process' })


setTimeout(() => {
    console.log('time out')
    process.exit()
}, 5000)