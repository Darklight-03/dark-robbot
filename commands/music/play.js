const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const ytdl = require('ytdl-core');
const youtubedl = require('youtube-dl');

var msg;
exports.main = function (bot, message, timeout, botPerm, userPerm, args) { // Export command function
    msg = message;
    if (!args[0]) {
        return;
    }
    search = args.join(' ');
    if (!search.toLowerCase().startsWith('http')) {
        var srch = search;
        search = 'gvsearch1:' + search;
        var vid;
        say.reply(msg, `Searching google for ${srch.replace('@', '')}...`).then(response => {
            youtubedl.getInfo(search, ['-q', '--no-warnings', '--force-ipv4', '-f bestaudio'], (err, info) => {
                if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
                    say.reply(msg, `Invalid video ${search.replace('@', '')}!\n${err}`);
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
function queueUrl(url, msg, bot) {
    var vid;
    say.reply(msg, 'Searching...').then(response => {
        
        ytdl.getInfo(url, {}, function (err,info){
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
            
            say.reply(msg, `added ${info.title} to queue, ${purl.url}`).then(()=>{
                const soong = ytdl(url, {retries: 25, filter: (format) => !format.bitrate && format.audioEncoding === 'opus' }).on('error', err => console.log(err));
                var vid = { url: soong, title: info.title };
                musicManager.addQueue(vid, msg, bot);
            });
            
        });
        
        
    });
}
function getinfourl(url, msg, bot){
    
}


exports.desc = "play song on music"; // Export command description
exports.syntax = "<url>"; // Export command syntax