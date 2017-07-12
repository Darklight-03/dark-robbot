const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    say.reply(msg,`the xp needed (total) for level ${args[1]} is ${levelManager.nextLevel(args[1])} xp`)
};


exports.desc = "skip song on music"; // Export command description
exports.syntax = ""; // Export command syntax