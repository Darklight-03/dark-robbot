const config = require('./config.json'); // Import configuration

/**
	Replace (cut out) bot prefix, cut out whitespaces at start and end, split prefix, command
	and arg into array, convert to lowercase and select the command part ([0] of the array)
	and run command
*/
exports.runCommand = function(bot,msg,timeout,commands){
	const botPerm = msg.guild.member(bot.user); // For permission checking on the bot's side later on in the commands
	const userPerm = msg.guild.member(msg.member.user); // For permission checking on the user's side later on in the commands
	var command = msg.content.replace(config.commandPrefix, '').trim().split(' ')[0].toLowerCase();
	if (Object.keys(commands).indexOf(command) > -1) {
		// If the given command is an actual command that is available...
		commands[command].main(bot, msg, timeout, botPerm, userPerm);
		// ...run the command.
	}
};
