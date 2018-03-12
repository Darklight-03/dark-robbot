const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const say = require('../Basic tasks/say.js');
const Command = require('../../Command.js');

class listAllRoles extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		var roles = msg.guild.roles;
		var list = "\n";
	
		
		roles.forEach(this.listMap);
		say.reply(msg,list);
	}
	listMap(value, key, map) {
		if (value.name == "@everyone") {
			list = list + "everyone" + "\n";
		} else {
			list = list + value.name + "\n";
		}
	}
}

module.exports = listAllRoles;