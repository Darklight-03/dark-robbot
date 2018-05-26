const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const say = require('../Basic tasks/say.js');
const Command = require('../../Command.js');
var validroles = [];

class takeRole extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		var roles = msg.guild.roles;
		
	
		
		roles.forEach(this.listMap);
		//console.log(validroles);
		if (args[0].charAt(0) != '-' && args[0].charAt(0) != '~') {
			args = "-" + args[0];
		}
		else{
			args = args[0];
		}
		let role = msg.guild.roles.find("name", args);
		if (role == null) {
			say.reply(msg,"I CANNOT TAKE THIS ROLE");
		} else {
	
			try {
				if (msg.member.roles.has(role.id)) {
					if (validroles.includes(role.name)) {
						msg.member.roles.remove(role);
						say.reply(msg,"STOLE ROLE " + role.toString() + " FROM " + msg.member.toString());
					} else {
						say.reply(msg,"I CANNOT TAKE THIS ROLE");
					}
				} else {
					say.reply(msg,"I CANNOT TAKE WHAT YOU DON'T HAVE");
				}
			} catch (err) {
				say.reply(msg,"error " + err.toString());
			}
		}
	}
	listMap(value, key, map) {
		if (value.name.charAt(0) == '-' || value.name.charAt(0) == '~') {
			validroles.push(value.name);
		}
	}
}

module.exports = takeRole;
exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
	

};


exports.desc = "give the role specified to you"; // Export command description
exports.syntax = "<role>"; // Export command syntax
