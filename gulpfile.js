'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserSync = require('browser-sync').create();

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp
    .src('./app/styles/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({ includePaths: ['node_modules'], outputStyle: 'compressed' }).on(
        'error',
        $.sass.logError
      )
    )
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./public/styles'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp
    .src('./app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('html', function() {
  return gulp
    .src('app/**/*.html')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('public'))
    .pipe(reload({ stream: true }));
});

gulp.task('images', function() {
  return gulp
    .src('app/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('public/images'));
});

gulp.task('font', function() {
  return gulp
    .src('app/fonts/**/*')
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('serve', ['html', 'font', 'sass', 'scripts', 'images'], function() {
  browserSync.init({
    server: {
      baseDir: '.tmp',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('./app/styles/**/*.scss', ['sass']);
  gulp.watch('./app/*.html', ['html']);
});

gulp.task('dist', ['html', 'images', 'font', 'sass'], function() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: 'public'
    }
  });
});
