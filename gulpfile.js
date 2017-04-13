var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var pngquant = require("imagemin-pngquant");
var gcmq = require('gulp-group-css-media-queries');
var plumber = require("gulp-plumber");
var mozjpeg = require('imagemin-mozjpeg');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var cssnext = require('postcss-cssnext');
//var excel2json = require('gulp-excel2json');
//var csv2json = require('gulp-csv2json');
var convertEncoding = require('gulp-convert-encoding');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();



//setup
var website = 3;

if (website === 0) {
    var rootDir = "./template/html/";
    var localUrl = "http://localhost.template/";
    var targetDir ="/common/";


} else if (website === 1) {
    var rootDir = "./test1/html/";
    var targetDir ="/test/";

} else if (website === 2) {
    var rootDir = "./test2/html/";
    var targetDir ="/test/";
    var localUrl = "http://localhost.template2/";

} else if (website === 3) {
    var rootDir = "./test3/html/";
    var targetDir ="/test/";
    var localUrl = "http://localhost.template3/";
}


    var paths = {
        "cssSrc": rootDir + targetDir + "css/src/*.css",
        "sassSrc": rootDir + targetDir + "sass/*.scss",
        "xlsxSrc": rootDir + targetDir + "xlsx/src/*.xlsx",
        "csvSrc": rootDir + targetDir + "csv/src/*.csv",
        "imgSrc": rootDir + targetDir + "images/src/*",
        "imgDir": rootDir + targetDir + "compression/images/*"
    };


gulp.task('sass', function () {
    var processors = [
      cssnext()
  ];
    return gulp.src(paths.sassSrc)
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gcmq())
        .pipe(gulp.dest(rootDir + targetDir + 'css/src/'));
});



gulp.task('css', function () {
    return gulp.src(paths.cssSrc)
        .pipe(postcss([
            require('postcss-size'),
            require('cssnano')
        ]))
        //.pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(gulp.dest(rootDir + targetDir + 'css/'));
});






gulp.task('imgmin', function () {
    return gulp.src(paths.imgSrc)
        .pipe(plumber())
        .pipe(imagemin([
       pngquant({
                quality: '65-80',
                speed: 1,
                floyd: 0
            }),
       mozjpeg({
                quality: 85,
                progressive: true
            }),
       imagemin.svgo(),
       imagemin.optipng(),
       imagemin.gifsicle()
     ]))
        .pipe(gulp.dest(rootDir + targetDir + 'compression/images'));
});


//xlsx to json

/*
gulp.task("bulid:json", function () {
    gulp.src(paths.xlsxSrc)
   .pipe(excel2json({
            headRow: 1,
            valueRowStart: 3,
            trace: true
        }))
     .pipe(rename({extname: '.json'}))
     .pipe(convertEncoding({to: "utf-8"}))
        .pipe(gulp.dest(rootDir + '/common/json/'));
});
*/

/*
gulp.task("bulid:json", function () {
    var csvParseOptions = {};
    gulp.src(paths.csvSrc)
        .pipe(csv2json(csvParseOptions))

        .pipe(rename({extname: '.json'}))
     .pipe(convertEncoding({to: "shift_jis"}))
        .pipe(gulp.dest(rootDir + '/common/json/'));
});*/



gulp.task('browser-sync', function () {
    browserSync.init({
        /*server: {
            baseDir: rootDir
        }*/
        proxy: {
            target: localUrl
        }
    });
});




// If you would like to use Sass/SCSS, switch 'less' to 'scss'.

gulp.task('default', ['css', 'imgmin', 'sass', 'browser-sync'], function () {
    //setup参照
    gulp.watch([paths.cssSrc], ['css']);
    //gulp.watch([paths.xlsxSrc], ["bulid:json"])
    //gulp.watch([paths.csvSrc], ["bulid:json"])
    //  gulp.watch([paths.tplSrc], ['html']);
    //  gulp.watch([paths.lessSrc], ['less']);
    gulp.watch([paths.sassSrc], ['sass']);

    gulp.watch([paths.imgSrc], ['imgmin']);
});
