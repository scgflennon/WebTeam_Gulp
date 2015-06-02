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
var cached = require('gulp-cached');
var using = require('gulp-using');

//config
var $sass_mode = "1"; //0はcompass 1だとnode-sass　2だとSassではなくStylusを使う

var root = "views",
config = {
	"path" : {
		"views"		: root,
		"sass"		: root+"/sass",
		"stylus"	: root+"/stylus",
		"css"			: root+"/css",
		"js"			: root+"/js",
		"images"	: root+"/images",
		"sprite"  : root+"/images/sprite"
	}
}


gulp.task("sass", function() {
	console.log( '---------- sass task ----------' );
	gulp.src(config.path.sass+"/**/*scss")
	.pipe(cached())
	.pipe(using())
	.pipe(plumberWithNotify())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer("last 2 version"))
	.pipe(cssmin())
	.pipe(sourcemaps.write( '.' ))
	.pipe(gulp.dest(config.path.css))
	.pipe(notify({message: 'Sass コンパイル完了', onLast: true}) );
});

gulp.task('stylus', function() {
	console.log( '---------- stylus task ----------' );
	gulp.src(config.path.stylus+'/**/*.styl')
	.pipe(cached())
	.pipe(using())
	.pipe(plumberWithNotify())
	.pipe(sourcemaps.init())
	.pipe(stylus({ compress: true }))
	.pipe(sourcemaps.write( '.' ))
	.pipe(gulp.dest(config.path.css))
	.pipe(notify({message: 'Stylus コンパイル完了', onLast: true}) );
});

gulp.task("js", function() {
	console.log( '---------- Javascript task ----------' );
	gulp.src([config.path.js,"!"+config.path.js+"/min/**/*.js"])
	.pipe(cached())
	.pipe(using())
	.pipe(plumberWithNotify())
	.pipe(uglify())
	.pipe(gulp.dest(config.path.js+"/min"))
	.pipe(notify({message: 'JS 圧縮完了', onLast: true}) );
});

gulp.task('webp', function () {
	console.log( '---------- WebP圧縮 task ----------' );
	gulp.src([config.path.images+'/**/*.+(jpg|jpeg|png|gif)', '!'+config.path.image+'/sprite/**/*.+(jpg|jpeg|png|gif)'])
	.pipe(cached())
	.pipe(using())
	.pipe(plumberWithNotify())
	.pipe(webp())
	.pipe(gulp.dest(config.path.images))
	.pipe(notify({message: 'WebP 圧縮完了', onLast: true}) );
});

gulp.task('sprite', function () {
	console.log( '---------- SpriteImage task ----------' );
	var spriteData = gulp.src(config.path.sprite+'/*.png')
		.pipe(cached())
		.pipe(using())
	  .pipe(plumberWithNotify())
	    .pipe(spritesmith({
	        imgName: 'sprite.png',
	        cssName: '_sprite.scss'
	    }));
	spriteData.img.pipe(gulp.dest(config.path.images));
	spriteData.css.pipe(gulp.dest(config.path.sass+"/sprite"));
});

gulp.task( 'imagemin', function(){
	console.log( '---------- imagemin task ----------' );
	var srcGlob = [config.path.images+'/**/*.+(jpg|jpeg|png|gif|svg)', '!'+config.path.images+'/min/**/*.+(jpg|jpeg|png|gif|svg)'];
	var dstGlob = 'images/min';
	var imageminOptions = {
		optimizationLevel: 7,
		progressive: true,
		interlaced: true
	};

	gulp.src( srcGlob )
		.pipe(cached())
		.pipe(using())
		.pipe(imagemin( imageminOptions ))
		.pipe(gulp.dest( dstGlob ))
		.pipe(notify({message: '画像圧縮完了', onLast: true})
		);
});

gulp.task('compass', function() {
	console.log( '---------- Compass task ----------' );
	gulp.src(config.path.sass+'/**/*.scss')
	.pipe(cached())
	.pipe(using())
	.pipe(plumberWithNotify())
	.pipe(compass({
		config_file: './config.rb',
		css: 'css',
		sass: 'sass'
	}))
	.pipe(gulp.dest(config.path.css))
	.pipe(notify({message: 'Compass 完了', onLast: true}) );
});

gulp.task("default", function() {
	console.log( '---------- default task ----------' );
	gulp.watch(["js/**/*.js","!js/min/**/*.js"], {interval: 1000}, ["js"]);

	if ($sass_mode == "0"){
		console.log( '---------- Compass Watch task ----------' );
		gulp.watch("sass/**/*.scss", {interval: 500},["compass"]); // ruby-sass
	} else if ($sass_mode == "1") {
		console.log( '---------- Sass Watch task ----------' );
		gulp.watch("sass/**/*.scss", {interval: 500},["sass"]); // node-sass
	} else if ($sass_mode == "2"){
		console.log( '---------- stylus Watch task ----------' );
		gulp.watch("stylus/**/*.styl", {interval: 500},["stylus"]); // Sassでは無くStylusを使う場合
	}

	gulp.watch("images/**/*.{png,jpg,jpeg,gif}", {interval: 1000} ,["webp"]);


//Sprite
gulp.watch(config.path.sprite+'/**/*.png', function(arg){
	var filePath = arg.path.match(/^(.+\/)(.+?)(\/.+?\..+?)$/);
	var spriteData = gulp.src(filePath[1]+filePath[2]+'/*.png')
	.pipe(plumber())
	.pipe(spritesmith({
		imgName: filePath[2]+'.png',
		cssName: filePath[2]+'.scss'
	}));
	spriteData.img.pipe(gulp.dest(config.path.image));
	spriteData.css.pipe(gulp.dest(config.path.sass));
	});
});

gulp.task("prod", function() {
	console.log( '---------- prod task ----------' );

});


function plumberWithNotify() {
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
}
