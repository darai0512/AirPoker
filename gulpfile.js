const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');

gulp.task('browserify', () => {
  browserify('./src/main/app.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', err => console.log(`Error : ${err.message}`))
    .pipe(source('bundle.min.js'))
    .pipe(gulp.dest('./assets/js/'));

  return gulp.src('./assets/js/bundle.min.js')
    .pipe(uglify({preserveComments: 'some'})) // this option remains licence comment
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('sass', () => {
  return gulp.src("assets/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("assets/css"));
});

gulp.task('watch', () => {
  gulp.watch(["src/main/**/*.jsx", "src/main/**/*.js"], ['browserify']);
  gulp.watch(["assets/scss/*.scss"], ['sass']);
});

gulp.task('webserver', () => {
  gulp.src('.')
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true
    })
  );
});

gulp.task('default', ['browserify', 'sass', 'watch', 'webserver']);
