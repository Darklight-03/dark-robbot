const say = require('./commands/Basic tasks/say.js');
const database = require('./database.js');

var xp_per_message = 1;
//add xp on sent message if 1 min has passed
exports.handleMessage = function handleMessage(msg) {
    function addToDatabase() {
        return new Promise((resolve, reject) => {
            //if there is no data, create it starting at level 999 with 1 xp
            database.getXP(msg).then((results) => {
                if (!results) {
                    database.insertNewXP(msg, xp_per_message).then((ans) => {
                        resolve({ level: initialLevel, xp: xp_per_message, levelsLost: 1 });
                    });
                } else {
                    //if they are able to gain xp and already had data, then add 1 xp and a level if necessary
                    if (results.next_xp_epoch < Date.now()) {
                        if(Math.random()>.999){
                            say.reply(msg, 'Congratulations, You Win an Iphone 7. Please Visit http://www.freeiphones.org for Your Prize!!!');
                        }
                        var isLevelUp = 0;
                        //if they have enough xp to gain a level, send congrats and save var.
                        function checkLevelUp(lvl) {
                            console.log(`need ${exports.nextLevel(lvl)} to level up, have ${results.xp}`);
                            if (exports.nextLevel(lvl) < results.xp + 1) {
                                isLevelUp++;
                                checkLevelUp(lvl - 1);
                            }
                        }
                        checkLevelUp(results.level);
                        database.addXP(msg, results.xp + xp_per_message, results.level - isLevelUp);
                        resolve({ level: results.level - isLevelUp, xp: results.xp + xp_per_message, levelsLost: isLevelUp })
                    }
                }
            });
        });
    }
    addToDatabase(msg).then(obj => {
        if (obj.levelsLost == 1) {
            say.reply(msg, `lol noob spammer, you have been demoted to level ${obj.level}`);
        }
        if (obj.levelsLost > 1) {
            say.reply(msg, `lol noob spammer, you have been demoted to level ${obj.level} (lost ${obj.levelsLost} levels!)`);
        }
    });
}

//get total xp for next level from curlevel
exports.nextLevel = function nextLevel(curlevel) {
    var baseXP = 6;
    var exponent = 1.2;
    var level = -1 * (curlevel - 1000);
    if (level < 100) {
        return Math.round((.04 * Math.pow(level, 3) + .8 * Math.pow(level, 2) + 2 * level) / 15);
    }
    else {
        return Math.round(((.04 * Math.pow(100, 3) + .8 * Math.pow(100, 2) + 2 * 100) + (Math.pow((level - 100), 1.1) * 305)) / 15);
    }
}