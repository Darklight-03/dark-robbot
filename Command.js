class Command{
    constructor(msg){
        console.log('command ' +msg+ ' created');
    }
    params(args){
        var params = [];
        var searchtext = '';
        args.forEach((value, index)=>{
            if((value.charAt(0)=='-')){
                params.push(value);
            }
        });
        return params;
    }
    args(args){
        var argsSplit = [];
        var searchtext = '';
        args.forEach((value, index)=>{
            if(!(value.charAt(0)=='-')){
                argsSplit.push(value);
            }
        });
        return argsSplit;
    }
}

module.exports = Command;