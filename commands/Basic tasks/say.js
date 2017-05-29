exports.pm = function(author, content){
   pm(author,content);
};

pm = function(msg, content){
    if(String(content).length > 2000){
        msg.author.send(String(content).slice(0,2000));
        return send(msg.author, String(content).slice(2000,String(content).length));
    }
    author.send(String(content));
}

exports.reply = function(msg, content){
    reply(msg,content);
};

reply = function(msg, content){
    if(String(content).length > 2000){
            msg.reply(String(content).slice(0,2000)).then((message)=>{
                setTimeout(()=>{
                    message.delete();
                    msg.delete();
                },1000*60*3);
            });
            return reply(msg, String(content).slice(2000,String(content).length));
        }
        msg.reply(String(content)).then((message)=>{
            setTimeout(()=>{
                message.delete();
            },1000*60*3);
        });
};