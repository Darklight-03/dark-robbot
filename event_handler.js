const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
var database = require('./database.js');
const say = require('./commands/Basic tasks/say.js');

module.exports = { // Export event functions
	"ready": function ready(bot) { // Once the bot is ready (fully booted) ...
		console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${bot.user.username} ready!`); // ...console log a ready message...
		//bot.user.setPresence({ activity: { name: `beep boop`, url: 'http://testdnsplsignore.ddns.net:12345', type: 2 } });		
		database.initializeTables();
	},
	"error": function error(bot) { // If a "serious connection error" occurs...
		console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${bot.user.username} encountered a "serious connection error"!`); // ...console log a notifcation.
	},
	"join": function join(bot, guild) { // Once the bot joins a new server ...
		console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${bot.user.username} has joined a new server! ("${guild.name}")`); // ...console log a notification...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`);
		// ...and log which server was joined and when.
	},
	"leave": function leave(bot, guild) { // Once the bot leaves a server...
		console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${bot.user.username} has left a server! ("${guild.name}")`); // ...console log a notification...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`);
		// ...and log which server was left and when.
	},
	//TODO WIP
	"reaction": function reaction(reaction,user){
		console.log("reactionhappened");
		console.log(reaction.emoji.name);
		if(reaction.emoji.name=="topnep"){
			//say.reply(reaction.message,"topnep recognized");
		}
	}

};
