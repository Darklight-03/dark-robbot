const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class ping extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		var time = Date.now();
		say.reply(msg,'pinging...').then((message)=>{
			var diff = Date.now()
			diff = diff-time;
			message.edit(`Took ${diff} ms!`);
		});
    }
}

module.exports = ping;