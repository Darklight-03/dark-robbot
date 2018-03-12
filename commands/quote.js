const say = require('./Basic tasks/say.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

class quote extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if(!args[0]){
            console.log('noargs')
            msg.channel.messages.fetch({limit: 1, before: msg.id}).then(re => this.sendQuote(re,msg));
        }else{
            if(args[0].match(/^[0-9]+$/)!=null){
                console.log('snowflake')
                msg.channel.fetchMessage(args[0]).then(re => this.sendQuote(re,msg));
            }
            else{
                console.log('quote');
                //sendQuote(new Object({cleanContent: args, author: {username: }}));
            }
        }
    }
    sendQuote(retrieved,msg){
        try{
            retrieved = retrieved.first();
        }catch(exception){
        }
        const embed = new Discord.MessageEmbed()
        //.setAuthor(`Quoted by ${msg.author.username}`)
        /*
        * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
        */
        .setColor(0x00AE86)
        .setDescription(retrieved.cleanContent)
        .setFooter(`@${retrieved.author.username}`)
        //.setThumbnail(retrieved.author.avatarURL())
        /*
        * Takes a Date object, defaults to current date.
        */
        .setTimestamp(new Date(retrieved.createdTimestamp))
        /*
        * Inline fields may not display as inline if the thumbnail and/or image is too big.
        */
        /*
        * Blank field, useful to create some space.
        */
        if(!(!(retrieved.attachments.first()))){
            embed.attachFile(retrieved.attachments.first().url);
        }
        if(!(!(retrieved.embeds[0]))){
            retrieved.embeds.forEach((emb)=>{
                if(emb.type=='image'){
                    embed.setImage(emb.url);
                }
            });
        }
        console.log(retrieved.author.avatarURL());
        msg.guild.channels.filter((channel)=>{
            return channel.name.includes('quote');
        }).first().send({embed});
        retrieved.author.send(`You have been quoted in ${msg.guild}.`);
    }
}

module.exports = quote;
