const config = require('../config.json');
const say = require('./Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args){
    if (!msg.member.hasPermission("KICK_MEMBERS")) {
				say.reply(msg,"U R NOT A MODERATOR");
    }
    else{
        let server = msg.guild;
        let channeltarget = config.defaultVoiceChannel;
        if(!(!args[0])){
            if(args[0]!='undefined'){
                channeltarget = args[0];
                console.log(args[0]);
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
};