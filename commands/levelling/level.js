const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');
const Command = require('../../Command.js');

class level extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        database.currentLevelData(msg).then((data)=>{
            database.position(msg).then((place)=>{
                say.reply(msg,`You are currently level ${data.level}, and need ${levelManager.nextLevel(data.level)-data.xp} more spamming \
to get demoted again, putting you at the #${place} position`)
            });
        });
    }
}

module.exports = level;