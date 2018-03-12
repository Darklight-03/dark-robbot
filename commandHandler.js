const config = require('./config.json'); // Import configuration
const Command = require('./Command.js');

/**
	Replace (cut out) bot prefix, cut out whitespaces at start and end, split prefix, command
	and arg into array, convert to lowercase and select the command part ([0] of the array)
	and run command
*/
exports.runCommand = function (bot, msg, timeout, commands) {
	const botPerm = msg.guild.member(bot.user); // For permission checking on the bot's side later on in the commands
	const userPerm = msg.guild.member(msg.member.user); // For permission checking on the user's side later on in the commands
	var command = msg.content.replace(config.commandPrefix, '').trim().split(' ')[0]; //remove prefix
	var args = msg.content.replace(config.commandPrefix, '').replace(command, ''); //remove prefix and command
	command = command.toLowerCase(); // get all lowercase command
	var matches = args.match(new RegExp(/"([^"]*)"|'([^']*)'|[^\s]+/, 'g'));
	var argsfinal = [];
	if (!(!(matches))) {
		matches.forEach((i) => {
			if (i[0] == i[0]) {
				if (i[0] == '\'' || i[0] == '\"') str = i.substring(1, i.length - 1); else str = i;
			}
			argsfinal.push(str);
		});
		console.log(command+" "+argsfinal);
	}
	if (Object.keys(commands).indexOf(command) > -1) {
		console.log(`${msg} yp\n`)
		const comclass = commands[command];
		const c = new comclass(bot, msg, timeout, botPerm, userPerm, argsfinal);
		// If the given command is an actual command that is available...
		// commands[command].exec(bot, msg, timeout, botPerm, userPerm, argsfinal);
		setTimeout(() => {
			msg.delete();
		}, 1000 * 60 * 3);
		// ...run the command.
	}
};
