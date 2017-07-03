const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

var omsg;
var costOfColor = 10;

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    omsg = msg;
    if (!msg.channel.name=="shop") {
				say.reply(msg,"U R NOT IN SHOP");
                return;
    }
    say.reply(msg,'\nWelcome to the shop!\n\nMake a selection:\n1. Name Colors\n2. XP boosts\n3. Modify Bot\n4.Unlock Features\n');
    waitForReply(shopMenu1);
};
function shopMenu1(m){
    console.log(m.first().content);
    switch(m.first().content){
        case '1':
            shopMenuColors();
        break;
        case '2':
            shopMenuXP();
        break;
        case '3':
            shopMenuBot();
        break;
        case '4':
            shopMenuFeatures();
        break;
        default:
            say.reply(m.first(),'error, wrong input');
        break;
    }
}
function shopMenuColors(){
	var roles = omsg.guild.roles;
	var list = "\n";

	function listMap(value, key, map) {
		if (value.name.charAt(0) == '~') {
			list = list + `${value.calculatedPosition}. ${value.name}\n`;
		}
	}
	roles.forEach(listMap);
	say.reply(omsg,`Welcome to the Color shop. Pick an option: ${list}`);
    waitForReply(shopMenuC1);
}
function shopMenuC1(m){
    var roles = omsg.guild.roles;
	var list = [];

	function listMap(value, key, map) {
		if (value.name.charAt(0) == '~') {
			list.push(value.calculatedPosition);
		}
	}
    roles.forEach(listMap);
	role = roles.find('calculatedPosition',parseInt(m.first().content));
    try {
        if (!(list.includes(role.calculatedPosition))){
            var reason = 'not available for purchase';
            throw exception;
        }
		if (omsg.member.roles.has(role.id)) {
            var reason = 'already have it';
			throw exception;
		}
        if(!(buyItem(costOfColor,'money'))){
            var reason = 'not enough money';
            throw exception;
        }
        console.log(`${omsg.author.name} has purchased ${role.name} for ${costOfColor}`);
		omsg.member.addRole(role);
		say.reply(omsg,`thank you for your purchase of ${role.name}`);
	} catch (err) {
		say.reply(omsg,`failed to add role because ${reason}`);
	}
}
function shopMenuXP(){

}
function shopMenuBot(){

}
function shopMenuFeatures(){

}
function waitForReply(func){
    omsg.channel.awaitMessages(m=>{
        if(m.author.id==omsg.author.id){
            return true;
        }
        else return false;
    }, {max:1, time:60000, errors: ['time']})
    .then((collected) => func(collected))
    .catch(collected => {say.reply(omsg,`You did not respond in 1 minute. Please start again. ${collected}`)});
}
function buyItem(cost,resource){
    return false;
}

exports.desc = "shop menu."; // Export command description
exports.syntax = ""; // Export command syntax