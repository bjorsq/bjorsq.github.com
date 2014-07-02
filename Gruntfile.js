module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';'
			},
			js: {
				// the files to concatenate
				src: [
					//'_scripts/affix.js', 
					//'_scripts/alert.js', 
					//'_scripts/button.js',
					//'_scripts/carousel.js', 
					'_scripts/collapse.js', 
					//'_scripts/dropdown.js', 
					'_scripts/flickr.js', 
					//'_scripts/github.js', 
					//'_scripts/modal.js', 
					//'_scripts/popover.js', 
					//'_scripts/scrollspy.js', 
					//'_scripts/tab.js', 
					//'_scripts/tooltip.js', 
					'_scripts/treansition.js',
					'_scripts/fancybox/source/jquery.fancybox.pack.js',
					'_scripts/fancybox/source/helpers/jquery.fancybox-media.js',
					'_scripts/bjorsq.js'
				],
				// the location of the resulting JS file
				dest: 'assets/themes/bjorsq/js/script.js'
			}
		},
		uglify: {
			theme: {
				options: {
					// the banner is inserted at the top of the output
					banner: '/*!\n * <%= pkg.name %>\n * jQuery Plugins and theme scripts\n * generated <%= grunt.template.today("dd-mm-yyyy") %>\n */\n',
					mangle: false
				},
				files: {
					'assets/themes/bjorsq/js/script.min.js': ['<%= concat.js.dest %>']
				}
			},
			site: {
				options: {
					// the banner is inserted at the top of the output
					banner: '/*!\n * <%= pkg.name %>\n * jQuery Plugins and theme scripts\n * generated <%= grunt.template.today("dd-mm-yyyy") %>\n */\n',
					mangle: false
				},
				files: {
					'_site/assets/themes/bjorsq/js/script.min.js': ['<%= concat.js.dest %>']
				}
			}
		},
		less: {
			theme: {
				options: {
					paths: ["_less"],
					cleancss:true
				},
				files: {
					"assets/themes/bjorsq/css/style.min.css": "_less/style.less"
				}
			},
			site: {
				options: {
					paths: ["_less"],
					cleancss:true
				},
				files: {
					"_site/assets/themes/bjorsq/css/style.min.css": "_less/style.less"
				}
			},
			dev: {
				options: {
					paths: ["css/less"],
					cleancss:false
				},
				files: {
					"assets/themes/bjorsq/css/style.css": "_less/style.less"
				}
			}
		},
		jekyll: {
			options: {
				bundleExec: false
			},
			comp: {
				options: {
					dest: '_site',
					safe: true,
					config: '_config.yml'
				}
			}
		},
		watch: {
			less: {
				files: ['_less/*.less'],
				tasks: ['less:theme', 'less:site', 'less:dev']
			},
			uglify: {
				files: ['_scripts/*.js'],
				tasks: ['concat:js', 'uglify:theme', 'uglify:site']
			},
			jekyll: {
				files: ['_includes/themes/bjorsq/*.html', '_layouts/*.html', '_posts/**/*.md', '*.md'],
				tasks: ['jekyll:comp']
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-banner');

	// Default task(s).
	grunt.registerTask('default', ['less:production', 'concat:js', 'uglify:producton']);

};