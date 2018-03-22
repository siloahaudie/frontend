/*
  $ npm install browser-sync gulp-twig gulp-livereload del gulp-imagemin gulp-cache gulp-sass gulp-autoprefixer gulp-cssnano gulp-notify jshint gulp-jshint gulp-concat gulp-rename gulp-uglify --save-dev
*/

var gulp = require('gulp');
var browserSync = require('browser-sync');
var twig = require('gulp-twig');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

var src = {
    styles: 'src/styles/main.scss',
    scripts: 'src/scripts/**/*.js',
    images: 'src/images/**/*',
    templates: 'src/templates/**/*.html'
};

var reload = browserSync.reload;

gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'templates');
});

/* Clean */
gulp.task('clean', function() {
  return del(['public/styles', 'public/scripts', 'public/images']);
});

/* Serve */
gulp.task('serve', function() {

    browserSync({
        server: "./public"
    });

    gulp.watch(src.styles, ['styles']);
    gulp.watch(src.scripts, ['scripts']);
    gulp.watch(src.images, ['images']);
    gulp.watch(src.templates, ['templates']);
});

/* Styles */
gulp.task('styles', function() {
  return gulp.src(src.styles)
    .pipe(sass().on('error', function(err) {
      console.error(err.message);
      browserSync.notify(err.message, 3000);
      this.emit('end');
    }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('public/styles'))
    .pipe(reload({stream: true}));
    // .pipe(notify({ message: 'Styles task complete' }));
});

/* scripts */
gulp.task('scripts', function() {
  return gulp.src(src.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(reload({stream: true}));
    // .pipe(notify({ message: 'Scripts task complete' }));
});

/* Images */
gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'))
    .pipe(reload({stream: true}));
    // .pipe(notify({ message: 'Images task complete' }));
});

/* Templates */
gulp.task('templates', function() {
    return gulp.src(src.templates)
        .pipe(twig())
        .pipe(gulp.dest('public'))
        // .pipe(notify({ message: 'Template task complete' }))
        .on("end", reload);
});
