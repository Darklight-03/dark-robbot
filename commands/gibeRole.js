const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "giberole"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	var args = msg.content.substr(config.commandPrefix.length + command.length + 1 + config.needsSpace);
	var roles = msg.guild.roles;
	var validroles = [];

	function listMap(value, key, map) {
		if (value.name.charAt(0) == '-') {
			validroles.push(value.name);
		}
	}
	roles.forEach(listMap);
	//console.log(validroles);
	if (args.charAt(0) != '-') {
		args = "-" + args;
	}
	let role = msg.guild.roles.find("name", args);
	try {
		if (msg.member.roles.has(role.id)) {
			msg.reply("u already have dis role noob");
		} else {
			if (validroles.includes(role.name)) {
				msg.member.addRole(role);
				msg.reply("role added");
			} else {
				msg.reply("no permission for dis role");
			}
		}
	} catch (err) {
		msg.reply("failed to add role (maybe no permission, maybe the role does not exist)");
	}

};


exports.desc = "give the role specified to you"; // Export command description
exports.syntax = "<role>"; // Export command syntax
