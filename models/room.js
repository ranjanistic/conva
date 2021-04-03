const Joi = require("joi"),
  { Rooms } = require("../db"),
  User = require("./user");
const { validObjectId } = require("../validate");

class Room {
  blockModel = {
    id:String,
    email:String
  }
  requestModel = {
    id:String,
    email:String
  }
  async createNew(room = { title: String, adminID: String }) {
    const { error, value } = Joi.object({
      title:Joi.string().min(2).max(100).required(),
      adminID:Joi.string().required(),
    }).validate(room);
    if(error) return false;
    value.adminID = validObjectId(value.adminID);
    if(!value.adminID) return false;
    room = value;
    const res = await Rooms().insertOne({
      title:String(room.title).trim(),
      created:Date.now(),
      people:[{
        id:room.adminID,
        admin:true
      }],
      requests:[],
      blocked:[],
      settings:{
        maxPeople:10,
        maxAdmins:1,
      }
    });
    return res.insertedCount===1 ? res.ops[0] : false;
  }

  async addPerson(roomID,uid){
    roomID = validObjectId(roomID);
    uid = validObjectId(uid);
    if(!roomID||!uid) return false;
    const user = await User.findByID(uid)
    if(!user) return false;
    const blockList = await this.getBlockList(roomID);
    if(blockList.some((person)=>String(person.id)===String(user._id))||String(person.email)===String(user.email)) return false;
    const peopleList = await this.getPeopleList(roomID);
    let person = peopleList.find((person)=>String(person.id)===String(uid))
    if(person) return person; //already in the room
    person = {
      id:uid,
      admin:false
    };
    const res = await Rooms().findOneAndUpdate({_id:roomID },{
      $push:{
        people:person
      }
    });
    return res.ok?person:false;
  }

  async removePerson(roomID,uid,block=false){
    roomID = validObjectId(roomID);
    uid = validObjectId(uid);
    if(!roomID||!uid) return false;
    const user = await User.findByID(uid)
    if(!user) return false;
    const peopleList = await this.getPeopleList(roomID);
    let person = peopleList.find((person)=>String(person.id)===String(uid))
    if(!person) return true; //already not in the room
    const res = await Rooms().findOneAndUpdate({_id:roomID },{
      $pull:{
        people:{id:uid}
      }
    });
    if(!block) return res.ok?person:false;
    return await this.blockPerson(roomID,uid)
  }

  async blockPerson(roomID,uid){
    const room = this.getByID(roomID);
    if(!room) return false;
    const person = await User.findByID(uid)
    if(!person) return false;
    const block = {
      id:validObjectId(person._id),
      email:person.email
    };
    const res = await Rooms().findOneAndUpdate({_id:validObjectId(room._id)},{
      $push:{
        blocked:block
      }
    });
    return res.ok?block:false;
  }

  async changeTitle(roomID,newtitle){
    const room = this.getByID(roomID);
    if(!room) return false;
    const {error,value} = Joi.string().min(2).max(100).required().validate(newtitle);
    if(error) return false;
    newtitle = value;
    const res = await Rooms().findOneAndUpdate({_id:validObjectId(room._id)},{
      $set:{
        title:newtitle
      }
    });
    return res.ok?true:false;
  }

  async getByID(roomID) {
    roomID = validObjectId(roomID);
    if (!roomID) return false;
    return await Rooms().findOne({ _id: roomID });
  }
  async getByIDIfUser(roomID,uid){
    const room = await this.getByID(roomID)
    if(!room) return false;
    if(room.people.some((person)=>String(person.id)===String(uid))){
      return room;
    }
    return false;
  }

  async getListByUserID(uid) {
    uid = validObjectId(uid)
    if(!uid) return false;
    return await Rooms().find({people:{$elemMatch:{id:uid}}}).toArray();
  }
  async getPeopleList(roomID,proper = false) {
    const room = await this.getByID(roomID);
    if(!room) return false;
    if(!proper) return room.people;
    room.people = await room.people.map(async(person)=>{
      person = await User.findByID(person.id);
      return this.filterPersonData(person);
    });
    return room.people;
  }

  async getBlockList(roomID,proper = false) {
    const room = await this.getByID(roomID);
    if(!room) return false;
    if(!proper) return room.blocked;
    room.blocked = await room.blocked.map(async(person)=>{
      person = await User.findByID(person.id);
      return this.filterPersonData(person);
    });
    return room.blocked;
  }

  filterPersonData = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    verified: user.verified,
  });

  async getPersonData(roomID, uid) {
    if (!(validObjectId(uid) && validObjectId(roomID))) return false;
    const room = await this.getByID(roomID);
    let person = room.people.find((person)=>String(person.id)===String(uid));
    if(!person) return false;
    person = await User.findByID(person.id);
    return this.filterPersonData(person);
  }
}

module.exports = new Room();
