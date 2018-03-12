const say = require('../Basic tasks/say.js');
const levelManager = require('../../levelManager.js');
const Command = require('../../Command.js');

class fight extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		var msg = msg;
		msg.channel.send('FIGHT!').then((message)=>{
			var message=message;
			//message.edit('test');
			levelManager.getLevelConv(msg).then((lvl)=>{
				var authorlvl = lvl;
				//message.edit(`${authorlvl}`);
				levelManager.getLevelConv({author: msg.mentions.users.first(), guild: msg.guild}).then((lvl)=>{
					var mentionlvl = lvl;
					message.edit(`${authorlvl} ${mentionlvl}`);
				});
			});
		});
    }
}

module.exports = fight;