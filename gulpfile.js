var gulp = require('gulp');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();

var paths = {
    src: "src",
    srcGlob: "src/**/*.js",
    build: "build"
}
var config = {
    env: argv.debug ? "develop" : "production"
};

var isProd = function() {
    return config.env == "production";
};

var isDev = function() {
    return config.env == "develop";
};

var errorHandler = function(e) {
    gutil.log(gutil.colors.red(e));
}

gulp.task("build", function() {
    return gulp
        .src("index.js")
        .pipe($.browserify({
                // debug: isDev(),
                // insertGlobals: true
            })
            .on('error', errorHandler)
        )
        .pipe(gulp.dest(paths.build));
});

gulp.task("watch", function() {
    gulp.watch(paths.srcGlob, ["build"]);
});

gulp.task("info", [], function() {
    var envString = isProd() ? gutil.colors.green(config.env) :
                               gutil.colors.red(config.env);
    gutil.log("Gulp running in", envString, "mode!");
});

gulp.task("default", [
    "build"
], function() {
    /* Default task */
});

