const config = require('../config.json');
const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');

class delmsg extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if (!msg.member.hasPermission("KICK_MEMBERS")) {
            say.reply(msg,"U R NOT A MODERATOR");
            return;   
        }
        let server = msg.guild;
        let s = '';
        let time = Date.now();
        let minus = parseInt(args[0].substring(0,args[0].length-1));
        let type = args[0].charAt(args[0].length-1);
        let fintime;
        if(type=='m'){
            fintime = time - minus*1000*60;
            typehuman = 'minutes';
        }
        if(type == 's'){
            fintime = time - minus*1000;
            typehuman = 'seconds';
        }
        if(type == 'h'){
            fintime = time - minus*1000*60*60;
            typehuman = 'hours';
        }
        if(!fintime){
            return;
        }
        msg.channel.fetchMessages({limit: 100}).then(messages => {
            console.log(`Received ${messages.size} messages`);
            messages.forEach((messagee,i)=>{
                if(messagee.createdTimestamp>fintime){
                    setTimeout(()=>{
                        messagee.delete();
                    },1000*i);
                }
            });
        });
        say.reply(msg,`removed messages from up to ${minus} ${typehuman} ago`);
    }
}

module.exports = delmsg;