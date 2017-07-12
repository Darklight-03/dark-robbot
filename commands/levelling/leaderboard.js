const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    database.leaderboard(msg.guild.id).then((leaderboard)=>{
        var s = '\n';
        leaderboard.forEach((item, place)=>{
            msg.guild.fetchMember(item.user_id).then((member)=>{
                var name = member.nickname;
                if(!name){
                    name = member.user.username;
                }
                s = s + `${place+1}. ${name}: level ${item.level} \n`
                if(place==leaderboard.length-1){
                    say.reply(msg,s);
                }
            }); 
        });
    });
};


exports.desc = "skip song on music"; // Export command description
exports.syntax = ""; // Export command syntax