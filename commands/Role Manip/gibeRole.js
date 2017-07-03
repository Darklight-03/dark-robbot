const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const say = require('../Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args) { // Export command function
	var command = "giberole"; // For logging purposes
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	var roles = msg.guild.roles;
	var validroles = [];

	function listMap(value, key, map) {
		if (value.name.charAt(0) == '-') {
			validroles.push(value.name);
		}
	}
	roles.forEach(listMap);
	//console.log(validroles);
	if (args[0].charAt(0) != '-') {
		args = "-" + args;
	}
	let role = msg.guild.roles.find("name", args);
	try {
		if (msg.member.roles.has(role.id)) {
			throw exception;
		}
		if (!validroles.includes(role.name)) {
			throw exception;
		}
		msg.member.addRole(role);
		say.reply(msg,"role added");
	} catch (err) {
		say.reply(msg,"failed to add role (maybe no permission, maybe the role does not exist)");
	}

};


exports.desc = "give the role specified to you"; // Export command description
exports.syntax = "<role>"; // Export command syntax
