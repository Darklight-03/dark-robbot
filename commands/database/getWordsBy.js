const Command = require('../../Command.js');
const config = require('../../config.json'); // Import configuration
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
const lists = require('../Basic tasks/lists.js');
const basic = require('../Basic tasks/basic.js');
const commonWords = require('../database/pointlesswords.json');

class getWordsBy extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        console.log(`counting words by ${args}`);
        function filterByAuth(m){
            if(m.msg_author_id==msg.mentions.users.first().id){
                return true;
            }
            else return false;
        }
    
        lists.getAllWords(true,msg.guild,filterByAuth,undefined,basic.replacePunctuation).then((words)=>{
            lists.sortedNumOcurrancesArr(words).then((ulist)=>{
                ulist = ulist.filter((val)=>{
                    if(commonWords.words.includes(val.v)){
                        return false;
                    }else return true;
                });
                ulist = ulist.slice(0,50);
                var str = "";
                str = str+"here are the 50 most common words by "+args[0].toLowerCase()+"\n";
                for(var i = 0;i<ulist.length;i++){
                    str = str + ulist[i].v + ": "+ulist[i].n+"\n"
                }
                
                say.reply(msg,str);
            });
        });
    }
}
module.exports = getWordsBy;