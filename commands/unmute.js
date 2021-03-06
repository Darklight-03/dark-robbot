const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');
const say = require('./Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "mute"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	if(typeof msg.mentions.users.first() !== 'undefined'){
		// Check for cooldown, if on cooldown notify user of it and abort command execution.
		let users = msg.guild.members;
		let mutee = users.get(msg.mentions.users.first().id);
		//console.log(msg.mentions.users.first());
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
};


exports.desc = "unmute the user specified"; // Export command description
exports.syntax = "<user>"; // Export command syntax
