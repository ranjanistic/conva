class Chat{
    joined(username,email){
        const d = new Date();
        return {
            email,
            username,
            msg:'Joined',
            time:d.getHours()+':'+d.getMinutes(),
        }
    }
    create(username,email,msg){
        const d = new Date();
        return {
            email,
            username,
            msg,
            time:d.getHours()+':'+d.getMinutes(),
        }
    }
}

module.exports = new Chat();