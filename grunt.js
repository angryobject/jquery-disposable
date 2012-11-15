/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    server: {
      port: 8000,
      base: './app'
    },

    watch: {
    }
  });

  grunt.registerTask('default', 'server watch');
};