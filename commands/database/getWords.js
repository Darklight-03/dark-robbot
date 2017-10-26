const config = require('../../config.json'); // Import configuration
const items = require('../rpg/itemnames.json');
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');
const lists = require('../Basic tasks/lists.js');
const basic = require('../Basic tasks/basic.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command's function
	var command = "countWords";
	if (timeout.check(msg.author.id, msg)) {
		return;
    }
    console.log('counting words');

    function excludeURLS(word){
        if(!(word.includes("://")||word.includes("www."))){
            return true;
        }
        else return false;
    }

    //moved to basic tasks/basic.js
    function replacePunctuation(word){
        word = word.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#&*+,\-.\/:;<=>?@\[\]^_`{|}~\r\n]+/g, '');
        // all punctuation::/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g
        // removed: %()$
        // added: \n
        return word.toLowerCase();
    }
    function excludeMee6(msg){
        if(msg.msg_author_id==159985870458322944){
            return false;
        }
        else return true;

    }
    lists.getAllWords(true,msg.guild,excludeMee6,excludeURLS,basic.replacePunctuation).then((words)=>{
        lists.uniqueArr(words).then((ulist)=>{
            say.reply(msg,randreply(ulist));
        });
    });
    
    
    function rand(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function randreply(arr){
        unparsed=rand(items.itemnames);
        unparsed=unparsed.replace(/\$/g, ()=>{return rand(['$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$ $','$ $', '$ $ $','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$','$ $','$ $', '$ $ $','$$'])});
        unparsed=unparsed.replace(/\$/g, ()=>{return rand(arr)});
        parsed=unparsed.replace(/#/g,rand(items.itemtypes));
        return parsed;
    }

}