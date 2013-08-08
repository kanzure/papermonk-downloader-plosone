var test = require("tape");

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
