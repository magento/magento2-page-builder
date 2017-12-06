const gulp  = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    jestConfig = require('./jest.config'),
    plugins = require('gulp-load-plugins')()
;

const config = {
    basePath: 'app/code/Gene/BlueFoot',
    tsPath: 'view/adminhtml/web/ts/',
    buildPath: 'view/adminhtml/web/',
    testsPath: 'dev/tests/js/',
    sourceMaps: !plugins.util.env.production
};

const buildTask = function (inputStream) {
    return inputStream
            .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
            .pipe(plugins.babel())
            .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('./', {
                includeContent: false,
                sourceRoot: './ts'
            })))
            .pipe(gulp.dest(path.join(config.basePath, config.buildPath)))
};

/**
 * Run an initial build than watch for changes
 */
gulp.task('default', ['build', 'watch']);

/**
 * Build the TypeScript files into production JS
 */
gulp.task('build', function () {
    return buildTask(
        gulp.src([path.join(config.basePath, config.tsPath, '**/*.ts'), '!' + path.join(config.basePath, config.tsPath, '**/*.d.ts')])
    );
});

/**
 * Build the only TypeScript files that were changed
 */
gulp.task('buildChanged', function () {
    return buildTask(
        gulp.src([path.join(config.basePath, config.tsPath, '**/*.ts'), '!' + path.join(config.basePath, config.tsPath, '**/*.d.ts')])
            .pipe(plugins.changed(path.join(config.basePath, config.buildPath), {extension: '.js'}))
    );
});

/**
 * Watch for changes in the TypeScript directory
 */
gulp.task('watch', function () {
    gulp.watch([
        path.join(config.basePath, config.tsPath, '**/*.ts')
    ], ['buildChanged']);
});

gulp.task('jestConfig', function () {
   fs.writeFile(
       'jest.config.json',
       JSON.stringify(jestConfig), () => {}
   );
});
