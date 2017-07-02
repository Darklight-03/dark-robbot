const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const levelManager = require('./levelManager.js');
const say = require('./commands/Basic tasks/say.js');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'bot',
  password: 'fghg',
  database: 'botdb'
});
exports.connect = function () {
  db.connect();
};
exports.initializeTables = function () {
  db.query('SET CHARACTER SET \'utf8mb4\';', (error, results, fields) => {
    if (error) throw error;
    if (typeof results !== 'undefined') {
      console.log('initialized muted table');
    }
  });
  db.query('SET NAMES \'utf8mb4\';', (error, results, fields) => {
    if (error) throw error;
    if (typeof results !== 'undefined') {
      console.log('initialized muted table');
    }
  });
  db.query('CREATE TABLE IF NOT EXISTS muted ( \
  member_id VARCHAR(30) NOT NULL, \
  guild_id VARCHAR(30) NOT NULL, \
  epoch_unmute BIGINT(64) UNSIGNED \
  );', (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        console.log('initialized muted table');
      }
    });
  db.query('CREATE TABLE IF NOT EXISTS messages ( \
  msg_id VARCHAR(30) NOT NULL, \
  msg_content VARCHAR(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, \
  msg_author_id VARCHAR(30) NOT NULL, \
  msg_guild_id VARCHAR(30) NOT NULL, \
  msg_channel_id VARCHAR(30) NOT NULL, \
  msg_createdTimestamp BIGINT(64) UNSIGNED, \
  PRIMARY KEY (msg_id, msg_channel_id) \
  );', (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        console.log('initialized messages table');
      }
    });
  db.query('CREATE TABLE IF NOT EXISTS levels ( \
  user_id VARCHAR(30) NOT NULL, \
  guild_id VARCHAR(30) NOT NULL, \
  next_xp_epoch BIGINT(64) UNSIGNED, \
  xp BIGINT(64), \
  level INT(4), \
  PRIMARY KEY (user_id, guild_id) \
  );', (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        console.log('initialized levels table');
      }
    });
};
exports.leaderboard = function(guild_id){
  return new Promise((resolve,reject)=>{
    db.query('SELECT * FROM levels WHERE guild_id = ? ORDER BY xp DESC', [guild_id], (error, results, fields) => {
      if(error) throw error;
      resolve(results);
    })
  });
}
exports.position = function(msg){
  return new Promise((resolve,reject)=>{
    db.query('select count(*) AS place \
    from levels \
    where xp >= (select xp from levels where user_id = ? AND guild_id = ?)', [msg.author.id, msg.guild.id], (error, results, fields)=>{
      if(error) throw error;
      resolve(results[0].place);
    });
  });
}
exports.currentLevelData = function (msg) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM levels WHERE user_id=? AND guild_id=?', [msg.author.id, msg.guild.id], (error, results, fields) => {
      if (error) throw error;
      resolve(results[0]);
    });
  });
}
exports.addXP = function (msg) {
  // get correct users data
  db.query('SELECT * FROM levels WHERE user_id=? AND guild_id=?', [msg.author.id, msg.guild.id], (error, results, fields) => {
    if (error) throw error;
    //if there is no data, create it starting at level 999 with 1 xp
    if (!results[0]) {
      db.query('INSERT INTO levels (user_id, guild_id, next_xp_epoch, xp, level) \
      VALUES (?, ?, ?, ?, ?);', [msg.author.id, msg.guild.id, Date.now() + 60000, 1, 999], (error, results, fields) => {
        if (error) throw error;
        say.reply(msg, `lol noob spammer, you have been demoted to level 999`);
      });
      return 1;
    } else {


      //if they are able to gain xp and already had data, then add 1 xp and a level if necessary
      console.log(`need ${levelManager.nextLevel(results[0].level)} have ${results[0].xp + 1}\n time is ${Date.now()}, needs ${results[0].next_xp_epoch}`);
      if (results[0].next_xp_epoch < Date.now()) {
        console.log('running code');
        var isLevelUp=0;
        //if they have enough xp to gain a level, send congrats and save var.
        function checkLevelUp(lvl){
          if (levelManager.nextLevel(lvl) < results[0].xp + 1) {
            isLevelUp++;
            checkLevelUp(lvl-1);
          }
        }
        checkLevelUp(results[0].level);
        if(isLevelUp==1){
          say.reply(msg, `lol noob spammer, you have been demoted to level ${results[0].level - isLevelUp}`);
        }
        if(isLevelUp>1){
          say.reply(msg, `lol noob spammer, you have been demoted to level ${results[0].level - isLevelUp} (gained ${isLevelUp} levels!)`);
        }
        db.query(`UPDATE levels SET xp = ${results[0].xp + 1}, next_xp_epoch = ${Date.now() + 60000}, level=${results[0].level - isLevelUp} WHERE user_id=${msg.author.id} AND guild_id=${msg.guild.id}`);
        // db.query('REPLACE INTO levels (user_id, guild_id, next_xp_epoch, xp, level) \
        // VALUES (?, ?, ?, ?, ?);', [msg.author.id, msg.guild.id, Date.now() + 60000, 'xp+1', `level+${isLevelUp}`], (error, results, fields) => {
        //   if (error) throw error;

        // });
      }else{

      }
    }
  });

}
exports.addMessage = function (msg) {
  db.query('INSERT INTO messages (msg_id, msg_content, msg_author_id, msg_guild_id, msg_channel_id, msg_createdTimestamp) \
  VALUES (?, ?, ?, ?, ?, ?);', [msg.id, msg.content, msg.author.id, msg.guild.id, msg.channel.id, msg.createdTimestamp], (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        // console.log('added muted ',results);
      }
    });
}
exports.getMessages = function () {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM messages;', (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    });
  })
}
exports.countMessages = function () {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS solution FROM messages;', (error, results, fields) => {
      if (error) throw error;
      resolve(results[0].solution);
    });
  })
}
exports.replaceMessage = function (msg) {
  db.query('REPLACE INTO messages (msg_id, msg_content, msg_author_id, msg_guild_id, msg_channel_id, msg_createdTimestamp) \
  VALUES (?, ?, ?, ?, ?, ?);', [msg.id, msg.content, msg.author.id, msg.guild.id, msg.channel.id, msg.createdTimestamp], (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        // console.log('added muted ',results);
      }
    });
}
exports.removeMuted = function (member_id, guild_id) {
  db.query('DELETE FROM muted WHERE member_id = ? AND guild_id = ?', [member_id, guild_id], (error, results, fields) => {
    if (error) throw error;
    if (typeof results !== 'undefined') {
      // console.log('removed from muted',results);
      return true;
    }
  });
}
exports.addMuted = function (member_id, guild_id, epoch_unmute) {
  db.query('INSERT INTO muted (member_id, guild_id, epoch_unmute) \
  VALUES (?, ?, ?);', [member_id, guild_id, epoch_unmute], (error, results, fields) => {
      if (error) throw error;
      if (typeof results !== 'undefined') {
        // console.log('added muted ',results);
      }
    });
}
/**
* @param {String} get - member_id, guild_id, epoch_unmute
* @param {Integer} num - which line to get 
*/
exports.getMuted = function (get, num) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM muted;', (error, results, fields) => {
      if (error) throw error;
      r = [];
      for (i = 0; i < results.length; i++) {
        if (typeof get !== 'undefined') {
          if (get == 'member_id') r.push(results[i].member_id);
          if (get == 'guild_id') r.push(results[i].guild_id);
          if (get == 'epoch_unmute') r.push(results[i].epoch_unmute);
        }
        else {
          r.push(results[i]);
        }
      }
      if (typeof num !== 'undefined' && num < results.length) r = r[num];
      // console.log('results: ',results,'\nr = ',r); //TODO parse results and then return.
      resolve(r);
    });
  });

}

//module.exports = connect, initializeTables;
