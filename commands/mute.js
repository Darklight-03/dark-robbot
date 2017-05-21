const config = require('../config.json'); // Import configuration

const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "mute"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	if(typeof msg.mentions.users.first() !== 'undefined'){
		// Check for cooldown, if on cooldown notify user of it and abort command execution.
		let args = msg.content.substr(config.commandPrefix.length + command.length + 1 + config.needsSpace);
		let lengthMute = parseInt(args.trim().split(' ')[1])*1000;
		if(typeof lengthMute == 'undefined'||isNaN(lengthMute)){
			lengthMute = 0;
			console.log('undef lm');
		}
		let arg2 = lengthMute;
		let users = msg.guild.members;
		let mutee = users.get(msg.mentions.users.first().id);
		//console.log(msg.mentions.users.first());
		let muted = msg.guild.roles.find("name", 'Muted').id;
		var epoch = (new Date).getTime();
		//var epoch_unmute = lengthMute + epoch;
		

		//TODO figure out ^^
		try {
			if (!msg.member.hasPermission("KICK_MEMBERS")) {
				msg.reply("U R NOT A MODERATOR");
			} else {
				if (mutee.roles.has(muted)) {
					msg.reply("that user is already muted");
				} else {
					//mute them.
					mutee.addRole(muted);
					msg.guild.createChannel('temp', 'voice').then(channel => {
						mutee.setVoiceChannel(channel).then(member => {
							channel.delete();
						});
					});
					lengthMute = lengthMute+Date.now();
					// fs.writeFile('serverconf/muted/' + mutee.id, msg.guild.id+' '+lengthMute, (err) => {
					// 	if (err) {
					// 		msg.reply("error writing to file, err: " + err.toString());
					// 	}
					// });
					database.addMuted(mutee.id, msg.guild.id, lengthMute);
					msg.reply("muted " + mutee.toString() + ' for ' + arg2 / 1000 + ' seconds.');
				}
			}
		} catch (err) {
			msg.reply("failed, " + err.toString());
		}
	}
};


exports.desc = "mute the user specified"; // Export command description
exports.syntax = "<user>"; // Export command syntax
