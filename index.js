var urlparser = require("url-parser");
var hyperquest = require("hyperquest");
var concat = require("concat-stream");
var parse = require("./src/parse.js");

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

module.exports.download = function download(url, options, callback) {
    var request = hyperquest.get(url);

    request.pipe(concat(function(body) {
        var metadata = parse(body);
        callback(null, metadata, body);
    }));

    //request.on("response", function(response){});
    request.on("error", function(error) {
        callback(error, null, null);
    });
};
