const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../database.js');
const say = require('./Basic tasks/say.js');

const youtubedl = require('youtube-dl');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function



    if (!args[0].toLowerCase().startsWith('http')) {
        args[0] = 'gvsearch1:' + args[0];
        msg.reply(args[0]);
    }
    var vid;
    msg.reply('Searching...').then(response => {
        youtubedl.getInfo(args[0], ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
            if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
                msg.reply('Invalid video!');
                return;
            }
            msg.reply(info.url);
            vid = info;
            msg.guild.channels.forEach((channel) => {
                if (channel.type == 'voice' && channel.id == '185579003837546496') {
                    channel.join().then(connection => {
                        connection.playStream(vid.url);
                        msg.reply('done');
                    });
                }
            });
        });
    });





};


exports.desc = "play song on music"; // Export command description
exports.syntax = "<url>"; // Export command syntax