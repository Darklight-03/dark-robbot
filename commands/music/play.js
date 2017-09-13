const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const ytdl = require('ytdl-core');
const youtubedl = require('youtube-dl');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function

    if (!args[0]) {
        return;
    }
    search = args.join(' ');
    if (!search.toLowerCase().startsWith('http')) {
        srch = search;
        search = 'gvsearch1:' + search;
        var vid;
        say.reply(msg, `Searching google for ${srch.replace('@','')}...`).then(response => {
            youtubedl.getInfo(search, ['-q', '--no-warnings', '--force-ipv4', '-f bestaudio'], (err, info) => {
                if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
                    say.reply(msg, `Invalid video ${search.replace('@','')}!\n${err}`);
                    return;
                }
                vid = info;
                say.reply(msg, `found ${vid.title}`);
                queueUrl(vid.webpage_url, msg, bot);
            });
        });
    } else {
        queueUrl(search, msg, bot);
    }
};
function queueUrl(url, msg, bot){
    var vid;
    say.reply(msg, 'Searching...').then(response => {
        ytdl.getInfo(url, {}, (err, info) => {
            if (err) {
                say.reply(msg, `Invalid video ${url.replace('@', '')}!\\${err}`);
                console.log(info);
                console.log(err);

                console.log(info.format_id);
                return;
            }
            purl = info.formats.find(function (format) {
                return format.type.includes('audio');
            });
            vid = { url: purl.url, title: info.title };
            say.reply(msg, `added ${vid.title} to queue, ${vid.url}`);
            musicManager.addQueue(vid, msg, bot);
        });
    });
}


exports.desc = "play song on music"; // Export command description
exports.syntax = "<url>"; // Export command syntax