var urlparser = require("url-parser");
var request = require("request");
var jsdom = require("jsdom");

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
    request.get(url, function requestcallback(error, response, body) {
        var metadata = null;

        if (!error && response.statusCode == 200) {
            var window = jsdom.jsdom(body).createWindow();
            var title = window.document.getElementsByTagName("title")[0].innerHTML;

            metadata = {
                "html": {
                    "title": title,
                },
            };
        }

        callback(error, metadata);
    });

    return undefined;
};
