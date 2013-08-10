var urlparser = require("url-parser");

module.exports.test = function test(url) {
    parsedurl = urlparser.parse(url);

    if (parsedurl.hostname === "plosone.org")
        return true;

    if (parsedurl.hostname === "www.plosone.org")
        return true;

    if (parsedurl.href === "plosone.org")
        return true;

    if (parsedurl.href === "www.plosone.org")
        return true;

    return false;
};

// TODO: this should be split into multiple methods
module.exports.download = function download(url, options, callback) {
    // TODO: this needs to be implemented
    throw new Error("not implemented");
};
