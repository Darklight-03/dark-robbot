//TODO WIP

var Command = require('../../Command.js');
var words = require('./pointlesswords.json');
const say = require('../Basic tasks/say.js');
const updateJsonFile = require('update-json-file');

class addPointlessWords extends Command{
	constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    
    exec(bot,msg,args,params){
        words.words = words.words.concat(args);
        var s = new Set(words.words);
        words.words = Array.from(s);

        var filePath = './commands/database/pointlesswords.json';
        updateJsonFile(filePath, (data) => {
            data.words = words.words;
            return data;
        })
        
        say.reply(msg,JSON.stringify(words.words));
    }
}

module.exports = addPointlessWords;