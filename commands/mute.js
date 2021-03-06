const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');
const say = require('./Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args) { // Export command function
	var command = "mute"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	if(typeof msg.mentions.users.first() !== 'undefined'){
		// Check for cooldown, if on cooldown notify user of it and abort command execution.
		args = args[1];
		let lengthMute = parseInt(args)*1000;
		if(typeof lengthMute == 'undefined'||isNaN(lengthMute)){
			lengthMute = 0;
			console.log('undef lm');
		}
		let arg2 = lengthMute;
		let users = msg.guild.members;
		let mutee = users.get(msg.mentions.users.first().id);
		let muted = msg.guild.roles.find("name", 'Muted').id;
		var epoch = (new Date).getTime();

		try {
			if (!msg.member.hasPermission("KICK_MEMBERS")) {
				say.reply(msg,"U R NOT A MODERATOR");
			} else {
				if (mutee.roles.has(muted)) {
					say.reply(msg,"that user is already muted");
				} else {
					//mute them.
					mutee.addRole(muted);
					msg.guild.createChannel('temp', 'voice').then(channel => {
						mutee.setVoiceChannel(channel).then(member => {
							channel.delete();
						});
					});
					lengthMute = lengthMute+Date.now();
					database.addMuted(mutee.id, msg.guild.id, lengthMute);
					say.reply(msg,"muted " + mutee.toString() + ' for ' + arg2 / 1000 + ' seconds.');
				}
			}
		} catch (err) {
			say.reply(msg,"failed, " + err.toString());
		}
	}
};


exports.desc = "mute the user specified"; // Export command description
exports.syntax = "<user>"; // Export command syntax
