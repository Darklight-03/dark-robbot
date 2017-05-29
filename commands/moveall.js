const config = require('../config.json');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args){
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
};