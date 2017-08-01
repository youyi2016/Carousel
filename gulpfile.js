/*!
 * gulp
 * $ npm install gulp del gulp-cached gulp-uglify gulp-devserver gulp-plumber gulp-rename gulp-concat gulp-notify gulp-filter gulp-jshint gulp-sass gulp-cssnano gulp-replace gulp-imagemin gulp-autoprefixer --save-dev
 */
 
// Load plugins
var gulp = require('gulp'), // 必须先引入gulp插件
    del = require('del'),  // 文件删除
    cached = require('gulp-cached'), // 缓存当前任务中的文件，只让已修改的文件通过管道
    uglify = require('gulp-uglify'), // js 压缩
    rename = require('gulp-rename'), // 重命名
    concat = require('gulp-concat'), // 合并文件
    notify = require('gulp-notify'), // 相当于 console.log()
    filter = require('gulp-filter'), // 过滤筛选指定文件
//  jshint = require('gulp-jshint'), // js 语法校验
    sass = require('gulp-sass'), // sass 编译
    plumber = require('gulp-plumber'),//防止因插件错误引起的管道断裂 
    server = require('gulp-devserver'), //    
    cssnano = require('gulp-cssnano'), // CSS 压缩
    replace = require('gulp-replace'), // 批量替换字符串
    imagemin = require('gulp-imagemin'), // 图片优化
    autoprefixer = require('gulp-autoprefixer'); // 添加 CSS 浏览器前缀
 
// sass
gulp.task('sass', function() {
    gulp.src(['./src/sass/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
   //sass('src/sass/**/*.scss', {style: 'expanded'})  // 传入 sass 目录及子目录下的所有 .scss 文件生成文件流通过管道并设置输出格式
//  .pipe(cached('sass'))  // 缓存传入文件，只让已修改的文件通过管道（第一次执行是全部通过，因为还没有记录缓存）
    .pipe(autoprefixer('last 6 version')) // 添加 CSS 浏览器前缀，兼容最新的5个版本
//  .pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下（不影响此时管道里的文件流）
    .pipe(rename({suffix: '.min'})) // 对管道里的文件流添加 .min 的重命名
    .pipe(cssnano()) // 压缩 CSS
    .pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下，此时每个文件都有压缩（*.min.css）和未压缩(*.css)两个版本
});
 
// css （拷贝 *.min.css，常规 CSS 则输出压缩与未压缩两个版本）
gulp.task('css', function() {
return gulp.src('src/css/**/*.css')
    .pipe(cached('css'))
//  .pipe(gulp.dest('dist/css')) // 把管道里的所有文件输出到 dist/css 目录
    .pipe(filter(['**/*', '!**/*.min.css'])) // 筛选出管道中的非 *.min.css 文件
    .pipe(autoprefixer('last 6 version'))
//  .pipe(gulp.dest('dist/css')) // 把处理过的 css 输出到 dist/css 目录
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});
 
// script （拷贝 *.min.js，常规 js 则输出压缩与未压缩两个版本）
gulp.task('script', function() {
  return gulp.src(['src/js/**/*.js'])
    .pipe(cached('script'))
//  .pipe(gulp.dest('dist/js'))
    .pipe(filter(['**/*', '!**/*.min.js'])) // 筛选出管道中的非 *.min.js 文件
    // .pipe(jshint('.jshintrc')) // js的校验与合并，根据需要开启
    // .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});
 
// image
gulp.task('image', function() {
  return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
    .pipe(cached('image'))
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
    // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
    .pipe(gulp.dest('dist/img'))
});
  
// html 编译 html 文件并复制字体
gulp.task('html', function () {
  gulp.src('src/font/**/*')
    .pipe(gulp.dest('dist/font')) // 将预处理字体复制到 dist/font
     return gulp.src('src/*.html')
    .pipe(fileinclude()) // include html
    .pipe(rev()) // 生成并插入 MD5
    .pipe(gulp.dest('dist/'))
    .pipe(fontSpider()) // 在文档流中使用 font-spider 匹配文字
});
 
// clean 清空 dist 目录
gulp.task('clean', function() {
  return del('dist/**/*');
});
 
// default 默认任务，执行全部编译并启动监听
gulp.task('default', ['init'], function() {
  gulp.start('watch');
});

gulp.task('server', function() {
    gulp.src('../carousel')
    .pipe(plumber())
    .pipe(server());
})

gulp.task('watch', function() {
    gulp.watch('./src/bulid/*.html', ['sass'])
    gulp.watch('./src/sass/**/*.scss', ['sass'])
    gulp.watch('./src/css/**/*.css'),
    gulp.watch('./src/js/**/*.js', ['script']),
    gulp.watch('./src/images/**/*.{jpg,jpeg,png,gif}', ['image'])
    
})

gulp.task('dev', ['sass', 'css', 'script', 'watch', 'server'])
