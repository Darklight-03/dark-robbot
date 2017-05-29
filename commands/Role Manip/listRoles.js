const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "listroles"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	var roles = msg.guild.roles;
	var list = "\n";

	function listMap(value, key, map) {
		if (value.name.charAt(0) == '-') {
			list = list + value.name + "\n";
		}
	}
	roles.forEach(listMap);
	msg.reply(list);
};

exports.desc = "list all roles"; // Export command description
exports.syntax = "none"; // Export command syntax
