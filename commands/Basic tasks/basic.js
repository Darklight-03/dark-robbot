const config = require('../../config.json'); // Import configuration
const say = require('../Basic tasks/say.js');
const channelUtils = require('../Basic tasks/channelUtils.js');



function replacePunctuation(word){
    word = word.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#&*+,\-.\/:;<=>?@\[\]^_`{|}~\r\n]+/g, '');
    // all punctuation::/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g
    // removed: %()$
    // added: \n
    return word.toLowerCase();
}
exports.replacePunctuation = replacePunctuation;