'use strict';

var grunt = require('grunt');
var root = grunt.section;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.section = {
  'All': function (test) {
    test.expect(4);
    var page = root.children[0];

    test.equal(page.title, 'This page has a cover image', 'Expected to find a different title.');
    test.equal(page.description, 'Isn’t this beautiful?', 'Expected to find a different description.');
    test.equal(page.cover.src, 'some/url', 'Expected to find a different cover image src.');
    test.ok(page.wordCount > 0, 'Expected a word count.');

    test.done();
  }
};
