
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
        socket.on('joinroom', async function (data) {
            const roomName = data.dataToBeSent.currentUserName.slice(0, 5) + data.dataToBeSent.currentUserId.slice(0, 5) + data.dataToBeSent.otherUserName.slice(0, 5)


            try {
                // Call createRoom with currentUserId, otherUserId, and roomName

                const existingRoom = await findExistingRoom(data.dataToBeSent.currentUserId, data.dataToBeSent.otherUserId)
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
            const room = await getRoomName(data?.dataTobeSent?.roomId)
            if (room) {
                const msgResponse = await messageSend(data.dataTobeSent.roomId, data.dataTobeSent.senderId, data.dataTobeSent.content)
                socket.to(room.roomName).emit('message', msgResponse);
            }
        });

        socket.on("gettingAllMessages", async (data) => {
            // Assuming data.id is the roomId, data.page is the current page number, and data.pageSize is the page size
            const { id: roomId, page, pageSize } = data;

            try {
                const messages = await allMessage(roomId, page, pageSize);
                socket.emit("setAllMessages", messages);
            } catch (error) {
                console.error('Error retrieving messages:', error);
                // Handle errors as needed
                socket.emit("setAllMessages", { error: "Failed to retrieve messages" });
            }
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

