exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	if (!botPerm.hasPermission('SEND_MESSAGES')) {
		// If the bot can't send to the channel...
		msg.author.send("I can't send messages to that channel!");
		// ...PM the user...
		return; // ...and abort command execution.
	}
	var command = "coffee";
	if (timeout.check(msg.author.id, msg)) {
		return;
	}
	if (bot.user.presence.status == "invisible") {
		return;
	}
	msg.reply('MAKING COFFEE');
	setTimeout(function() {
		msg.reply('COFFEE FINISHED');
	}, 1200);
};

exports.desc = "coffee"; // Export command description
exports.syntax = "coffee"; // Export command syntax
