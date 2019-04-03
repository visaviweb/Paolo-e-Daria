'use strict';

module.exports = function (grunt) {
  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Configurable paths
    paoloedaria: {
        dist: 'web',
        bucket: 'paoloedaria.stmtc.com'
    },
    sass: {
      options: {
        debugInfo: false,
        lineNumbers: false,
        loadPath: [
        'node_modules/',
        ],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: '**/*.{scss,sass}',
          dest: '<%= paoloedaria.dist %>/css',
          ext: '.css'
        }]
      },
    },
    autoprefixer: {
      options: {
        browsers: ['last 4 versions']
      },
      dist: {
        expand: true,
        cwd: '<%= paoloedaria.dist %>/css',
        src: '**/*.css',
        dest: '<%= paoloedaria.dist %>/css'
      }
    },
    cssmin: {
      options: {
        check: 'gzip'
      },
      target: {
        files: [{
          expand: true,
          cwd: '<%= paoloedaria.dist %>/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= paoloedaria.dist %>/css',
          ext: '.css'
        }]
      }
    },
    shell: {
        stmtc: {
          command: 'aws s3 sync <%= paoloedaria.dist %> s3://<%= paoloedaria.bucket %>  --delete --acl public-read --exclude ".DS_Store"'
        }
      }
  });

  // Define Tasks
  grunt.registerTask('build:dev', [
    'sass:dist',
    'autoprefixer:dist',
    ]);

  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer:dist',
    'cssmin',
    ]);

  grunt.registerTask('build-deploy', [
    'build',
    'shell'
    ]);

  grunt.registerTask('deploy', [
    'shell'
    ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
