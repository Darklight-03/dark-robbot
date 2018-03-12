const Command = require('../../Command.js');
const config = require('../../config.json'); // Import configuration
const items = require('../rpg/itemnames.json');
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
const basic = require('../Basic tasks/basic.js');
const lists = require('../Basic tasks/lists.js');

class getWordsList extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        lists.getAllWords(true,msg.guild,this.excludeMee6,this.excludeURLS,basic.replacePunctuation).then((words)=>{
            lists.sortedNumOcurrancesArr(words).then((ulist)=>{
                ulist = ulist.slice(0,300);
                var str = "";
                for(var i = 0;i<ulist.length;i++){
                    str = str + ulist[i].v + ": "+ulist[i].n+"\n"
                }
                say.reply(msg,str);
            });
        });
    }
    excludeURLS(word){
        if(!(word.includes("://")||word.includes("www."))){
            return true;
        }
        else return false;
    }
    excludeMee6(msg){
        if(msg.msg_author_id==159985870458322944){
            return false;
        }
        else return true;

    }

}

module.exports = getWordsList;