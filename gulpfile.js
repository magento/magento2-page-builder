const gulp  = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    babel = require('gulp-babel');

/**
 * Run an initial build than watch for changes
 */
gulp.task('default', ['watch', 'build']);

/**
 * Build the TypeScript files into production JS
 */
gulp.task('build', function () {
    var tsProject = ts.createProject(__dirname + '/tsconfig.json', {
        typescript: require('typescript')
    });

    return tsResult = tsProject.src()
        //.pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(gulp.dest('view/adminhtml/web/es6'))
        .pipe(babel({
            "presets": [["es2015", {"loose": true}], "stage-0"],
            "plugins": [
                "system-import-transformer",
                "transform-es2015-modules-amd",
                "magento2"
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('view/adminhtml/web/js/'));
});

/**
 * Watch for changes in the TypeScript directory
 */
gulp.task('watch', function () {
    gulp.watch([
        './view/adminhtml/web/ts/**/*.ts',
        'node_modules/@types/**/*.d.ts'
    ], ['build']);
});