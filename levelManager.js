const say = require('./commands/Basic tasks/say.js');
const database = require('./database.js');

//add xp on sent message if 1 min has passed
exports.handleMessage = function handleMessage(msg){
    database.addXP(msg);
}

//get total xp for next level from curlevel
exports.nextLevel = function(curlevel){
    var baseXP = 6;
    var exponent = 1.2;
    var level = -1*(curlevel-1000);
    if(level<100){
        return Math.round((.04 * Math.pow(level,3) + .8 * Math.pow(level,2) + 2 * level)/15);
    }
    else{
        return Math.round(((.04 * Math.pow(100,3) + .8 * Math.pow(100,2) + 2 * 100)+(Math.pow((level-100),1.1)*305))/15);
    }
}