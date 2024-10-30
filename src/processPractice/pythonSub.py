import os
import json

# get the FD from ENV
NODEIPCFD = int(os.environ["NODE_CHANNEL_FD"])


def sendMessage(text):
  'sends a Node IPC message to parent proccess'
  # encode message as json string + newline in bytes
  bytesMessage = (json.dumps(text) + "\n").encode()
  # I'm not actually sure what this number is for,
  # but not including it causes problems.
  # probably encodes something to do with the 'advanced' serialization
  os.write(NODEIPCFD, int.to_bytes(1, 8, "little"))
  # send the length as an 8-byte number in little Endian format
  os.write(NODEIPCFD, len(bytesMessage).to_bytes(8, "little"))
  # send message
  os.write(NODEIPCFD, bytesMessage)


def readMessage():
  'read in next message from parent Node process via built-in node IPC'
  # read and discard 8 bytes. Again, don't know why...
  os.read(NODEIPCFD, 8)
  # read and parse 8 bytes as length in little Endian format
  length = int.from_bytes(os.read(NODEIPCFD, 8), "little")
  # read 'length' bytes and pass to json parser
  return json.loads(os.read(NODEIPCFD, length))


def reading_stream_prototype():
    '''
    Node.js -> child.send({first: 1})
        b'\x01\x00\x00\x00\x00\x00\x00\x00'
        b'\x0c\x00\x00\x00\x00\x00\x00\x00'
        b'{"first"'
        b':1}\n'
    '''

    incoming_message = False
    counter = 0
    message_construrt = ''
    while True:
        data = os.read(NODEIPCFD, 8)
        if data == b'\x01\x00\x00\x00\x00\x00\x00\x00':
            # print('message coming')
            incoming_message = True

        if incoming_message:
            counter += 1

        if counter > 2:
            message_construrt += data.decode("utf-8")

        if counter >= 4:
            print(json.loads(message_construrt))
            counter = 0
            incoming_message = False
            message_construrt = ''



sendMessage({'message_from_python': 69})
# reading_stream_prototype()

while True:
    os.read(NODEIPCFD, 8)
    length = int.from_bytes(os.read(NODEIPCFD, 8), "little")
    message = json.loads(os.read(NODEIPCFD, length))

    if 'action' in message.keys():
        match message['action']:
            case 'kill':
                print('killed')
                os._exit(69)
            
            case 'send':
                sendMessage({'send': 'hello'})


    if 'message' in message.keys():
        print('Python:', message['message'], ',PID:', os.getpid())
    