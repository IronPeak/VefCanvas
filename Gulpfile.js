var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('sass',function() {
	gulp.src('scss/app.scss')
	.pipe(sass({
		includePaths:['scss']

	}))
	.pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function(){
	browserSync.init(["css/*css","js/*.js","*.html","Shape.js","Square.js","Base.js","App.js","Point.js"], {
		server:{
			baseDir: "./"
		}
	});
});
gulp.task('watch',['sass','browser-sync'],function() {
	gulp.watch(["scss/*.scss","scss/base/*.scss", "scss/selections/*scss","scss/style*.scss","*.html","Shape.js","Square.js","Base.js","App.js","Point.js"],['sass']);
});