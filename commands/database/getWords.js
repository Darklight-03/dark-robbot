const Command = require('../../Command.js');
const config = require('../../config.json'); // Import configuration
const items = require('../rpg/itemnames.json');
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
const lists = require('../Basic tasks/lists.js');
const basic = require('../Basic tasks/basic.js');

class getWords extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    
    exec(bot,msg,args,params){
        lists.getAllWords(true,msg.guild,this.excludeMee6,this.excludeURLS,basic.replacePunctuation).then((words)=>{
            lists.uniqueArr(words).then((ulist)=>{
                say.reply(msg,this.randreply(ulist));
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
    rand(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    randreply(arr){
        var unparsed=this.rand(items.itemnames);
        unparsed=unparsed.replace(/\$/g, ()=>{return this.rand(['$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$ $','$ $', '$ $ $','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$ $','$ $', '$ $ $','$$'])});
        unparsed=unparsed.replace(/\$/g, ()=>{return this.rand(arr)});
        var parsed=unparsed.replace(/#/g,this.rand(items.itemtypes));
        return parsed;
    }
}

module.exports=getWords