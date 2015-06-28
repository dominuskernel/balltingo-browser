var gulp            = require('gulp'),
    // this is an arbitrary object that loads all gulp plugins in package.json.
    $           = require("gulp-load-plugins")(),
    path        = require('path'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    sass        = require('gulp-sass');
    merge = require('merge-stream');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('compass', function() {
  return gulp.src('./src/stylesheets/*.sass')
    .pipe($.plumber())
    .pipe($.compass({
      css: 'dist/stylesheets',
      sass: 'src/stylesheets'
    }))
    .pipe(gulp.dest('dist/stylesheets'))
});

gulp.task('py', function() {
  return gulp.src('src/dominuspy/*.py')
    .pipe( gulp.dest('dist/dominuspy'));
});

gulp.task('components', function(){
  return gulp.src('src/bower_components/**/*.*')
    .pipe(gulp.dest('dist/dominuspy/bower_components'))
});

/*gulp.task('images', function() {
  return gulp.src('./src/images/!*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/images'))
})*/

gulp.task('templates', function() {
  return gulp.src('src/views/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe( gulp.dest('dist/') )
});

gulp.task('build', ['compass', 'py','components', 'templates']);

gulp.task('serve', ['build', 'browser-sync'], function () {
  gulp.watch('src/stylesheets/*.sass',['compass', reload]);
  gulp.watch('src/dominuspy/bower-components/*.*',['components']);
  gulp.watch('src/dominuspy/*.py',['py', reload]);
  gulp.watch('src/views/*.jade',['templates', reload]);
});

gulp.task('default', ['serve']);
