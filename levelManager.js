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
    var level = Math.abs(curlevel-10000);
    return Math.round(.04 * Math.pow(level,3) + .8 * Math.pow(level,2) + 2 * level)
}