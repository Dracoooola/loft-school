const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const svgmin = require('gulp-svgmin');

// styles 
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// scripts
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js')

// для удобства все пути в одном месте
const paths = {
    root: './build',
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts/'
    },
    templates: {
        src: 'src/templates/**/*.pug',
        dest: 'build/assets/'
    },
    images: {
        src: 'src/images/**/*.*',
        dest: 'build/assets/images/'
    },
    fonts: {
        src: 'src/fonts/**/*.*',
        dest: 'build/assets/fonts/'
    }
};

// pug
function templates() {
    return gulp.src('./src/templates/pages/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
}

// webpack
function scripts() {
    return gulp.src('src/scripts/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

// очистка папки build
function clean() {
    return del(paths.root);
}

// просто переносим картинки
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}
// просто переносим fonts
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}
// следим за src и запускаем нужные таски (компиляция и пр.)
function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
}

// следим за build и релоадим браузер
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// экспортируем функции для доступа из терминалsа (gulp clean)
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.templates = templates;
exports.images = images;
exports.fonts = fonts;
exports.watch = watch;
exports.server = server;

// сборка и слежка
gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, scripts, templates, images, fonts),
    gulp.parallel(watch, server)
));

gulp.task('sprite:svg', function() {
    return gulp.src('./src/images/svg-sprites/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('./src/images/sprite'));
});