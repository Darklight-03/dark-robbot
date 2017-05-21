const config = require('../config.json'); // Import configuration

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
		msg.reply("you are not authorized to use this command!");
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
		msg.reply(`found ${r} occurances of ${args}`);
	}
	if(!(!args)){
		getMessagesBef(msg.id);
		msg.reply(`looking through ENTIRE CHANNEL for ${args}, warning this may take a VERY long time.`);
	}
	// msg.reply(msg.content);
	// msg.channel.fetchMessages({limit: 100}).then(messages => {
	// 	s = `Received ${messages.size} messages`;
	// 	r = 0;
	// 	messages.forEach((messagee)=>{
	// 		console.log(messagee.toString());
	// 		m = messagee.toString();
	// 		b=m.match(/:topnep:/g);
	// 		if(!(!b)){
	// 			console.log(b);
	// 			r=r+(b.length);
	// 		}
			
	// 	});
	// 	msg.reply(s);
	// 	msg.reply(r);
	// });
	// // m = msg.toString();
	// b=m.match(/:topnep:/g);
	// if(!(!b)){
	// 	console.log(b);
	// 	msg.reply(b.length);
	// }

};

exports.desc = "counts all occurences of text"; // Export command description
exports.syntax = "count <regex>"; // Export command syntax
