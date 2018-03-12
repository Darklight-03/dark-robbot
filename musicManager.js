const say = require('./commands/Basic tasks/say.js');
const ytdl = require('youtube-dl');
var queue = [];

function nowPlaying(msg){
    if(queue.length!=0){
    say.reply(msg, 'now playing' +queue[0].song.title);
    }
    else{
        say.reply(msg, 'not currently playing anything');
    }
}

function showQueue(msg){
    if(queue.length ==0){
        say.reply(msg, 'queue is currently empty');
        return;
    }
    let s = '';
    queue.forEach((item)=>{
        s = s+item.song.title;
    });
    say.reply(msg, 'queue: '+s);
}

function skip(bot){
    if(queue.length!=0){
        queue[0].stream.end();
    }
}

function addQueue(song, msg, bot) {
    //add a song/msg object to queue
    queue.push(new Object({ song: song, msg: msg }));
    if (queue.length == 1) {
        playNext(bot);
    }
}
//play the next thing in queue
function playNext(bot) {
    //if queue empty leave channel
    if (queue.length == 0) {
        bot.voiceConnections.forEach((con) => {
            con.disconnect();
        });
        return;
    }
    //otherwise join channel
    var obj = queue[0];
    var connection = obj.msg.guild.voiceConnection;
    if (connection != null) {
        //play next thing in queue
        play(obj, connection, bot);
        return;
    }else{
        let channel = obj.msg.guild.channels.find('name','Music')
        if (channel.type == 'voice') {
            channel.join().then(connection => {
                console.log(obj);
                //play next thing in queue
                play(obj,connection,bot);
            });
        }
    }
}

function play(obj, connection, bot) {
    var streamdispatcher = connection.play(ytdl(obj.song.url), { volume: .3 })
    queue[0] = new Object({song: obj.song, msg: obj.msg ,stream: streamdispatcher});
    //bot.user.setGame(obj.song.title);
    //when song ends, play next one
    queue[0].stream.on('end', (reason) => {
        say.reply(obj.msg, 'ended song, reason: '+ reason);
        queue.shift();
        playNext(bot);
    });
    queue[0].stream.on('error', (err) => {
        say.reply(obj.msg, 'error: '+ err);
        queue.shift();
        playNext(bot);
    });
    say.reply(obj.msg, `Now playing ${obj.song.title}`);
}

exports.addQueue = addQueue;
exports.playNext = playNext;
exports.skip = skip;
exports.nowPlaying = nowPlaying;
exports.showQueue = showQueue;