'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var del = require('del');
var tiny = require('gulp-tinypng-nokey2');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');	
var browserSync = require('browser-sync').create(),
		imagemin = require('gulp-imagemin'),
		imageminJpegRecompress = require('imagemin-jpeg-recompress'),
		cache = require('gulp-cache');



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('pug', function(){
		return gulp.src('src/pug/pages/*.pug')
		    .pipe(sourcemaps.init())
				.pipe(pug({
						pretty:true
				}))
				.pipe(plumber({errorHandler: notify.onError(function(error) {
							return {
								title: 'Pug',
								message:"Error: <%= error.message %>"
							};
				})}))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest('build'))
				.pipe(browserSync.reload({
						stream:true
				}));
});

gulp.task('style', function(){
		return gulp.src('src/style/main.scss')
		    .pipe(sourcemaps.init())
				.pipe(sass())
				.pipe(autoprefixer({  //Добавим вендорные префиксы
            browsers: ['last 2 versions'],
            cascade: false
        })) 
				.pipe(csso())
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest('build/css'))
				.pipe(browserSync.reload({
						stream:true
				}));
});

gulp.task('scripts', function(){
		return gulp.src('src/js/main.js')
		    .pipe(sourcemaps.init())
				.pipe(rigger()) //Прогоним через rigger
				.pipe(sourcemaps.write())
				.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				.pipe(gulp.dest('build/js'))
				.pipe(browserSync.reload({
						stream:true
				}));
});

gulp.task('img:dev', function(cb) {
    return gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});


//img build
gulp.task('img:build', function (){
	return gulp.src('src/img/general/**/*.*')
    .pipe(cache(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imageminJpegRecompress({
            loops: 5,
            min: 70,
            max: 75,
            quality: 'medium'
        }),
        imagemin.svgo(),
        imagemin.optipng({optimizationLevel: 3}),
        //pngquant({quality: '65-70', speed: 5})
    ], {
        verbose: true
    })))
    .pipe(gulp.dest('build/img/general'));
});

gulp.task('svg',function(){
    return gulp.src('src/img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty:true
            }
        }))
        .pipe(cheerio({
            run:function($) {
                $('fill').removeAttr('fill');
                $('stroke').removeAttr('stroke');
                $('style').removeAttr('style');
            },
            parseOptions: {xmlMode:true}
        }))
            .pipe(replace('&gt;', '>'))
            .pipe(svgSprite({
                mode: {
                    symbol: {
                        sprite: "sprite.svg"
                    }
                }
            }))
            .pipe(gulp.dest('build/img/svg/'));
});

gulp.task('svg:copy', function(){
		return gulp.src('src/img/general/svg/*.svg')
				.pipe(gulp.dest('build/img/general/svg/'))
});


gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts/'))
});



gulp.task('watch', function(){
		gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
		gulp.watch('src/style/**/*.scss', gulp.series('style'));
		gulp.watch('src/js/**/*.js', gulp.series('scripts'));
		gulp.watch('src/img/general/**/*.{png, jpg, gif}', gulp.series('img:dev'));
		gulp.watch('src/img/svg/*.svg', gulp.series('svg'));
		gulp.watch('src/img/general/svg/*.svg', gulp.series('svg:copy'));
});

gulp.task('clean', function(){
    return del(['build/'])
});

gulp.task('dev', gulp.series(
		'clean',
		gulp.parallel('pug', 'style', 'scripts', 'img:build', 'svg', 'svg:copy', 'fonts')
));

gulp.task('build', gulp.series(
		'clean',
		gulp.parallel('pug', 'style', 'scripts', 'img:build', 'svg', 'fonts'),
));

gulp.task('default', gulp.series(
		'dev',
		gulp.parallel(
					'watch',
					'server'
			)
  ));