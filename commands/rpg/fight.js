const say = require('../Basic tasks/say.js');
const levelManager = require('../../levelManager.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm) { 
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
};

exports.desc = "fight"; // Export command description
exports.syntax = "fight <mention>"; // Export command syntax
