const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');
const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class CommandName extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){

		if(typeof msg.mentions.users.first() !== 'undefined'){
			// Check for cooldown, if on cooldown notify user of it and abort command execution.
			let users = msg.guild.members;
			let mutee = users.get(msg.mentions.users.first().id);
			let muted = msg.guild.roles.find("name", 'Muted').id;

			try {
				if (!msg.member.hasPermission("KICK_MEMBERS")) {
					say.reply(msg,"U R NOT A MODERATOR");
				} else {
					if (mutee.roles.has(muted)) {
						mutee.removeRole(muted);
						database.removeMuted(mutee.id,msg.guild.id);
						say.reply(msg,"UNMUTED " + mutee.toString());
					} else {
						say.reply(msg,mutee.toString() + " IS NOT MUTED. CANNOT COMPUTE. KMS.");
					}
				}
			} catch (err) {
				say.reply(msg,"failed, " + err.toString());
			}
		}
    }
}

module.exports = CommandName;