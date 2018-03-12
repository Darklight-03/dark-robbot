const config = require('../config.json');
const say = require('./Basic tasks/say.js');
const Command = require('../Command.js');
const lists = require('./Basic tasks/lists.js');
const Discord = require('discord.js');


class maketeams extends Command{
    constructor(bot, msg, timeout, botPerm, userPerm, args){
        super(msg);
        this.exec(bot,msg,super.args(args),super.params(args));
    }
    exec(bot,msg,args,params){
        if (!msg.member.hasPermission("KICK_MEMBERS")) {
            say.reply(msg,"U R NOT A MODERATOR");
        }
        else{
            let server = msg.guild;
            let channeltarget = msg.member.voiceChannel;
            let numteams = 2;
            if(!(!args[0])){
                if(args[0]!='undefined'){
                    //TODO other way of doing this??? 2v4?? 3v84??
                    numteams = args[0];
                }
            }
            lists.shuffleArray(channeltarget.members.array()).then(arr => {
                console.log(arr.length);
                let teams = new Array(0);
                let n = numteams;
                let i;
                new Promise((resolve,reject)=>{
                    for(i=0;i<numteams;i++){
                        teams.push([]);

                        console.log('sdkfjd')
                    }
                    resolve(teams);
                    
                }).then(teams =>{
                    new Promise((resolve,reject)=>{
                        console.log(teams)
                        while(arr[0]!=undefined){
                            n--;
                            teams[n].push(arr.pop());
                            if(n==0){
                                n=numteams;
                                if(params.some(function(element){
                                    return element == "-imba";
                                })){
                                    n--;
                                }
                            }
                        }
                        resolve(teams);
                    }).then(teams=>{
                        let str = '';
                        const embed = new Discord.MessageEmbed()
                        embed.setColor(0x00AE86)
                        teams.forEach((team,i) => {
                            embed.addField(`Team ${i}:\n`,(function getMem(team){
                                let str = '';
                                team.forEach(mem => {
                                    str = str + `${mem.displayName}\n`;
                                })
                                return str+".";
                            }(team)));
                        })
                        say.embed(msg,embed);
                    })
                })                
            });
            let s='';
            server.channels.forEach((channel)=>{
                s = s+channel.name;
                if(channel.type=='voice'&&channel.id!='167002342418284546'){
                    channel.members.forEach((member)=>{
                        s = s + member.user.username;
                        member.setVoiceChannel(channeltarget);
                    });
                }
            });
        }
    }
}

module.exports = maketeams;