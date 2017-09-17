const config = require('../../config.json'); // Import configuration
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command's function
	if (!botPerm.hasPermission('SEND_MESSAGES')) {
		// If the bot can't send to the channel...
		msg.author.send("I can't send messages to that channel!");
		// ...PM the user...
		return; // ...and abort command execution.
	}
	var command = "count";
	if (timeout.check(msg.author.id, msg)) {
		return;
	}

	var r = 0;
	if (!(!args)) {		//if not null arguments start.
		say.reply(msg, `looking through ENTIRE CHANNEL for ${args}, warning this may take a VERY short time.`);
	} else {
		return;
	}
	//get all messages in the channel
	channelUtils.getAllMessages(msg.channel).then((messages) => {
		var arr = [];
		var obj = {};
		//for each message, run regex check and count them
		messages.forEach((messagee) => {
			var m = messagee.msg_content;
			let re = new RegExp(args, 'gi');
			var b = m.match(re);
			if (!(!b)) {
				//add the amount of occurrances in the message to the array
				r = r + (b.length);
				for(i = 0;i<b.length;i++){
					arr.push(bot.fetchUser(messagee.msg_author_id));
				}
			}
		});
		//reply results.
		Promise.all(arr).then((arr2)=>{
			arr2.forEach((el)=>{
				var arr = [];
				arr.push(msg.guild.fetchMember(el));
			});
			Promise.all(arr).then((values)=>{
				console.log(values[0].username);
				values.forEach((arr)=>{
					if(!obj[arr.username]){
						obj[arr.username]=0;
					}
					++obj[arr.username];
				});
				say.reply(msg, `found ${r} occurances of ${args}\n\n${JSON.stringify(obj)}`);
			});
		});
		// Promise.all(arr).then((values)=>{
		// });	
	});
};

exports.desc = "counts all occurences of text"; // Export command description
exports.syntax = "count <regex>"; // Export command syntax
