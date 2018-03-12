const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
var database = require('../../database.js');
const Command = require('../../Command.js');

class updateMessageDatabase extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if (!msg.member.hasPermission("KICK_MEMBERS")) {
            say.reply(msg,"U R NOT A MODERATOR");
            return;
        }
        var channelarray = msg.guild.channels.array();
        this.addChannel(channelarray.shift(), channelarray);
    }
    addChannel(channel, channelarray){
        if(channel.type=='text'){
            channelUtils.getAllMessagesDisc(channel).then(arr => {
                arr.forEach((message)=>{
                    database.replaceMessage(message);
                });
                if(channelarray.length>0){
                    setTimeout(()=>{
					    addChannel(channelarray.shift(), channelarray);
                        //console.log(`got all messages remaining: ${channelarray.length}, ${channelarray[0].name}`);
				    },1000*.5);
                }
                else{
                    say.reply(msg, 'updated messages database!')
                }
            });
        }else{
            if(channelarray.length>0){
                setTimeout(()=>{
			        addChannel(channelarray.shift(), channelarray);
                    //console.log(`not a text channel remaining: ${channelarray.length}, ${channelarray[0].name}`);
			    },1000*.5);
            }
        }
    }
}

module.exports = updateMessageDatabase;
