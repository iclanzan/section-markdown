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
    var description = $('h1+p').first().text();
    if (description) {
      node.description = description;
    }

    // Pull out title from first h1
    var h1 = $('h1').first();
    var title = h1.text();
    if (title) {
      node.title = title;
    }
    h1.remove();

    evt.emit(['section', 'parsedMarkdown'], $, node);

    var body = $.html();
    if (body) {
      node.body = body;
    }
  }

  evt.on(['section', 'contentFile', '*'], parseMarkdown);

  evt.on(['section', 'init'], function (options) {
    if (!options.contentExtensions || !options.contentExtensions.length) {
      options.contentExtensions = ['md', 'markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'text', 'txt'];
    }
  });
};
