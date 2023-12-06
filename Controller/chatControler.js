const ChatUserModel = require("../Modal/ChatUserModel")
const messageSchema = require("../Modal/message")


const findExistingRoom = async (currentUserId, otherUserId) => {
    const existingRoom = await ChatUserModel.findOne({
        members: { $all: [currentUserId, otherUserId] }
    });

    return existingRoom;
};

const createRoom = async (currentUserId , otherUserId , roomName ) =>
{

    
    const room =  new ChatUserModel({
        members : [currentUserId , otherUserId],
        roomName : roomName,
        start_timestamp : new Date(),
        end_timestamp  :new Date(), 
    })
     await room.save()
    console.log(room)
    return room;
}

const getRoomName  = async (roomId)=>{
    const name = await ChatUserModel.findById(roomId)
    console.log(name)
    return name;
}
const messageSend  = async (R_id ,S_id , msg) =>{
    const  message  = new messageSchema({
        roomId : R_id, 
        senderId :S_id,
        content:msg ,
        start_timestamp: new Date(),
        end_timestamp: new Date(),
        update_timestamp: new Date()
    }) 

    await message.save()
    console.log(message)
    return message
} 

const allMessage = async (roomId) =>
{
    const messages = messageSchema.find({ roomId : roomId})
    console.log(messages)
    return messages;
}
module.exports = {findExistingRoom , createRoom , messageSend , allMessage ,getRoomName}