var gulp = require("gulp");
var sass = require("gulp-sass"); // node-sass
var autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックス
var uglify = require("gulp-uglify"); //JS圧縮
var plumber = require('gulp-plumber'); //エラー停止回避
var notify = require('gulp-notify'); // 通知
var cssmin = require('gulp-cssmin'); //CSS圧縮
var stylus = require('gulp-stylus'); // stylusコンパイル
var sourcemaps = require('gulp-sourcemaps');// ソースマップ
var spritesmith = require("gulp.spritesmith");

gulp.task("sass", function() {
	console.log( '---------- sass task ----------' );
	gulp.src("sass/**/*scss")
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer("last 2 version"))
	.pipe(cssmin())
	.pipe(sourcemaps.write( '.' ))
	.pipe(gulp.dest("./css"))
	.pipe(notify({message: 'Sass コンパイル完了', onLast: true}) );
});

gulp.task('stylus', function() {
	console.log( '---------- stylus task ----------' );
	gulp.src('stylus/*.styl')
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sourcemaps.init())
	.pipe(stylus({ compress: true }))
	.pipe(sourcemaps.write( '.' ))
	.pipe(gulp.dest('css/'))
	.pipe(notify({message: 'Stylus コンパイル完了', onLast: true}) );
});

gulp.task("js", function() {
	console.log( '---------- Javascript task ----------' );
	gulp.src(["js/**/*.js","!js/min/**/*.js"])
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(uglify())
	.pipe(gulp.dest("./js/min"))
	.pipe(notify({message: 'JS 圧縮完了', onLast: true}) );
});

gulp.task('sprite', function () {
	console.log( '---------- SpriteImage task ----------' );
	var spriteData = gulp.src('./images/sprite/*.png')
	    .pipe(plumber())
	    .pipe(spritesmith({
	        imgName: 'sprite.png',
	        cssName: '_sprite.scss'
	    }));
	spriteData.img.pipe(gulp.dest("images"));
	spriteData.css.pipe(gulp.dest("sass/sprite"));
});

gulp.task("default", function() {
	console.log( '---------- default task ----------' );
	gulp.watch(["js/**/*.js","!js/min/**/*.js"],["js"]);
	gulp.watch("sass/**/*.scss",["sass"]);
	//gulp.watch("stylus/**/*.styl",["stylus"]);
});