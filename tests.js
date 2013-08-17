var nock = require("nock");
var test = require("tape");

var cheerio = require("cheerio");

test("require against the module", function(t) {
    var downloader = require("./");

    t.ok(downloader, "must not be undefined");

    t.end();
});

test("has a method called test", function(t) {
    var downloader = require("./");

    t.ok(downloader.test, "has a method called test");

    t.end();
});

test("matches for a url with plosone.org", function(t) {
    var downloader = require("./");

    t.ok(downloader.test("http://plosone.org/"));
    t.ok(downloader.test("http://plosone.org:80/"));
    t.ok(downloader.test("http://plosone.org"));
    t.ok(downloader.test("http://plosone.org:80"));
    t.ok(downloader.test("http://www.plosone.org"));
    t.ok(downloader.test("http://www.plosone.org:80"));
    t.ok(downloader.test("http://www.plosone.org/"));
    t.ok(downloader.test("http://www.plosone.org:80/"));

    t.ok(downloader.test("https://plosone.org/"));
    t.ok(downloader.test("https://plosone.org:80/"));
    t.ok(downloader.test("https://plosone.org"));
    t.ok(downloader.test("https://plosone.org:80"));
    t.ok(downloader.test("https://www.plosone.org"));
    t.ok(downloader.test("https://www.plosone.org:80"));
    t.ok(downloader.test("https://www.plosone.org/"));
    t.ok(downloader.test("https://www.plosone.org:80/"));

    /*
    // TODO: url-parser doesn't support these, maybe there's a better module?
    t.ok(downloader.test("www.plosone.org"));
    t.ok(downloader.test("www.plosone.org/"));
    t.ok(downloader.test("www.plosone.org:80"));
    t.ok(downloader.test("www.plosone.org:80/"));
    t.ok(downloader.test("plosone.org"));
    t.ok(downloader.test("plosone.org/"));
    t.ok(downloader.test("plosone.org:80"));
    t.ok(downloader.test("plosone.org:80/"));
    */

    t.end();
});

test("extracts the correct html title", function(t) {
    // http://www.plosone.org/article/info:doi/10.1371/journal.pone.0071334
    var downloader = require("./");

    // mock data storage location
    var filename = "d6eabc5d85991d2248c6449d8be3d92b"; // md5 of url
    var filepath = __dirname + "/tests/data/html/" + filename + ".html";
    var expected_title = "PLOS ONE: Expansion of Multipotent Stem Cells from the Adult Human Brain";

    // setup the mock
    var scope = nock("http://example.com")
                .get("/paper")
                .replyWithFile(200, filepath);

    // make sure the title is extracted correctly
    downloader.download("http://example.com/paper", {}, function(error, metadata, body) {
        t.equal(expected_title, metadata.html.title, "title matches expectations");
        t.ok(scope.isDone(), "nock scope is done");
        t.end();
    });
});

test("parse title text correctly", function(t) {
    var parse = require("./src/parse.js");
    var expected_title = "hello world";
    var $ = cheerio.load("<title>" + expected_title + "</title>");
    t.equal(expected_title, parse.parseTitle($));
    t.end();
});

test("parse citation_pdf_url correctly", function(t) {
    var parse = require("./src/parse.js");
    var expected_pdf_url = "http://example.com/example.pdf";
    var $ = cheerio.load('<meta name="citation_pdf_url" content="' + expected_pdf_url + '" />');
    t.equal(expected_pdf_url, parse.parsePdfUrl($));
    t.end();
});
