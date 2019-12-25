const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const sassGlob = require('gulp-sass-glob');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');

const developPath = '_dev/';
const outputPath = 'dist/';

const paths = {
  src: `${developPath}/`,
  srcSass: `${developPath}scss/**/*.scss`,
  srcJs: `${developPath}js/*.js`,
  srcCss: `${developPath}**/*.css`,
  srcSVG: `${developPath}svg/*`,
  dirCss: `${outputPath}assets/css/`,
  dirJs: `${outputPath}assets/js/`,
};

const sassSettings = {
  overrideBrowserslist: ['last 1 version'],
  cascade: false,
};

/** @see sass */
gulp.task('sass', () => gulp
  .src(paths.srcSass)
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(autoprefixer(sassSettings))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(paths.dirCss)));

/**
 * ファイルの移動のためのタスク
 */
gulp.task('css', () => gulp.src(paths.srcCss).pipe(gulp.dest(paths.dirCss)));

gulp.task('js', () => gulp
  .src(paths.srcJs)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(paths.dirJs)));

gulp.task('run', gulp.series(gulp.parallel('sass', 'css', 'js')));

gulp.task('js:watch', () => {
  gulp.watch(paths.srcJs, gulp.task('js'));
});

gulp.task('sass:watch', () => {
  gulp.watch(paths.srcSass, gulp.task('sass'));
});

gulp.task('css:watch', () => {
  gulp.watch(paths.srcCss, gulp.task('css'));
});

gulp.task('default', gulp.series(gulp.parallel('js:watch', 'css:watch', 'sass:watch')));
