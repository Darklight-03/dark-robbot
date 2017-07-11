const say = require('./Basic tasks/say.js');
const Discord = require('discord.js');

exports.main = function(bot, msg, timeout, botPerm, userPerm, args) { // Export command's function
    if(!args[0]){
        console.log('noargs')
        msg.channel.fetchMessages({limit: 1, before: msg.id}).then(sendQuote);
    }else{
        console.log('args')
        msg.channel.fetchMessage(args[0]).then(sendQuote);
    }
    function sendQuote(retrieved){
        try{
            retrieved = retrieved.first();
        }catch(exception){
        }
        const embed = new Discord.RichEmbed()
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
};

exports.desc = "quote"; // Export command description
exports.syntax = "quote"; // Export command syntax
