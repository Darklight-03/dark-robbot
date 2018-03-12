const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class coffee extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
		say.reply(msg,'MAKING COFFEE');
		setTimeout(function() {
			say.reply(msg,'COFFEE FINISHED');
		}, 1200);
    }
}

module.exports = coffee;
