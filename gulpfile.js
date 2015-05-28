var gulp = require("gulp");
var sass = require("gulp-sass"); // node-sass
var autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックス
var uglify = require("gulp-uglify"); //JS圧縮
var plumber = require('gulp-plumber'); //エラー停止回避
var notify = require('gulp-notify'); // 通知
var cssmin = require('gulp-cssmin'); //CSS圧縮
var stylus = require('gulp-stylus'); // stylusコンパイル
var sourcemaps = require('gulp-sourcemaps');// ソースマップ
var webp = require('gulp-webp'); // WebP圧縮
var spritesmith = require("gulp.spritesmith"); //スプライト
var imagemin = require("gulp-imagemin"); //画像圧縮
var compass = require('gulp-compass'); // Compass


var $sass_mode = "1"; //0はcompass 1だとnode-sass


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

gulp.task('webp', function () {
	console.log( '---------- WebP圧縮 task ----------' );
	gulp.src('images/**/*.{png.jpg,jpeg,gif,tiff}')
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(webp())
	.pipe(gulp.dest("images/"))
	.pipe(notify({message: 'WebP 圧縮完了', onLast: true}) );
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

gulp.task( 'imagemin', function(){
	console.log( '---------- imagemin task ----------' );
	var srcGlob = ['images/**/*.+(jpg|jpeg|png|gif|svg)', '!images/min/**/*.+(jpg|jpeg|png|gif|svg)'];
	var dstGlob = 'images/min';
	var imageminOptions = {
		optimizationLevel: 7,
		progressive: true,
		interlaced: true
	};

	gulp.src( srcGlob )
		.pipe(imagemin( imageminOptions ))
		.pipe(gulp.dest( dstGlob ))
		.pipe(notify({message: '画像圧縮完了', onLast: true})
		);
});

gulp.task('compass', function() {
	console.log( '---------- Compass task ----------' );
	gulp.src('./sass/**/*.scss')
	.pipe(compass({
		config_file: './config.rb',
		css: 'css',
		sass: 'sass'
	}))
	.pipe(gulp.dest('css'))
	.pipe(notify({message: 'Compass 完了', onLast: true}) );
});

gulp.task("default", function() {
	console.log( '---------- default task ----------' );
	gulp.watch(["js/**/*.js","!js/min/**/*.js"],["js"]);

	if ($sass_mode == 0){
		console.log( '---------- Compass Watch task ----------' );
		gulp.watch("sass/**/*.scss",["compass"]); // ruby-sass
	} else {
		console.log( '---------- Sass Watch task ----------' );
		gulp.watch("sass/**/*.scss",["sass"]); // node-sass
	}
	gulp.watch("images/**/*.{png,jpg,jpeg,gif}",["webp"]);
	//gulp.watch("stylus/**/*.styl",["stylus"]);
});

gulp.task("prod", function() {
	console.log( '---------- prod task ----------' );

});