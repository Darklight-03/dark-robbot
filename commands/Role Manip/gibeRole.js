const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const say = require('../Basic tasks/say.js');
const Command = require('../../Command.js');

class gibeRole extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		var roles = msg.guild.roles;
		var validroles = [];
	
		
		roles.forEach(this.listMap);
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
			msg.member.role.add(role);
			say.reply(msg,"role added");
		} catch (err) {
			say.reply(msg,"failed to add role (maybe no permission, maybe the role does not exist)");
		}
	}
	listMap(value, key, map) {
		if (value.name.charAt(0) == '-') {
			validroles.push(value.name);
		}
	}
}

module.exports = gibeRole;