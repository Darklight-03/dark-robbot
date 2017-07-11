const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');

var omsg;
var costOfColor = { price: 10, resource: 'money' };

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    omsg = msg;
    if (!msg.channel.name == "shop") {
        say.reply(msg, "U R NOT IN SHOP");
        return;
    }
    say.reply(msg, '\nWelcome to the shop!\n\nMake a selection:\n1. Name Colors\n2. XP boosts\n3. Modify Bot\n4.Unlock Features\n');
    waitForReply(shopMenu1);
};
function shopMenu1(m) {
    console.log(m.first().content);
    switch (m.first().content) {
        case '1':
            shopMenuColors();
            var roles = omsg.guild.roles;
            var menuItems = [];
            function listMap(value, key, map) {
                if (value.name.charAt(0) == '~') {
                    menuItems.push({
                        name: value.name, price: costOfColor, giveItem: () => {
                            if (omsg.member.roles.has(role.id)) {
                                throw {title: 'alreadyHaveItException', message: 'you already have this role!'};
                            }
                            omsg.member.addRole(role);
                            say.reply(omsg, `thank you for your purchase of ${role.name}`);
                        }
                    });
                }
            }
            roles.forEach(listMap);
            genericMenu(menuItems, `Color Shop`)
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
            say.reply(m.first(), 'error, wrong input');
            break;
    }
}
function shopMenuXP() {

}
function shopMenuBot() {

}
function shopMenuFeatures() {

}
function genericMenu(menuItems, title) {
    var list = '\n';
    menuItems.forEach(item => {
        list = `${list}${number}. ${item.name}: ${item.price}\n`;
    });
    say.reply(omsg, `Welcome to the ${title} shop. Pick an option: ${list}`);
    waitForReply(genericBuy, menuItems);
}
function genericBuy(collected, menuItems) {
    var toBuy = menuItems[parseInt(collected)];
    if (buyItem(toBuy.price.amount, toBuy.price.resource)) {
        toBuy.giveItem();
        console.log(`${omsg.author.name} has purchased ${toBuy.name} for ${toBuy.price.amount} ${toBuy.price.resource}s`);
        say.reply(omsg, `successfully purchased ${toBuy.name}`);
        
    } else {
        throw {
            name: `error`,
            message: `error occurred buying ${toBuy.name}`
        };
    }
}
function waitForReply(func, args) {
    omsg.channel.awaitMessages(m => {
        if (m.author.id == omsg.author.id) {
            return true;
        }
        else return false;
    }, { max: 1, time: 60000, errors: ['time'] })
        .then((collected) => func(collected, args))
        .catch(collected => { say.reply(omsg, `You did not respond in 1 minute. Please start again. ${collected}`) });
}
function buyItem(cost, resource) {
    return false;
}

exports.desc = "shop menu."; // Export command description
exports.syntax = ""; // Export command syntax