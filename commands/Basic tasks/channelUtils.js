database = require('../../database.js')

exports.getAllMessagesDisc = function getAllMessages(channel) {
    var prom = new Promise((resolve, reject) => {
        var r = 0;
        var arr = [];
        function getMessagesBef(msgid) {
            console.log('finding next 100');
            channel.fetchMessages({ limit: 100, before: msgid }).then(messages => {
                console.log(`Received ${messages.size} messages`);
                messages.forEach((messagee) => {
                    arr.push(messagee);
                });
                let l = messages.array().length;
                if (l == 100) {
                    console.log('waiting then finding more.');
                    setTimeout(() => {
                        getMessagesBef(messages.last().id);
                    }, 1000 * .5);
                }
                else {
                    resolve(arr);
                }
            });
        }
        if (!(!channel.lastMessageID)) {
            getMessagesBef(channel.lastMessageID);
        }
        else {
            resolve(arr);
        }

    });
    return prom;
};

exports.getAllMessages = function getAllMessages(channel) {
    return new Promise((resolve, reject)=>{
        var arr = [];
        database.getMessages().then((results) => {
            results.forEach((result) => {
                if (result.msg_channel_id == channel.id) {
                    arr.push(result);
                }
            });
            resolve(arr);
        });
    });
}

