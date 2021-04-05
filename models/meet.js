const Room = require("./room"),
    User = require("./user");

class Meet{
    async join(roomID,uid){
        console.log(roomID,uid)
        const room = await Room.getByIDIfUser(roomID,uid)
        if(!room) return false;
        return {
            active: true,
            title: room.title,
            people: room.people,
            blocked:room.blocked,
            settings:room.settings
        };
    }
}

module.exports = new Meet();