const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const youtubedl = require('youtube-dl');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function

    if(!args[0]){
        return;
    }

    if (!args[0].toLowerCase().startsWith('http')) {
        args[0] = 'gvsearch1:' + args[0];
    }
    var vid;
    say.reply(msg, 'Searching...').then(response => {
        youtubedl.getInfo(args[0], ['-q', '--no-warnings', '--force-ipv4', '-f bestaudio'], (err, info) => {
            if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
                say.reply(msg, `Invalid video ${args[0]}!`);
                return;
            }
            vid = info;
            say.reply(msg, `added ${vid.title} to queue, ${vid.url}`);
            musicManager.addQueue(vid,msg,bot);
        });
    });
};


exports.desc = "play song on music"; // Export command description
exports.syntax = "<url>"; // Export command syntax