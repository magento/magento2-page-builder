const gulp  = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    babel = require('gulp-babel');

/**
 * Run an initial build than watch for changes
 */
gulp.task('default', function() {
    gulp.start('build');
    gulp.start('watch');
});

/**
 * Build the TypeScript files into production JS
 */
gulp.task('build', function () {
    var tsProject = ts.createProject(__dirname + '/tsconfig.json', {
        typescript: require('typescript')
    });

    return tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            "presets": ["es2015", "stage-0"],
            "plugins": [
                "transform-es2015-modules-amd",
                "magento2"
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('view/adminhtml/web/js/dist/'));
});

/**
 * Watch for changes in the TypeScript directory
 */
gulp.task('watch', function () {
    gulp.watch([
        './view/adminhtml/web/js/src/**/*.ts',
        'node_modules/@types/**/*.d.ts'
    ], ['build']);
});