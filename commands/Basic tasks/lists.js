const config = require('../../config.json'); // Import configuration
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');

getBotsInGuild = function getBotsInGuild(guild) {
    return new Promise((resolve, reject)=>{
        var botlist=guild.members.filter((m)=>{
            return(m.user.bot);
        });
        resolve(botlist);
    });
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * from stackexchange
 * @param {array} array array to be shuffled
 */
shuffleArray = function shuffleArray(array) {
    return new Promise((resolve,reject)=>{
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        resolve(array);
    })
}

/**
 * @param {boolean} includeBots give false to exclude bot messages
 * @param {guild} guild guild to exclude bots from if applicable, and sort only messages from this guild if applicable
 * @param {function} messageFilter function that takes message and returns true if it should be included
 * @param {function} wordFilter function that takes a word and returns true if it should be included
 * @param {function} wordReplace function that takes word and returns what should be included in list
 */
getAllWords = function (includeBots=true, guild=undefined, messageFilter=(msg=>{return true}), wordFilter=((word)=>{return true}), 
                            wordReplace=((word)=>{return word})) { // Export command's function
    return new Promise((resolve,reject)=>{
        channelUtils.getAllAllMessages().then((messages) => {
            var arr = [];
            getBotsInGuild(guild).then((bots)=>{
                //for each message, run regex check and count them
                messages.forEach((messagee) => {
                    if(messageFilter(messagee)&&!(bots.has(messagee.msg_author_id))){
                        
                        var m = messagee.msg_content;
                        m = m.split(" ");
        
        
                        m.forEach((val)=>{
                            if(wordFilter(val)){
                                arr.push(wordReplace(val));
                            }
                        });
                    }
                });
                resolve(arr);
            });
        });
    });
}

numOccurrancesArr = function numOccurrancesArr(arr){
    return new Promise((resolve,reject)=>{
        arr = arr.sort();
        initialarr = [];
        initialarr.last = function(){
            return this[this.length-1]
        }
    
        list = arr.reduce((prevReturn,curElem)=>{
            if(prevReturn.length==0){
                prevReturn.push({v:curElem,n:1});
                return prevReturn;
            }
            if(prevReturn.last().v==curElem){
                prevReturn[prevReturn.length-1] = {v:curElem, n:prevReturn.last().n+1}
                return prevReturn;
            }else{
                prevReturn.push({v:curElem,n:1});
                return prevReturn;
            }
        },initialarr);
        resolve(list);
    });
}

sortedNumOcurrancesArr = function sortedNumOcurrancesArr(arr){
    return new Promise((resolve,reject)=>{
        numOccurrancesArr(arr).then((list)=>{
            list.sort((a,b)=>{
                if(a.n>b.n) return -1;
                if(a.n<b.n) return 1;
                return 0;
            });
            resolve(list);
        });
    });
}

uniqueArr = function uniqueArr(arr){
    return new Promise((resolve,reject)=>{
        arr = arr.sort();
        initialarr = [];
        initialarr.last = function(){
            return this[this.length-1];
        }
        
        list = arr.reduce((prevReturn,curElem)=>{
            if(prevReturn.last()==curElem){
                return prevReturn;
            }else{
                prevReturn.push(curElem);
                return prevReturn;
            }
        },initialarr);
        resolve(list);
    });
}

exports.uniqueArr = uniqueArr;
exports.sortedNumOcurrancesArr = sortedNumOcurrancesArr;
exports.numOccurrancesArr = numOccurrancesArr;
exports.getAllWords = getAllWords;
exports.getBotsInGuild = getBotsInGuild;
exports.shuffleArray = shuffleArray;