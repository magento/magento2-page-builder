const gulp  = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel');

/**
 * Run an initial build than watch for changes
 */
gulp.task('default', ['watch', 'build']);

/**
 * Build the TypeScript files into production JS
 */
gulp.task('build', function () {
    return gulp.src('view/adminhtml/web/ts/**/*.ts')
        .pipe(sourcemaps.init())
            .pipe(babel()) // Regular transformation
            // browser friendly transformation
            .pipe(babel({babelrc: false, presets: ['es2015', ['stage-0', {loose: true}]]}))
        .pipe(sourcemaps.write('./'))
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
