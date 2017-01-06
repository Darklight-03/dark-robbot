const fs = require('fs');
const config = require('./config.json'); // import configuration
var normalizedPath = require("path").join(__dirname, config.ignorePath); // fix the path to be used in condition checks
var ignoreLists = {}; // Object of ignore lists

// Load all ignore lists from the ignorePath (below) -- handler adapted from command handler courtesy of RShadowhand on Github
fs.readdirSync(normalizedPath).forEach(function(file) { // Look at all the files in the specificed folder
	var ServerID = file.slice(0, -5).toLowerCase();  // remove ".json" bit from the file names and convert to lowercase
	ignoreLists[ServerID] = require("./"+config.ignorePath+"/" + file); // Require the files as ignore lists
});
exports.ignoreLists = ignoreLists;  // Export available ignoreLists object