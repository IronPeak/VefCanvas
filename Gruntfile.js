module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-contrib-jshint');
 grunt.registerTask('default', ['jshint']);
 var taskConfig = {
   jshint: {
     src: ['*.js','!/node_modules/**', '!/images/**', '!Base.js'],
     gruntfile: ['Gruntfile.js'],
     options: {
     }
   }
 };
 grunt.initConfig(taskConfig);
};

