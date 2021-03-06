'use strict';

/**
 * raum3 gulpfile - Version Dec 2017 - Bootstrap4 ready -
 */

const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const flexbugsfixes = require('postcss-flexbugs-fixes');
const cleanCss = require('gulp-clean-css');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

//Conditionals
const argv = require('yargs').argv;
const gulpif = require('gulp-if');


const processors = [
    flexbugsfixes,
    autoprefixer({
        browsers: ['last 2 versions', '> 0.1%']
    })
];

//TODO: @metz Build Plugins only with necessary js plugins
const paths = {
    scss: 'src/scss/**/*.scss',
    php: '**/*.php',
    scripts: ['src/js/*.js'],
    plugins: ['node_modules/viewport-units-buggyfill/viewport-units-buggyfill.js'],
    css: []
};

gulp.task('minifyhtml', () => {
    return gulp.src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./'));
})

gulp.task('bundle', () => {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(gulp.dest('./assets/js'));
});

gulp.task('sass', () => {
    gulp.src('src/scss/main.scss')
        .pipe(sass({ outputStyle: argv.production ? 'compressed' : 'expanded' }).on('error', sass.logError))
        .pipe(concat('styles.min.css'))
        .pipe(postcss(processors))
        .pipe(gulpif(argv.production, cleanCss({ compatibility: 'ie8' })))
        .pipe(gulp.dest('assets/css'))
});

gulp.task('compress', () => {
    gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(concat('scripts.min.js'))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('assets/js'))
});

gulp.task('plugins', () => {
    gulp.src(paths.plugins)
        // .pipe(sourcemaps.init())
        //.pipe(babel({presets: ['@babel/env']}))
        .pipe(concat('plugins.min.js'))
        .pipe(gulpif(argv.production, uglify()))
        // .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('assets/js'));
    gulp.src(paths.css)
        .pipe(concat('plugins.css'))
        .pipe(postcss(processors))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('watch', () => {
    livereload({ start: true });
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.scripts, ['compress']);
    gulp.src('assets/js/*.js').pipe(watch('assets/js/*.js'));
    gulp.src('assets/css/*.css').pipe(watch('assets/css/*.css'));
});

gulp.task('default', ['sass', 'compress', 'plugins']);
gulp.task('watch_with_default', ['default', 'watch']);
