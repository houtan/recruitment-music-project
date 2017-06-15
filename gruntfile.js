module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "assets/css/main.css": "assets/less/main.less"
        }
      }
	  /*, production: {
		 options: {
			 paths: ["assets/"],
			 cleancss: true
		 },
		 files: {"css/main.css": "less/main.less"}
	 }*/
    },
    watch: {
      styles: {
        files: ['assets/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });
  
  /* grunt.loadNpmTasks('grunt-contrib-less'); */
  grunt.registerTask('default', ['less', 'watch']);
};