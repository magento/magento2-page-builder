const gulp  = require('gulp'),
    ts = require('gulp-typescript');

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
        .pipe(tsProject())
        .pipe(gulp.dest('view/adminhtml/web/js/gulp/'));
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