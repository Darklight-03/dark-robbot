const Command = require('../Command.js');

class CommandName extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        msg.guild.members.array().forEach((member) => {
            console.log(member.user.username + " - " + member.displayName);
            member.setNickname(`${args[0]}`);
        })
    }
}

module.exports = CommandName;