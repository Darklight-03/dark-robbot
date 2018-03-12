const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');
const custRole = require('./custRole.js');

var omsg;
var custRoleId = '341016737396949023'
var costOfColor = { amount: 10, resource: 'money' };

exports.main = function (bot, msg, timeout, botPerm, userPerm, args) { // Export command function
    omsg = msg;
    if (!(msg.channel.name == "shop")) {
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
            menuItems = shopMenuColors();
            genericMenu(menuItems, `Color Shop`);
            break;
        case '2':
            shopMenuXP();
            break;
        case '3':
            shopMenuBot();
            break;
        case '4':
            menuItems = shopMenuFeatures();
            genericMenu(menuItems, `Misc Shop`);
            break;
        default:
            say.reply(m.first(), 'error, wrong input');
            break;
    }
}
function shopMenuColors(){
    var roles = omsg.guild.roles;
    var menuItems = [];
    function listMap(value, key, map) {
        if (value.id == custRoleId){
            database.getCustRoleInfo().then((custroleinfo)=>{ //TODO getCustPrice
                menuItems.push({
                name: 'customRole', price: custroleinfo.price, giveItem: () => {
                    console.log(`${omsg.member.displayName} is buying a custom role`);
                    if (omsg.member.roles.has(value.id)) {
                        throw { name: 'alreadyHaveItException', message: 'you already have this role!' };
                    } else {
                        database.increaseCustomPrice();
                        removeAllCustRole();
                        omsg.member.addRole(value.id);
                        say.reply(omsg, `thank you for your purchase of ${value.name}`);
                    }
                }
                });
            });
        }
        if (value.name.charAt(0) == '~') {
            menuItems.push({
                name: value.name, price: costOfColor, giveItem: () => {
                    console.log(`${omsg.member.displayName} is buying a role`);
                    if (omsg.member.roles.has(value.id)) {
                        throw { name: 'alreadyHaveItException', message: 'you already have this role!' };
                    } else {
                        omsg.member.addRole(value.id);
                        say.reply(omsg, `thank you for your purchase of ${value.name}`);
                        return true;
                    }
                }
            });
        }
    }
    roles.forEach(listMap);
    return menuItems;
}
function shopMenuXP() {

}
function shopMenuBot() {

}
function shopMenuFeatures() {
    var menuItems = [];
    menuItems.push({
        name: 'Change Color of Custom Role', price: {amount: 10, resource: 'money'}, giveItem: () => {
            console.log(`${omsg.member.displayName} is changing color of role`);
            custRole.changeColor(omsg);
        }
    });
    menuItems.push({
        name: 'Change Name of Custom Role', price: {amount: 20, resource: 'money'}, giveItem: () => {
            console.log(`${omsg.member.displayName} is changing name of role`);
            custRole.changeName(omsg);
        }
    });
    return menuItems;
}
function genericMenu(menuItems, title) {
    var list = '\n';
    menuItems.forEach((item, number) => {
        list = `${list}${number+1}. ${item.name}: ${item.price.amount} ${item.price.resource}\n`;
    });
    say.reply(omsg, `Welcome to the ${title} shop. Pick an option: ${list}`);
    waitForReply(genericBuy, menuItems);
}
function genericBuy(collected, menuItems) {
    var toBuy = menuItems[parseInt(collected.first())-1];
    getMoney(toBuy.price.resource).then((money)=>{
        buyItem(toBuy.price.amount, toBuy.price.resource).then((money) => {
            toBuy.giveItem();
            console.log(`${omsg.author.username} has purchased ${toBuy.name} for ${toBuy.price.amount} ${toBuy.price.resource}s`);
            say.reply(omsg, `successfully purchased ${toBuy.name}`);
        });
    }).catch((err) => {
        if(typeof err == 'undefined'){
            throw {
                name: `error`,
                message: `error occurred buying ${toBuy.name}`
            };
        }else{
            throw err;
        }
    }).catch((err)=>{
        say.reply(omsg, `${err.name}: ${err.message}`);
    });
}
function waitForReply(func, args) {
    omsg.channel.awaitMessages(m => {
        if (m.author.id == omsg.author.id) {
            return true;
        }
        else return false;
    }, { max: 1, time: 60000, errors: ['time'] })
        .then((collected) => func(collected, args))
        .catch(collected => { say.reply(omsg, `You did not respond in 1 minute. Please start again. ${JSON.stringify(collected)}`) });

}
function getMoney(resource) {
    return new Promise((resolve, reject) => {
        database.getMoney(omsg, resource).then((data) => {
            if (data.money >= 0) {
                console.log(`${omsg.member.displayName} has ${data.money} ${resource} remaining.`);
                resolve(data.money);
            }
            else reject();
        }).catch((err) => {
            if(typeof err == 'undefined'){
                reject({
                    name: `error`,
                    message: `error occurred getting money`
                });
            }
            else{
                reject(err);
            }
        });
    });
}
function buyItem(cost, resource) {
    return new Promise((resolve, reject) => {
        database.takeMoney(omsg, cost, resource).then((data) => {
            if (data.money >= 0) {
                console.log(`${omsg.member.displayName} has ${data.money} ${resource} remaining.`);
                resolve(data.money);
            }
            else reject();
        }).catch((err) => {
            if(typeof err == 'undefined'){
                reject({
                    name: `error`,
                    message: `error occurred buying item`
                });
            }
            else{
                reject(err);
            }
        });
    });
}
function removeAllCustRole(){
    omsg.guild.members.forEach((mem)=>{
        if(mem.roles.get(custRoleId)!=null){
            mem.removeRole(custRoleId);
        };
    });
}

exports.waitForReply = waitForReply;
exports.desc = "shop menu."; // Export command description
exports.syntax = ""; // Export command syntax