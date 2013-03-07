module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/mapper.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      tests: ['test/index.js']
    },

    // Remove test staging directory
    clean: {
      tests: ['tmp']
    },

    // Build the test cases
    mapper: {
      basic: {
        cwd: 'test/cases',
        assets: '../assets/*',
        src: ['*']
      }
    }
  });

  // Load this task
  grunt.loadTasks('tasks');

  // Load plugins used by this task gruntfile
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Task cleans `tmp` and builds mapper, then runs tests
  grunt.registerTask('test', ['clean', 'mapper', 'nodeunit']);

  // Default task
  grunt.registerTask('default', ['jshint', 'test']);
};