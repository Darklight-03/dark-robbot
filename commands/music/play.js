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
const Command = require('../../Command.js');

class play extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if (!args[0]) {
            return;
        }
        var argumentsf = [];
        var searchtext = '';
        args.forEach((value, index)=>{
            if(!(value.charAt(0)=='-')){
                searchtext = searchtext + ' ' + value;
            }
            else{
                argumentsf.push(value);
            }
        });
        searchtext = searchtext.trim();
        console.log(`play: ${searchtext}, ${argumentsf}`);
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
                    //console.log(`${JSON.stringify(vid,null,4)}`);
                    say.reply(msg, `found ${vid.title}\n${vid.webpage_url}`);
                    this.queueUrl(vid.webpage_url, msg, bot, argumentsf,vid.title);
                });
            });
        } else {
            this.queueUrl(searchtext, msg, bot,argumentsf);
        }
    }
    queueUrl(url, msg, bot, argss, title) {
        var vid = { url: url, title: title };
        musicManager.addQueue(vid, msg, bot);
    }
    queueUrlOld(url, msg, bot, argss,params) {
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
                if(params.includes('-debug')){
                    pastebin.createPaste( `vid object: \n ${JSON.stringify(info.formats,null,4)}`).then((data)=>{
                        say.reply(msg,`${data}`);
                    });
                }            
                say.reply(msg, `added ${info.title} to queue, ${url}`).then(()=>{
                    const soong = ytdl(url, {retries: 25, filter: 'audioonly'}).on('error', err => console.log(err));
                    var vid = { url: soong, title: info.title };
                    if(params.includes('-debug')){
                        pastebin.createPaste( `url object: \n ${JSON.stringify(soong,null,4)}`).then((data)=>{
                            say.reply(msg,`${data}`);
                        });
                    }   
                    musicManager.addQueue(vid, msg, bot);
                });
    
            });        
            
        });
    }
    getinfourl(url, msg, bot){
        
    }
}

module.exports = play;