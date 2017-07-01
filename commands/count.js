const config = require('../config.json'); // Import configuration
const say = require('./Basic tasks/say.js');
const channelUtils = require('./Basic tasks/channelUtils.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command's function
	if (!botPerm.hasPermission('SEND_MESSAGES')) {
		// If the bot can't send to the channel...
		msg.author.send("I can't send messages to that channel!");
		// ...PM the user...
		return; // ...and abort command execution.
	}
	var command = "count";
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	if (msg.author.id !== config.ownerID) {
		// If the user is not authorized...
		say.reply(msg, "you are not authorized to use this command!");
		// ...notify the user...
		return; // ...and abort command execution.
	}

	var r = 0;
	if (!(!args)) {		//if not null arguments start.
		say.reply(msg, `looking through ENTIRE CHANNEL for ${args}, warning this may take a VERY long time.`);
	} else {
		return;
	}
	//get all messages in the channel
	channelUtils.getAllMessages(msg.channel).then((messages) => {
		//for each message, run regex check and count them
		messages.forEach((messagee) => {
			m = messagee.toString();
			let re = new RegExp(args, 'gi');
			b = m.match(re);
			if (!(!b)) {
				r = r + (b.length);
			}
		});
		//reply results.
		say.reply(msg, `found ${r} occurances of ${args}`);
	});
};

exports.desc = "counts all occurences of text"; // Export command description
exports.syntax = "count <regex>"; // Export command syntax
