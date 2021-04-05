const Room = require("./room");

class People{
    create(username,email,online){
        const d = new Date();
        return {
            username,email,online,join:d.getHours()+':'+d.getMinutes()
        }
    }
    async stream(session,roomID){
        let people = await Room.getPeopleList(roomID)
        let person = people.find((person)=>String(person.id)===String(session.id));
        if(!person) return null;
        return {
            id:String(session.id),
            username:session.username,
            email:session.email,
            verified:session.verified,
            admin:person.admin
        }
    }
}

module.exports = new People();