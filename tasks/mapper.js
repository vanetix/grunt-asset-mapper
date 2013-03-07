/*
 * grunt-asset-mapper
 * https://github.com/vanetix/grunt-asset-mapper
 *
 * Copyright (c) 2013 Matt McFarland
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  /**
   * Dependencies
   */

  var path = require('path');

  /**
   * Core `grunt-asset-mapper` task
   */

  grunt.registerMultiTask('mapper', 'Automate asset mapping', function() {

    /**
     * Loop over all file arguments replacing any asset paths with assets
     * in `f.assets`
     */

    this.files.forEach(function(f) {
      var src, assets, cwd = f.cwd;

      /**
       * Expand assets
       */

      assets = grunt.file.expand({cwd: cwd}, f.assets);
      console.dir(assets);

      /**
       * Filter out non-existent files then iterate over all files
       * in `f.src` if an asset reference is found check if the asset
       * is in `f.assets`, if so, replace with the new path
       */

      src = f.src.filter(function(p) {
        if(cwd) {
          p = path.join(cwd, p);
        }

        if(grunt.file.exists(p)) {
          return true;
        }

        grunt.log.error('File: ' + p + ' not found.');
        return false;
      });

      src.forEach(function(p) {
        var s = f.dest ? f.dest : p;

        if(cwd) {
          p = path.join(cwd, p);
        }

        grunt.log.oklns(map(p, assets));

        /**
         * If `f.dest` is set, save to `f.dest` otherwize
         * overwrite the original
         */

        //grunt.file.write(map(p, assets), s);
      });

    });
  });

  /**
   * Try to match a filename in `assets` against `f`
   *
   * @param {String} f
   * @param {Array} assets
   * @return {String}
   */

  function matchAsset(f, assets) {
    var i, len;
    var ext = path.extname(f);
    var base = path.basename(f, ext);
    var regexp = new RegExp(base + '\\.[A-Za-z0-9]+' + ext + '$');

    for(i = 0, len = assets.length; i < len; i = i + 1) {
      if(assets[i].match(regexp)) {
        return assets[i];
      }
    }

    return '';
  }

  /**
   * Returns the regular expression used for matching the filetype
   *
   * @param {String} p
   * @return {RegExp}
   */

  function fileRegexp(p) {
    var types = {
      css: /url\(['"](\S+)['"]\);/,
      html: /(?:src|href)="(\S+)"/
    };

    return types[fileType(p)] || types.css;
  }

  /**
   * Returns the filetype of path `p`
   *
   * @param {String} p
   * @return {String}
   */

  function fileType(p) {
    return path.extname(p).slice(1);
  }


  /**
   * Map any `asset` references in `src` to the given asset
   *
   * @param {String} p
   * @param {Array} assets
   * @return {String}
   */

  function map(p, assets) {
    var asset, match, regex, lines;

    regex = fileRegexp(p);
    lines = grunt.file.read(p).split(grunt.util.linefeed);

    lines = lines.map(function(line) {
      if(match = line.match(regex)) {
        asset = matchAsset(match[1], assets);

        if(asset) {
          grunt.verbose.oklns('Replacing: ' + match[1] + ' with ' + asset);
          return line.replace(match[1], asset);
        }
      }

      return line;
    });

    return lines.join(grunt.util.linefeed);
  }

};