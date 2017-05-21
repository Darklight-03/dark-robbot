exports.do = function(author, content){
   send(author,content);
};

send = function(author, content){
    if(String(content).length > 2000){
        author.send(String(content).slice(0,2000));
        return send(author, String(content).slice(2000,String(content).length));
    }
    author.send(String(content));
}
