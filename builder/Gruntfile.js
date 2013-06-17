/*global module:false*/

var path = require('path');
var fs = require('fs');

var dirDeploy = path.join(__dirname, '..', '/public');
var dirSource = path.join(__dirname, '..', '/src');


module.exports = function(grunt) {

	// Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    //Compile require js AMD stuff.
    requirejs: {
      compile: {
        options: {
          stubModules : ['text', 'hgn'],
          pragmasOnSave : {
            excludeHogan : true
          },
          optimize: 'uglify2',
          mainConfigFile: dirSource+"/app/main.js",
          baseUrl: dirSource+"/app",
          name: 'main',
          include: ['main'],
          insertRequire: ['main'],
          generateSourceMaps: true,
          preserveLicenseComments: false,
          out: dirDeploy+'/js/main.js'
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            src: [dirSource+'/*'],
            dest: dirDeploy+'/',
            filter: 'isFile',
            expand: true,
            flatten: true
          },
          {
            cwd: dirSource+'/app/vendor/',
            src: ['**'],
            dest: dirDeploy+'/js/vendor/',
            expand: true
          },
          {
            cwd: dirSource+'/img/',
            src: ['**'],
            dest: dirDeploy+'/img/',
            expand: true
          }
        ]
      }
    },
    "string-replace": {
      dist: {
        files: [
              {
                src: dirSource+'/index.html',
                dest: dirDeploy+'/index.html'
              }
        ],
        options: {
          replacements: [
            // place files inline example
            {
              pattern: /app\//ig,
              replacement: 'js/'
            },
            {
              pattern: /require\.js/ig,
              replacement: 'require.js'
            }
          ]
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: [
          {
            src: [dirSource+'/app/main.scss'],
            dest: dirDeploy+'/css/main.css'
          }
        ]
      },
      dev: {
        options: {
          style: 'expanded'
        },

        files: [
          {
            src: [dirSource+'/app/main.scss'],
            dest: dirSource+'/css/main.css'
          }
        ]
      }
    },
    watch: {
      dev: {
        files: [dirSource+'/app/**/*'],
        tasks: ['default']
      }

    }
  });
  /*
  */
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');
	// Default task.
	grunt.registerTask('default', ['requirejs', 'copy', 'string-replace', 'sass']);
};
