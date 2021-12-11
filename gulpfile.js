const { src, dest, series } = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

function pagesTask() {
  return src('src/*.html').pipe(dest('dist'));
}

function scriptsTask() {
  return src('src/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/scripts'));
}

function stylesTask() {
  return src('src/styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/styles'));
}

function imagesTask() {
  return src('src/images/*').pipe(dest('dist/images'));
}

function defaultTask() {
  // return src('dist', { read: false }).pipe(clean());
}

exports.default = series(pagesTask, scriptsTask, stylesTask, imagesTask);
exports.d = defaultTask;
exports.pages = pagesTask;
exports.scripts = scriptsTask;
exports.styles = stylesTask;
exports.images = imagesTask;
