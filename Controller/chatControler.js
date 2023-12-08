const ChatUserModel = require("../Modal/ChatUserModel")
const messageSchema = require("../Modal/message")


const findExistingRoom = async (currentUserId, otherUserId) => {
    const existingRoom = await ChatUserModel.findOne({
        members: { $all: [currentUserId, otherUserId] }
    });

    return existingRoom;
};

const createRoom = async (currentUserId, otherUserId, roomName) => {


    const room = new ChatUserModel({
        members: [currentUserId, otherUserId],
        roomName: roomName,
        start_timestamp: new Date(),
        end_timestamp: new Date(),
    })
    await room.save()
    return room;
}

const getRoomName = async (roomId) => {
    const name = await ChatUserModel.findById(roomId)
    return name;
}
const messageSend = async (R_id, S_id, msg) => {
    const singleMessage = new messageSchema({
        roomId: R_id,
        senderId: S_id,
        content: msg,
        start_timestamp: new Date(),
        end_timestamp: new Date(),
        update_timestamp: new Date()
    })

    await singleMessage.save()
    return singleMessage
}

const allMessage = async (roomId , page , pageSize) => {
    // Calculate the starting index based on page and pageSize
    const startIndex = (page - 1) * pageSize;

    // Retrieve a paginated set of messages for the specified room
    const chatMessages = await messageSchema
        .find({ roomId: roomId })
        .skip(startIndex)
        .limit(pageSize)
        .exec();
    return chatMessages;

}
module.exports = { findExistingRoom, createRoom, messageSend, allMessage, getRoomName }