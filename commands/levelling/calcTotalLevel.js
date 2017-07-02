const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    var xp = 0;
    var level = 9999;
    database.getMessages().then((messages) => {
        console.log('started');
        messages.forEach((message, i) => {
            console.log('dong');
            if (message.msg_author_id == msg.author.id) {
                xp++;

                console.log('doing');

            }
            if (i == messages.length - 1) {
                console.log('done');
                while (levelManager.nextLevel(level) < xp) {
                    level--;
                }
                say.reply(msg, `You would be level ${level} with ${xp}`);
            }
        });
    });
};


exports.desc = "skip song on music"; // Export command description
exports.syntax = ""; // Export command syntax