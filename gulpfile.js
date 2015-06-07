var gulp            = require('gulp'),
    // this is an arbitrary object that loads all gulp plugins in package.json.
    $         = require("gulp-load-plugins")(),
    express   = require('express'),
    browserSync = require('browser-sync'),
    path      = require('path'),
    tinylr    = require('tiny-lr'),
    app       = express(),
    server    = tinylr();

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('compass', function() {
    gulp.src('./src/stylesheets/main.scss')
        .pipe($.plumber())
        .pipe($.compass({
            css: 'dist/stylesheets',
            sass: 'src/stylesheets'
        }))
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(browserSync.reload({stream: true}))
        .pipe( $.livereload( server ));
});

gulp.task('coffee', function() {
  return gulp.src('src/coffeeScripts/*.coffee')
    .pipe($.plumber())
    .pipe($.coffee({bare: true}).on('error', $.util.log))
    .pipe( gulp.dest('dist/scripts') )
    .pipe(browserSync.reload({stream: true}))
    .pipe( $.livereload( server ) );
});

gulp.task('js', function(){
  return gulp.src('src/lib/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts/lib'))
    .pipe(browserSync.reload({stream: true}))
    .pipe( $.livereload( server ) );
})

gulp.task('assets', function() {
  return gulp.src('./src/assets/*')
    .pipe(gulp.dest('./dist/assets'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('views',function(){
  return gulp.src('src/views/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}))
    .pipe( $.livereload( server ));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  $.util.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/stylesheets/*.scss',['compass']);

    gulp.watch('src/coffeeScripts/*.coffee',['coffee']);

    gulp.watch('src/lib/*js',['js'])

    gulp.watch('src/views/*.jade',['views']);

    gulp.start('browser-sync');

  });
});

// Default Task
gulp.task('default', ['coffee','compass','views','js', 'assets', 'express','watch']);
