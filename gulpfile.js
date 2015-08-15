var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var stylish = require('jshint-stylish');
var sourcemaps = require("gulp-sourcemaps");
var ngHtml2Js = require("gulp-ng-html2js");
var htmlMin = require('gulp-minify-html');
var karma = require('karma').server;
var insert = require('gulp-insert');
var ngAnnotate = require('gulp-ng-annotate');
var cache = require('gulp-cached');
var uglify = require('gulp-uglify');
var routeBundler = require('systemjs-route-bundler');
var concatFile = require('gulp-concat');


var compilerOptions = {
    modules: 'system',
    moduleIds: false,
    // http://babeljs.io/docs/advanced/external-helpers/
    externalHelpers: true,
    comments: false,
    compact: true,
    // https://babeljs.io/docs/usage/options/#options - check env section
    // Allow for environmental selective builds
    env: {
      development: {
        compact: false,
        comments: true
      }
    }
};

var path = {
    source: 'src/**/*.js',
    html: '**/*.html',
    templates: 'src/**/*.html',
    themesOutput: 'dist/assets/',
    output: 'dist/',
    outputCss: 'dist/**/*.css'
};

gulp.task('test', ['compile'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function () {
        done();
    });
});

gulp.task('clean', function () {
    return gulp.src([path.output])
        .pipe(vinylPaths(del));
});

gulp.task('html', function () {
    return gulp.src(path.templates)
        .pipe(cache('html'))
        .pipe(plumber())
        .pipe(changed(path.output, {extension: '.html'}))
        .pipe(htmlMin({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            template: "import angular from 'angular';\n" +
            "export default angular.module('<%= moduleName %>', []).run(['$templateCache', function($templateCache) {\n" +
            "   $templateCache.put('<%= template.url %>',\n    '<%= template.prettyEscapedContent %>');\n" +
            "}]);\n"
        }))
        .pipe(babel(compilerOptions))
        .pipe(gulp.dest(path.output))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('cache-bust', function () {
    var cacheBust = "var systemLocate = System.locate; System.locate = function(load) { var System = this; return Promise.resolve(systemLocate.call(this, load)).then(function(address) { if(address.indexOf('bust') > -1 || address.indexOf('css') > -1 || address.indexOf('json') > -1) return address; return address + System.cacheBust; }); } System.cacheBust = '?bust=' + " + Math.round(new Date() / 1000) + ";";
    return gulp.src('app/app.js')
        .pipe(insert.prepend(cacheBust))
        .pipe(gulp.dest(path.output));
});

gulp.task('es6', function () {

    return gulp.src(path.source)
        .pipe(cache('es6'))
        .pipe(plumber())
        .pipe(changed(path.output, {extension: '.js'}))
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate({
            sourceMap: true,
            gulpWarnings: false
        }))
        .pipe(babel(compilerOptions))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.output))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inline-systemjs', function () {
    return gulp.src([
        './node_modules/es6-module-loader/dist/es6-module-loader.js',
        './node_modules/systemjs/dist/system.js',
        './node_modules/babel-core/external-helpers.js',
        './system.config.js',
        'dist/app/app.js'
    ])
        .pipe(uglify())
        .pipe(concatFile('app/app.js'))
        .pipe(gulp.dest(path.output));
});

gulp.task('compile', function (callback) {
    return runSequence(
        ['html', 'es6'],
        callback
    );
});

gulp.task('recompile', function (callback) {
    return runSequence(
        'clean',
        ['compile'],
        callback
    );
});

gulp.task('compile-production', function (callback) {
    return runSequence(
        'recompile',
        callback
    );
});

gulp.task('release', function (callback) {
    return runSequence(
        'build',
        'cache-bust',
        'inline-systemjs',
        callback
    );
});

gulp.task('lint', function () {
    return gulp.src(path.source)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('serve', ['recompile'], function (done) {
    browserSync({
        open: false,
        port: 9000,
        server: {
            baseDir: ['.'],
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    }, done);
});

gulp.task('watch', ['serve'], function () {
    var watcher = gulp.watch([path.source, path.html, path.less, path.json, path.themes], ['compile']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('build', ['compile-production'], function () {

   // Our applicaiton module routes to handle
   // Could also be in a config that dynamically generates the paths
   var routes = [
     'app/views/main/main.module'
   ];

    var config = {
        dest: 'dist',
        main: 'app/app.js',
        destMain: 'dist/app',
        bundleThreshold: 0.6,
        routes: routes,
        systemConfig: './system.config.js',
        sourceMaps: false,
        minify: true,
        mangle: true,
        verboseOutput: true,
        ignoredPaths: [
            'bower_components',
            'node_modules',
            'npm/'
        ]
    };

    return routeBundler.build(config);
});
