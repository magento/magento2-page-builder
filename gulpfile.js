const prettyTypescript = require('pretty-typescript');
const gulp  = require('gulp');
 
gulp.task('prettify', function () {
    gulp.src('view/adminhtml/web/js/src/**/*.ts')
        .pipe(prettyTypescript())
        .pipe(gulp.dest('src'));
});