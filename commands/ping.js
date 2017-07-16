const say = require('./Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var time = Date.now();
	say.reply(msg,'pinging...').then((message)=>{
		var diff = Date.now()
		diff = diff-time;
		message.edit(`Took ${diff} ms!`);
	});
};

exports.desc = "coffee"; // Export command description
exports.syntax = "coffee"; // Export command syntax
