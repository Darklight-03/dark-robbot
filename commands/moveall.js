const config = require('../config.json');
const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class moveall extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if (!msg.member.hasPermission("KICK_MEMBERS")) {
            say.reply(msg,"U R NOT A MODERATOR");
        }
        else{
            let server = msg.guild;
            let channeltarget = msg.member.voiceChannel;
            if(!(!args[0])){
                if(args[0]!='undefined'){
                    channeltarget = args[0];
                }
            }
            let s='';
            server.channels.forEach((channel)=>{
                s = s+channel.name;
                if(channel.type=='voice'&&channel.id!='167002342418284546'){
                    channel.members.forEach((member)=>{
                        s = s + member.user.username;
                        member.setVoiceChannel(channeltarget);
                    });
                }
            });
        }
    }
}

module.exports = moveall;