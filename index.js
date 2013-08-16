var urlparser = require("url-parser");
var request = require("request");
var cheerio = require("cheerio");

function makepipe(url) {
    return function download(writestream) {
        return request.get(url).pipe(writestream);
    };
};

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
    return request.get(url, function requestcallback(error, response, body) {
        var metadata = null;

        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var title = $("title").text();

            // http://dx.plos.org/10.1371/journal.pone.0071334.pdf
            var pdfurl1 = $("meta[name='citation_pdf_url']").attr("content");

            var pdfurl2 = pdfurl1;

            metadata = {
                "html": {
                    "title": title,
                },

                "files": [
                    {
                        "name": "paper.pdf",
                        "url": pdfurl1,
                        "pipe": makepipe(pdfurl1),
                    },
                    {
                        "name": "supplementary.pdf",
                        "url": pdfurl2,
                        "pipe": makepipe(pdfurl2),
                    },
                ],
            };
        }

        callback(error, metadata);
    });
};
