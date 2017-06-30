const Discord = require('discord.js'); // Obvious bot base
const bot = new Discord.Client(); // Initialize bot instance
const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For ignore list checking
var Events = require('./event_handler.js'); // Load event handler
var commandHandler = require('./commandHandler.js'); // Load command handler
var Commands = require('./command_loader.js'); // Load command loader
		Commands.initialize(require("path").join(__dirname, config.commandPath));
var playableGames = require('./res/games.json'); //loads all the games that the bot can play
var DMResponses = require('./res/DMResponses.json');
var database = require('./database.js');

database.connect();

bot.once('ready', () => { // Ready message once bot is loaded
	Events.ready(bot);
});

bot.on('error', () => { // Listen to errors
	Events.error(bot);
});

bot.on('guildCreate', guild => { // Listen to joins
	Events.join(bot, guild);
});

bot.on('guildDelete', guild => { // Listen to leaves
	Events.leave(bot, guild);
});

var timeout = {
	// Timeout function for command cooldown, courtesy of u/pilar6195 on reddit
	"users": [],
	"check": function (userID, msg) {
		if (timeout.users.indexOf(userID) > -1) {
			// If the user is on timeout don't let them use the command
			say.reply(msg,`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
			return true;
		} else if (config.ownerID !== userID) {
			// If the user is not the bot owner and is not on timeout, let them use the command and add their user id to the timeout
			timeout.set(userID); // use set function on the userID
			return false;
		}
	},
	"set": function (userID) {
		timeout.users.push(userID);
		// Push the userID into the timeout array
		setTimeout(function () {
			// Set timeout for, well, the timeout
			timeout.users.splice(timeout.users.indexOf(userID), 1);
			// Take out the user after timeout is up
		}, (config.commandCooldown * 1000));
		// Set the cooldown to the configured amount
	}
};

setInterval(function () {
	let n = Math.floor(Math.random() * (playableGames.games.length - 0));
	bot.user.setGame(playableGames.games[n]);
}, 60*1000); // Repeats every 60 seconds, which is already faster than necessary

setInterval(() => {
	try {
		//checks muted list to see if anyone needs to be unmuted
		//console.log('checking muted files');
		//checks for files
		
		database.getMuted('epoch_unmute').then((result) => {
			times = result;
			database.getMuted('member_id').then((result) => {
				ppls = result;
				database.getMuted('guild_id').then((result) => {
					servers = result;

					ppls.forEach((cv, index, array) => {
						console.log('index: ', index);
						let guildid = servers[index];
						let muteeid = ppls[index];
						let timeUnmute = times[index];
						let guild = bot.guilds.get(guildid);
						let muted = guild.roles.find('name', 'Muted').id;
						let mutee = guild.members.get(muteeid);
						if (mutee.roles.has(muted)) {
							if (timeUnmute < Date.now()) {
								
								mutee.removeRole(muted);
								guild.defaultChannel.send(mutee + ' you have been unmuted!');
								database.removeMuted(mutee.id, guild.id);
							}
						}
						else {
							database.removeMuted(mutee.id, guild.id);
						}
					});
				});
			});
		});

		
	} catch (err) {
		console.log(err.toString());
	}
}, 30000);

bot.on('message', msg => { // Listen to all messages sent
	if (msg.author.bot) {
		return;
	} // Ignore any bot messages
	if (msg.channel.type == "dm") {
		// If the message is from a private channel...
		msg.channel.send(DMResponses.responses[Math.floor(Math.random() * (DMResponses.responses.length))]);
		// ...notify the user...
		return;
		// ...and abort command execution.
	}
	if (!msg.content.startsWith(config.commandPrefix)) {
		return;
	} // Don't listen to messages not starting with bot prefix
	if (msg.content == config.commandPrefix) {
		return;
	} // Ignore empty commands (messages containing just the prefix)
	commandHandler.runCommand(bot,msg,timeout,Commands.commands);
	
});

bot.login(config.token); // Log the bot in with token set in config
