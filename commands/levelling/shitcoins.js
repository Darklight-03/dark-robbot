const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    database.getMoney(msg).then((data)=>{
        say.reply(msg,`You have ${data.money} shitcoins, and ${data.gems} gems`);
    }).catch(()=>{
        say.reply(msg,`You have ${0} shitcoins, and ${0} gems`);
    });
};


exports.desc = "skip song on music"; // Export command description
exports.syntax = ""; // Export command syntax