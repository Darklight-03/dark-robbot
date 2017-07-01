const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
var database = require('../../database.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	if (!msg.member.hasPermission("KICK_MEMBERS")) {
				say.reply(msg,"U R NOT A MODERATOR");
                return;
    }
    function addChannel(channel, channelarray){
        if(channel.type=='text'){
            channelUtils.getAllMessages(channel).then(arr => {
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
    var channelarray = msg.guild.channels.array();
    addChannel(channelarray.shift(), channelarray);
};

exports.desc = "update the database for messages from all channels"; // Export command description
exports.syntax = "updateMessageDatabase"; // Export command syntax
