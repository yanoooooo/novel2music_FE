var gulp = require('gulp');
var sass = require('gulp-sass');

// Sassコンパイルタスク
gulp.task('sass', function(){
  gulp.src('./public/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css/'));
});

// watchタスク(**/*.scss変更時に実行するタスク)
gulp.task('sass-watch', ['sass'], function(){
  var watcher = gulp.watch('./src/css/*.scss', ['sass']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('default', ['sass-watch']);
