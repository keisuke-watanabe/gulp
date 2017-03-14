var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require("imagemin-pngquant");
var plumber = require("gulp-plumber");
var mozjpeg = require('imagemin-mozjpeg');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync').create();



//setup
var website = 0;

if (website === 0) {
    var rootDir = "./template/html/";
    var localUrl = "http://localhost.template/";

} else if (website === 1) {
    var rootDir = "./developjapan/html/";
}


var paths = {
    "cssSrc": rootDir + "common/css/src/*.css",
    "imgSrc": rootDir + "common/images/src/*",
    "imgDir": rootDir + "common/compression/images/*"
};



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

    .pipe(gulp.dest(rootDir + '/common/css/'));
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
        .pipe(gulp.dest(rootDir + '/common/compression/images'))
});


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

gulp.task('default', ['css', 'imgmin', 'browser-sync'], function () {
    //setup参照
    gulp.watch([paths.cssSrc], ['css']);

    //  gulp.watch([paths.tplSrc], ['html']);
    //  gulp.watch([paths.lessSrc], ['less']);
    // gulp.watch([paths.scssSrc], ['scss']);

    gulp.watch([paths.imgSrc], ['imgmin']);
});
