const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');
var Command = require('../../Command.js');

class calcTotalLevel extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        var xp = 0;
        var level = 9999;
        database.getMessages().then((messages) => {
            messages.forEach((message, i) => {
                if (message.msg_author_id == msg.author.id) {
                    xp++;
                }
                if (i == messages.length - 1) {
                    while (levelManager.nextLevel(level) < xp) {
                        level--;
                    }
                    say.reply(msg, `You would be level ${level} with ${xp}`);
                }
            });
        });
    }
}

module.exports = calcTotalLevel;