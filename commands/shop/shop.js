const config = require('../../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files
const database = require('../../database.js');
const say = require('../Basic tasks/say.js');
const musicManager = require('../../musicManager.js');
const levelManager = require('../../levelManager.js');
const custRole = require('./custRole.js');
const Command = require('../../Command.js');

var omsg;
var custRoleId = '341016737396949023'
var costOfColor = { amount: 10, resource: 'money' };

class shop extends Command{


    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        omsg = msg;
        if (!(msg.channel.name == "shop")) {
            say.reply(msg, "U R NOT IN SHOP");
            return;
        }
        say.reply(msg, '\nWelcome to the shop!\n\nMake a selection:\n1. Name Colors\n2. XP boosts\n3. Modify Bot\n4.Unlock Features\n');
        this.waitForReply(this.shopMenu1.bind(this));
    }

    shopMenu1(m) {
        console.log(m.first().content);
        let menuItems = undefined;
        switch (m.first().content) {
            case '1':
                menuItems = this.shopMenuColors();
                this.genericMenu(menuItems, `Color Shop`);
                break;
            case '2':
                this.shopMenuXP();
                break;
            case '3':
                this.shopMenuBot();
                break;
            case '4':
                menuItems = this.shopMenuFeatures();
                this.genericMenu(menuItems, `Misc Shop`);
                break;
            default:
                say.reply(m.first(), 'error, wrong input');
                break;
        }
    }
    shopMenuColors(){
        console.log("cOLOR\n");
        var roles = omsg.guild.roles;
        var menuItems = [];
        function listMap(value, key, map) {
            if (value.id == custRoleId){
                database.getCustRoleInfo().then((custroleinfo)=>{ //TODO: getCustPrice
                    if(custroleinfo != undefined){
                        menuItems.push({
                        name: 'customRole', price: custroleinfo.price, giveItem: () => {
                            console.log(`${omsg.member.displayName} is buying a custom role`);
                            if (omsg.member.roles.has(value.id)) {
                                throw { name: 'alreadyHaveItException', message: 'you already have this role!' };
                            } else {
                                database.increaseCustomPrice();
                                this.removeAllCustRole();
                                omsg.member.roles.add(value.id);
                                say.reply(omsg, `thank you for your purchase of ${value.name}`);
                            }
                        }
                        });
                    }
                });
            }
            if (value.name.charAt(0) == '~') {
                menuItems.push({
                    name: value.name, price: costOfColor, giveItem: () => {
                        console.log(`${omsg.member.displayName} is buying a role`);
                        if (omsg.member.roles.has(value.id)) {
                            throw { name: 'alreadyHaveItException', message: 'you already have this role!' };
                        } else {
                            omsg.member.roles.add(value.id);
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
    shopMenuXP() {
    
    }
    shopMenuBot() {
    
    }
    shopMenuFeatures() {
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
    genericMenu(menuItems, title) {
        console.log("genemenu");
        var list = '\n';
        menuItems.forEach((item, number) => {
            list = `${list}${number+1}. ${item.name}: ${item.price.amount} ${item.price.resource}\n`;
        });
        say.reply(omsg, `Welcome to the ${title} shop. Pick an option: ${list}`);
        this.waitForReply(this.genericBuy.bind(this), menuItems);
    }
    genericBuy(collected, menuItems) {
        var toBuy = menuItems[parseInt(collected.first())-1]; //TODO: Rework to not steal monies
        this.getMoney(toBuy.price.resource).then((money)=>{
            this.buyItem(toBuy.price.amount, toBuy.price.resource).then((money) => {
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
    waitForReply(func, args) {
        omsg.channel.awaitMessages(m => {
            if (m.author.id == omsg.author.id) {
                return true;
            }
            else return false;
        }, { max: 1, time: 60000, errors: ['time'] })
            .then((collected) => func(collected, args))
            .catch(collected => { say.reply(omsg, `You did not respond in 1 minute. Please start again. ${JSON.stringify(collected)} ${collected.message}`) });
    
    }
    getMoney(resource) {
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
    buyItem(cost, resource) {
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
    removeAllCustRole(){
        omsg.guild.members.forEach((mem)=>{
            if(mem.roles.get(custRoleId)!=null){
                mem.role.remove(custRoleId);
            };
        });
    }



}

module.exports = shop;




