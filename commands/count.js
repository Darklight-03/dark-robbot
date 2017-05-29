const config = require('../config.json'); // Import configuration
const say = require('./Basic tasks/say.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args) { // Export command's function
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
	if(msg.author.id !== config.ownerID) {
		// If the user is not authorized...
		say.reply(msg,"you are not authorized to use this command!");
		// ...notify the user...
		return; // ...and abort command execution.
	}
	var r=0;
	function getMessagesBef(msgid){
		console.log('finding next 100');
		msg.channel.fetchMessages({limit: 100, before: msgid}).then(messages => {
			console.log(`Received ${messages.size} messages`);
			messages.forEach((messagee)=>{
				//console.log(messagee.toString());
				m = messagee.toString();
				let re = new RegExp(args,'gi');
				b=m.match(re);
				if(!(!b)){
					//console.log(b);
					r=r+(b.length);
				}
				
			});
			let l = messages.array().length;
			console.log(l);
			if(l==100){
				console.log('waiting then finding more.');
				setTimeout(()=>{
					getMessagesBef(messages.last().id);
				},1000*.5);
			}
			else{
				done();
			}
		});
	}
	function done(){
		say.reply(msg,`found ${r} occurances of ${args}`);
	}
	if(!(!args)){
		getMessagesBef(msg.id);
		say.reply(msg,`looking through ENTIRE CHANNEL for ${args}, warning this may take a VERY long time.`);
	}
};

exports.desc = "counts all occurences of text"; // Export command description
exports.syntax = "count <regex>"; // Export command syntax
