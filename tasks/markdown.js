/*
 * grunt-section
 * https://github.com/iclanzan/grunt-section
 *
 * Copyright (c) 2013 Sorin Iclanzan
 * Licensed under the MIT license.
 */

'use strict';

var marked = require('marked');
var cheerio = require('cheerio');

module.exports = function (grunt) {

  // Aliases
  var evt = grunt.event;
  var slugify = grunt.util._.slugify;

  function parseMarkdown(file, node) {
    var $ = cheerio.load(marked(node.body), {ignoreWhitespace: true});

    // Remove align attribute from table cells which is invalid HTML5
    // and use a class instead.
    $('[align]').each(function () {
      this.addClass(this.attr('align')).removeAttr('align');
    });

    // Add id attributes to level 2 and 3 headings to enable fragment linking.
    $('h2, h3').each(function () {
      this.attr('id', slugify(this.text()));
    });

    // Enable pullquotes
    $(':root > blockquote').filter(function () {
      return this.children('p:only-child').length && !this.find('img').length;
    }).addClass('pullquote');

    // Work out word count
    node.wordCount = $.root().text().split(/\s+/).length;
    console.log($.html());

    // If the first thing in our document is an image then it is the cover image
    var cover = $.root().children('p:first-child').find('img:only-child');
    if (cover.length) {
      cover.parent().remove();
      node.cover = {
        src: cover.attr('src'),
        alt: cover.attr('alt')
      };
    }

    // Get description from the paragraph immediately following h1
    node.description = $('h1+p').first().text();

    // Pull out title from first h1
    var h1 = $('h1').first();
    node.title = h1.text();
    h1.remove();

    evt.emit(['section', 'parsedMarkdown'], $, node);

    node.body = $.html();
  }

  evt.on(['section', 'contentFile', '*'], parseMarkdown);

  evt.on(['section', 'init'], function (options) {
    var proto = options.pagePrototype;

    proto.title = '';
    proto.description = '';
    proto.body = '';
    proto.cover = null;
    proto.wordCount = 0;

    if (!options.contentExtensions || !options.contentExtensions.length) {
      options.contentExtensions = ['md', 'markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'text', 'txt'];
    }
  });
};
