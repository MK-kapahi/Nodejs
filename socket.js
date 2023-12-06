
const { Server: SocketIoServer } = require('socket.io');
const { findExistingRoom, createRoom, messageSend, allMessage, getRoomName } = require('./Controller/chatControler');
const message = require('./Modal/message');
function initializeSocket(server) {
    // const io = Server(server);
    const io = new SocketIoServer(server, {
        cors: { origin: '*' }
    });
    // Listen for WebSocket connections
    io.on('connection', (socket) => {
        console.log('A user connected');

        // socket.on('authenticate', (Id) => {
        //     // Store the username and associated socket ID
        //     users[socket.id] = { userId: Id, rooms: [] };
        //     console.log(users)
        //     console.log(`${Id} authenticated with socket ID: ${socket.id}`);
        // });
        socket.on('joinroom', async function (data) {

            console.log(data.dataToBeSent)
            const roomName = data.dataToBeSent.currentUserName.slice(0, 5) + data.dataToBeSent.currentUserId.slice(0, 5) + data.dataToBeSent.otherUserName.slice(0, 5)


            try {
                // Call createRoom with currentUserId, otherUserId, and roomName

                const existingRoom = await findExistingRoom(data.dataToBeSent.currentUserId, data.dataToBeSent.otherUserId)
                console.log(existingRoom)
                if (!existingRoom) {

                    const response = await createRoom(data.dataToBeSent.currentUserId, data.dataToBeSent.otherUserId, roomName);
                    socket.emit('createRoomResponse', response);
                    socket.join(roomName)
                }
                else {
                    socket.emit('createRoomResponse', existingRoom);
                    socket.join(existingRoom.roomName)
                }
                // Send the response back to the client
            } catch (error) {
                // Handle errors if needed
                console.error('Error creating room:', error);
                socket.emit('createRoomResponse', { status: 'error', message: 'Error creating room' });
            }
        })

        // socket.on('getRoomMembers', (roomName) => {
        //     const members = io.sockets.adapter.rooms.get(roomName) || [];
        //     console.log(members)
        //     const memberList = Array.from(members).map((socketId) => {
        //         return users[socketId].userId;
        //     });

        //     socket.emit('roomMembers', { room: roomName, members: memberList });

        // });

        socket.on('sendMessage', async (data) => {
            console.log(data)
            const room = await getRoomName(data?.dataTobeSent?.roomId)
            if (room) {
                console.log(room)
                const msgResponse = await  messageSend(data.dataTobeSent.roomId, data.dataTobeSent.senderId, data.dataTobeSent.content)
                io.broadcast().to(room.roomName).emit('message', msgResponse);
            }
        });

        socket.on("gettingAllMessages" , async (data)=>{
            console.log(data)
           const messages =  await  allMessage(data.id)
              socket.emit("setAllMessages",messages)
        })
        socket.on('error', (error) => {
            console.log(error)
        })
        socket.on('logout', function () {
            socket.disconnect(true);
            console.log('io: logout');
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });


    });
}

module.exports = initializeSocket;

