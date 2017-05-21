const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For reading the command files
//var normalizedPath = require("path").join(__dirname, config.commandPath); // Fix the path to be used in condition checks
var commands = {}; // Object of existing commands

exports.initialize = function(path){
	syncCommands(path);
};

syncCommands = function(path){
	fs.readdirSync(path).forEach(function(file) {

			//console.log(path+""+file);


		if(!fs.lstatSync(path+""+file).isFile()){
			syncCommands(path+""+file+"\\");
		}

		// Look at all the files in the specificed folder
		else if (file.substr(-3, 3) == ".js") {
			// If the file is a .js file...

			var ModuleName = file.slice(0, -3).toLowerCase();
			// ...remove ".js" bit from the file names, convert it to lowercase,..
			commands[ModuleName] = require(path + "" + file);
			commands[ModuleName].filename = file;
			// ...and then require the files as commands.
		}
	});
};


exports.commands = commands; // Export available commands object
