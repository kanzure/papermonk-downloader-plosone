var urlparser = require("url-parser");
var request = require("request");
var jsdom = require("jsdom");

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
            var window = jsdom.jsdom(body).createWindow();
            var title = window.document.getElementsByTagName("title")[0].innerHTML;

            var meta_elements = window.document.evaluate("//meta[@name='citation_pdf_url']", window.document, null, 0, null);
            var meta_pdf_url_element = meta_elements.iterateNext();

            var pdfurl1 = null;
            var pdfurl2 = null;

            if (meta_pdf_url_element) {
                pdfurl1 = meta_pdf_url_element.content;
            } else {
                pdfurl1 = "http://dx.plos.org/10.1371/journal.pone.0071630.pdf";
            }

            pdfurl2 = pdfurl1;

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

            // otherwise node will hang
            window.close();
        }

        callback(error, metadata);
    });
};
