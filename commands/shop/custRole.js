//TODO: WIP

const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');
const shop = require('./shop.js');

exports.changeColor = function (msg) { // Export command function
    say.reply(msg, 'enter a new color to set the role to in hex format (#ffffff is black for example)');
    shop.waitForReply((response)=>{
        console.log(response.first().content);
        r = msg.guild.roles.get('341016737396949023');
        r.setColor(response.first().content).then(()=>{
            msg.reply(`custom role color changed to ${r.hexColor}`);
        });
    });
};

exports.changeName = function (msg) { // Export command function
    say.reply(msg, 'enter a new name to set the role to');
    shop.waitForReply((response)=>{
        console.log(response.first().content);
        r = msg.guild.roles.get('341016737396949023');
        r.setName(`~${response.first().content}`).then(()=>{
            say.reply(msg, `custom rolen name changed to ${r.name}`);
        });
    });  
};