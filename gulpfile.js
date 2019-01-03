const gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    plugins = require('gulp-load-plugins')(),
    header = require('gulp-header'),
    newer = require('gulp-newer'),
    shell = require('gulp-shell');

const config = {
    basePath: 'app/code/Magento/PageBuilder',
    tsPath: 'view/adminhtml/web/ts/',
    buildPath: 'view/adminhtml/web/',
    testsPath: 'dev/tests/js/',
    sourceMaps: !plugins.util.env.production
};

const buildTask = function(inputStream, done) {
    const stream = inputStream
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
        .pipe(plugins.babel()).on("error", function(error) {
            done(error);
        })
        .pipe(header("/*eslint-disable */\n"))
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './ts'
        })))
        .pipe(gulp.dest(path.join(config.basePath, config.buildPath)));
    gulp.start('errors');
    return stream;
};

/**
 * Run an initial build than watch for changes
 */
gulp.task('default', ['build', 'watch', 'lint']);

/**
 * Check for any new errors introduced since last build
 */
gulp.task('errors', shell.task("node_modules/typescript/bin/tsc --noEmit"));

/**
 * Fix all TypeScript linting issues
 */
gulp.task('lint', shell.task("node_modules/tslint/bin/tslint --fix --project ."));

/**
 * Build the TypeScript files into production JS
 */
gulp.task('build', function(done) {
    return buildTask(
        gulp.src([path.join(config.basePath, config.tsPath, '**/*.ts'), '!' + path.join(config.basePath, config.tsPath, '**/*.d.ts')]),
        done
    );
});

/**
 * Build the only TypeScript files that were changed
 */
gulp.task('buildChanged', function(done) {
    return buildTask(
        gulp.src([path.join(config.basePath, config.tsPath, '**/*.ts'), '!' + path.join(config.basePath, config.tsPath, '**/*.d.ts')])
            .pipe(
                newer({
                    dest: path.join(config.basePath, config.buildPath),
                    ext: '.js'
                })
            ),
        done
    );
});

/**
 * Watch for changes in the TypeScript directory
 */
gulp.task('watch', function() {
    gulp.watch([
        path.join(config.basePath, config.tsPath, '**/*.ts')
    ], ['buildChanged']);
});