var hyperquest = require("hyperquest");
var cheerio = require("cheerio");

module.exports = function parse(body) {
    var metadata = {};

    var $ = cheerio.load(body);

    var title = parseTitle($);

    var pdfurl1 = parsePdfUrl($);

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

    return metadata;
};

var makepipe = module.exports.makepipe = function makepipe(url) {
    return function download(stream) {
        return hyperquest.get(url).pipe(stream);
    };
};

var parseTitle = module.exports.parseTitle = function parseTitle($) {
    return $("title").text();
};

var parsePdfUrl = module.exports.parsePdfUrl = function parsePdfUrl($) {
    // http://dx.plos.org/10.1371/journal.pone.0071334.pdf
    return $("meta[name='citation_pdf_url']").attr("content");
};
