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
        // if (!msg.member.hasPermission("KICK_MEMBERS")) {
        //     say.reply(msg,"U R NOT A MODERATOR");
        // }
        // else{

        // member.presence.game.name


            let server = msg.guild;
            let channeltarget = msg.member.voiceChannel;
            let channelmovetarget = [server.channels.get('166392163465166848'), server.channels.get('166392178048892928')];
            let moveChannels = false;
            let imba = false;
            let ignoreGame = false;
            let numteams = 2;
            //let game = msg.member.presence.game.name;

            // first arg is number of teams
            if(!(!args[0])){
                if(args[0]!='undefined'){
                    //TODO: other way of doing this??? 2v4?? 3v84??
                    numteams = args[0];
                }
            }

            // -imba makes the first team consist of 1 person
            if(params.some(function(element){
                return element == "-imba";
            })){
                imba = true
            }

            // -move moves the people to group 1 and 2 (only works on yads server and with 2 teams)
            if(params.some(function(element){
                return element == "-move";
            }) && msg.member.hasPermission("KICK_MEMBERS")){
                moveChannels = true
            }

            // -ignoregame moves the people to group 1 and 2 (only works on yads server and with 2 teams)
            if(params.some(function(element){
                return element == "-ignoregame";
            })){
                ignoreGame = true
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
                                if(imba){
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
                        if(moveChannels && numteams == 2){
                            teams.forEach((team,i)=>{
                                team.forEach((mem)=>{
                                    mem.setVoiceChannel(channelmovetarget[i])
                                })
                            })
                        }
                    })
                        
                    
                })                
            });
            // let s='';
            // server.channels.forEach((channel)=>{
            //     s = s+channel.name;
            //     if(channel.type=='voice'&&channel.id!='167002342418284546'){
            //         channel.members.forEach((member)=>{
            //             s = s + member.user.username;
            //             member.setVoiceChannel(channelmovetarget);
            //         });
            //     }
            // });
    }
}

module.exports = maketeams;