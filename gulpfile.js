var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var toVinylObjOf = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
 
gulp.task('browserify', function() {
  browserify('./src/main/airpoker.jsx', { debug: true })
    .transform(babelify, {presets: ["react", "es2016"]})
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(toVinylObjOf('bundle.min.js'))
    .pipe(vinylBuffer())
    .pipe(uglify({preserveComments: 'some'}))
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(gulp.dest('./'))
});

gulp.task('sass', function() {
  gulp.src("assets/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("assets/css"));
});

gulp.task('watch', function() {
  gulp.watch(["src/**/*.jsx", "src/**/*.js", "!src/main/logic/trump_framework/*.js"], ['browserify']);
  gulp.watch('assets/scss/*.scss', ['sass']);
});

//gulp.task('webserver', ['browserify'], function() {
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      host: 'localhost'
    , port: 8000
    , livereload: true
    // http://localhost:8000/api -> http://localhost:9000
    /*, proxies: [
        {
          source: '/api'
        , target: 'http://localhost:9000'
        }
      ]*/
    })
  );
});

gulp.task('default', ['browserify', 'watch', 'webserver']);
