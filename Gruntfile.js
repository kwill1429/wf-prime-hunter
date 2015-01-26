/* jshint node: true */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      indexcss: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css', 
          'public/css/prime.css'
        ],
        dest: 'public/temp/index.css',
      },
      historyjs: {
        src: [
          'bower_components/jquery/dist/jquery.js', 
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/moment/moment.js',
          'public/js/jquery.toaster.js', 
          'public/js/feedback.js',
          'public/js/PHitems.js',
          'public/js/react.min.js',
          'public/temp/history-compiled-jsx.js'
        ],
        dest: 'public/temp/history.js',
      }
    },
    cssmin: {
      minifyIndex: {
        expand: true,
        cwd: 'public/temp/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/css',
        ext: '-<%= pkg.version %>.min.css'
      }
    },
    react: {
      historyjsx: {
        files: {
          'public/temp/history-compiled-jsx.js': [
            'public/react/History.jsx'
          ]
        }
      }
    },
    uglify: {
      historyjs: {
        files: {
          'public/js/history-<%= pkg.version %>.min.js': ['public/temp/history.js']
        }
      }
    },
    clean: ["public/temp/*"]
  });

  // Load the plugins 
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('default', ['react', 'concat', 'cssmin', 'uglify', 'clean']);

};