var gulp = require('gulp');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');

const JS_PATH = 'public/javascripts/';
const CSS_PATH = 'public/stylesheets/';

const MAIN_REDUX_FILES = [
  JS_PATH+'actions/*.js',
  JS_PATH+'components/main/*.js',
  JS_PATH+'containers/*.js',
  JS_PATH+'reducers/*.js',
  JS_PATH+'main.js'
];
const USERS_REDUX_FILES = [
  JS_PATH+'actions/*.js',
  JS_PATH+'components/users/*.js',
  JS_PATH+'containers/*.js',
  JS_PATH+'reducers/*.js',
  JS_PATH+'users.js'
];
const UTIL_FILES = [
  JS_PATH+'util/jquery.js',
  JS_PATH+'util/semantic.js',
  JS_PATH+'util/sweetalert-dev.js'
];
const CSS_FILES = [
  CSS_PATH+'semantic.css',
  CSS_PATH+'sweetalert.css'
];

gulp.task('default', ['main_redux', 'users_redux', 'util', 'stylesheets']);

gulp.task('main_redux', () => {
  return gulp.src(JS_PATH+'main.js')
    .pipe(webpack( require('./webpack.config.js').main ))
    .pipe(gulp.dest(JS_PATH+'dist/'));
});
gulp.task('users_redux', () => {
  return gulp.src(JS_PATH+'users.js')
    .pipe(webpack( require('./webpack.config.js').users ))
    .pipe(gulp.dest(JS_PATH+'dist/'));
});
gulp.task('util', () => {
  return gulp.src(UTIL_FILES)
    .pipe(concat('util.js'))
    .pipe(uglify())
    .pipe(gulp.dest(JS_PATH+'util/dist/'));
});
gulp.task('stylesheets', () => {
  return gulp.src(CSS_FILES)
    .pipe(concatCss('bundle.css'))
    .pipe(cleanCSS({
      restructuring: false,
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest(CSS_PATH+'/'))

})
gulp.task('watch', () => {
  gulp.watch(MAIN_REDUX_FILES, ['main_redux']);
  gulp.watch(USERS_REDUX_FILES, ['users_redux']);
  gulp.watch(UTIL_FILES, ['util']);
  gulp.watch(CSS_FILES, ['stylesheets']);
})
