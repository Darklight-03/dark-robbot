const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const ytdl = require('ytdl-core');
const youtubedl = require('youtube-dl');
var PastebinAPI = require('pastebin-js');
    pastebin = new PastebinAPI(config.pastebinapikey);
var msg;
exports.main = function (bot, message, timeout, botPerm, userPerm, args) { // Export command function
    msg = message;
    if (!args[0]) {
        return;
    }
    var arguments = [];
    var searchtext = '';
    args.forEach((value, index)=>{
        if(!(value.charAt(0)=='-')){
            searchtext = searchtext + ' ' + value;
        }
        else{
            arguments.push(value);
        }
    });
    searchtext = searchtext.trim();
    console.log(`play: ${searchtext}, ${arguments}`);
    if (!searchtext.toLowerCase().startsWith('http')) {
        var gvsearch = 'gvsearch1:'+searchtext;
        var vid;
        say.reply(msg, `Searching google for ${searchtext.replace('@', '')}...`).then(response => {
            youtubedl.getInfo(gvsearch, ['-q', '--no-warnings', '--force-ipv4', '-f bestaudio'], (err, info) => {
                if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
                    say.reply(msg, `Invalid video ${gvsearch.replace('@', '')}!\n${err}`);
                    return;
                }
                vid = info;
                say.reply(msg, `found ${vid.title}`);
                queueUrl(vid.webpage_url, msg, bot, arguments);
            });
        });
    } else {
        queueUrl(searchtext, msg, bot,arguments);
    }
};
function queueUrl(url, msg, bot, argss) {
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
            if(argss.includes('-debug')){
                pastebin.createPaste( `vid object: \n ${JSON.stringify(info.formats,null,4)}`).then((data)=>{
                    say.reply(msg,`${data}`);
                });
            }            
            say.reply(msg, `added ${info.title} to queue, ${url}`).then(()=>{
                const soong = ytdl(url, {retries: 25, filter: 'audioonly'}).on('error', err => console.log(err));
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