const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');
const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class mute extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		if (typeof msg.mentions.users.first() !== 'undefined') {
			let time  =  parseInt(args[1].substring(0,args[1].length-1));
			let type=  args[1].charAt(args[1].length-1);
			let typehuman;
			let lengthMute;
			if (type == 'm') {
				lengthMute = time * 1000 * 60;
				typehuman = 'minutes';
			}
			if (type == 's') {
				lengthMute = time * 1000;
				typehuman = 'seconds';
			}
			if (type == 'h') {
				lengthMute = time * 1000 * 60 * 60;
				typehuman = 'hours';
			}
			if (!lengthMute) {
				return;
			}
			let users = msg.guild.members;
			let mutee = users.get(msg.mentions.users.first().id);
			let muted = msg.guild.roles.find("name", 'Muted').id;
			var epoch = (new Date).getTime();
	
			try {
				if (!msg.member.hasPermission("KICK_MEMBERS")) {
					say.reply(msg, "U R NOT A MODERATOR");
				} else {
					if (mutee.roles.has(muted)) {
						say.reply(msg, "that user is already muted");
					} else {
						//mute them.
						mutee.roles.add(muted);
						msg.guild.channels.create('temp', 'voice').then(channel => {
							mutee.setVoiceChannel(channel).then(member => {
								channel.delete();
							});
						});
						lengthMute = lengthMute + Date.now();
						database.addMuted(mutee.id, msg.guild.id, lengthMute);
						say.reply(msg, `muted ${mutee.toString()} for ${time} ${typehuman}`);
					}
				}
			} catch (err) {
				say.reply(msg, "failed, " + err.toString());
			}
		}
    }
}

module.exports = mute;
