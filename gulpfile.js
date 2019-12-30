'use strict';

var gulp = require('gulp'),
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	htmlmin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	fileinclude = require('gulp-file-include'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	runSequence = require('gulp-run-sequence'),
	replace = require('gulp-replace'),
	plumber = require('gulp-plumber'), //错误处理提示
	path = {
		release: {
			root: 'dist',
			assets: 'dist/assets'
		},
		development: {
			root: 'dev',
			assets: 'dev/assets'
		},
		source: {
			root: 'src',
			assets: 'src/assets'
		}
	};

//css任务
gulp.task('css-dev',function() {
	return gulp.src(path.source.assets + '/css/**/*.less')
				.pipe(plumber())
				.pipe(less())
				.pipe(autoprefixer(
					{
			            browsers: ['last 2 versions'],
			            cascade: false,
			            remove: false
			        }
				))
				.pipe(gulp.dest(path.development.assets + '/css'))
				.pipe(reload({stream: true}));
});

gulp.task('css',function() {
	return gulp.src(path.source.assets + '/css/**/*.less')
				.pipe(plumber())
				.pipe(less())
				.pipe(autoprefixer(
					{
			            browsers: ['last 2 versions'],
			            cascade: false,
			            remove: false
			        }
				))
				.pipe(minifyCss())
				.pipe(gulp.dest(path.release.assets + '/css'));
});

//js任务
gulp.task('script-dev',function() {
	return gulp.src(path.source.assets + '/script/**/*.js')
				.pipe(plumber())
				.pipe(gulp.dest(path.development.assets + '/script'));
});

gulp.task('script',function() {
	return gulp.src(path.source.assets + '/script/**/*.js')
				.pipe(plumber())
				.pipe(uglify())
				.pipe(gulp.dest(path.release.assets + '/script'));
});

//html任务
gulp.task('fileinclude',function() {
	return gulp.src(path.source.root + '/pages/**/*.html')
				.pipe(plumber())
				.pipe(fileinclude({
					prefix: '@@',
					basepath: '@file'
				}))
				.pipe(gulp.dest(path.development.root));
});

gulp.task('html',function() {
	var options = {
		removeComments: true,  //清除HTML注释
        collapseWhitespace: false,  //压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
	};

	return gulp.src(path.development.root + '/**/*.html')
			.pipe(plumber())
			.pipe(htmlmin(options))
			.pipe(replace('../assets/','./assets/'))
			.pipe(gulp.dest(path.release.root));
});

//image任务
gulp.task('images-dev',function() {
	return gulp.src(path.source.assets + '/images/**/*.{png,jpg,jpeg,ico,svg}')
				.pipe(plumber())
				.pipe(gulp.dest(path.development.assets + '/images'));
});

gulp.task('images',function() {
	return gulp.src(path.source.assets + '/images/**/*.{png,jpg,jpeg,ico,svg}')
				.pipe(plumber())
				.pipe(gulp.dest(path.release.assets + '/images'));
});

//clean任务
gulp.task('clean-dev',function() {
	return gulp.src(path.development.root + '/*', {read: false})
				.pipe(clean());
});

gulp.task('clean',function() {
	return gulp.src(path.release.root + '/*', {read: false})
				.pipe(clean());
});

gulp.task('build',function(cb) {
	runSequence('clean-dev','css-dev','script-dev','images-dev','fileinclude',cb);
})

gulp.task('deploy',function(cb) {
	runSequence('clean','script','css','images','html',cb);
})

//启动热更新
gulp.task('server',['clean-dev','build'],function() {
	browserSync.init({
		port: '8080',
		server: path.development.root
	});
	gulp.watch(path.source.assets + '/script/**/*.js',['script-dev']);
	gulp.watch(path.source.assets + '/less/**/*.less',['css-dev']);
	gulp.watch(path.source.assets + '/css/**/*.less',['css-dev']);
	gulp.watch(path.source.assets + '/images/**/*.{png,jpg,jpeg,ico,svg}',['images-dev']);
	gulp.watch(path.source.root + '/**/*.html',['fileinclude']);
	gulp.watch(path.source.root + '/**/*.*').on('change', reload);
})

//项目运行
gulp.task('default',['server'])

//项目发布
gulp.task('release',['deploy']);
