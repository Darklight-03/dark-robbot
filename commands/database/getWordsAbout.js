const config = require('../../config.json'); // Import configuration
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
    function filterContainsArg(m){
        if(m.msg_content.toLowerCase().includes(args[0].toLowerCase())){
            return true;
        }
        else return false;
    }

    lists.getAllWords(false,msg.guild,filterContainsArg,undefined,basic.replacePunctuation).then((words)=>{
        lists.sortedNumOcurrancesArr(words).then((ulist)=>{
            ulist = ulist.slice(0,50);
            var str = "";
            str = str+"here are the 50 most common words about "+args[0].toLowerCase()+"\n";
            for(var i = 0;i<ulist.length;i++){
                str = str + ulist[i].v + ": "+ulist[i].n+"\n"
            }
            
            say.reply(msg,str);
        });
    });

    // channelUtils.getAllAllMessages().then((messages) => {
	// 	var arr = [];
	// 	var obj = {};
    //     //for each message, run regex check and count them
    //     lists.getBotsInGuild(msg.guild).then((botlist)=>{
    //         console.log(botlist);
    //         messages.forEach((messagee) => {
    //             if(botlist.has(messagee.msg_author_id)){
    //                 return;
    //             }
    //             var m = messagee.msg_content;
    //             if(m.toLowerCase().includes(args[0].toLowerCase())){
    //             m = m.split(" ");


    //             m.forEach((val)=>{
    //                 if(!(val.includes("://")||val.includes("www."))){
    //                     val = val.replace(/\W/g, '');
    //                     arr.push(val.toLowerCase());
    //                 }
    //             })
    //             //let re = new RegExp(args, 'gi');
    //             //var b = m.match(re);
    //             }
    //         });
    //         var s = arr.reduce(function(m,v){
    //             m[v]=(m[v]||0)+1; return m;
    //         },{});
    //         var a = [];
    //         for (k in s) a.push({k:k,n:s[k]});
    //         a.sort(function(a,b){return b.n-a.n});
    //         a.forEach((elem,index)=>{
    //             if(elem.n==1){
    //                 a.splice(index,1);
    //             }
    //         });
    //         a = a.map(function(a){return a.k});
            
    //         say.reply(msg,JSON.stringify(a));
    //     });
    // });
    // function rand(arr){
    //     return arr[Math.floor(Math.random() * arr.length)];
    // }
    // function randreply(arr){
    //     replies = [`${rand(arr)} chestplate of ${rand(arr)} ${rand(arr)}`,`${rand(arr)} sledgehammer of ${rand(arr)} ${rand(arr)}`,`${rand(arr)} sword of ${rand(arr)}`,`${rand(arr)} ${rand(arr)}`,`${rand(arr)} pants`, `crossbow of ${rand(arr)} ${rand(arr)}`, `potato from ${rand(arr)}`, `${rand(arr)}'s helm of ${rand(arr)}`]
    //     return rand(replies);
    // }

}













