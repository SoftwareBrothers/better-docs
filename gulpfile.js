const DOCS_COMMAND = process.env.DOCS_COMMAND || 'yarn docs'
const DOCS_OUTPUT = process.env.DOCS_OUTPUT || '../docs'

const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const run = require('gulp-run')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const path = require('path')
const browserSync = require('browser-sync').create()

gulp.task('sass', () => {
  gulp.src('styles/app.sass')
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('static/styles'))
})

gulp.task('js', () => {
  gulp.src(path.join('scripts/', '*.js'), { base: 'app' })
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('static/scripts'))
})

gulp.task('docs', function() {
  return run(`cd .. && ${DOCS_COMMAND}`).exec()
})

gulp.task('watch', () => {
  gulp.watch('styles/**/*.sass', ['sass', 'docs'])
  gulp.watch('scripts/**/*.js', ['js', 'docs'])
  gulp.watch('tmpl/**/*.tmpl', ['docs'])
  gulp.watch('publish.js', ['docs'])
  if (process.env.DOCS) {
    const array = [
      ...process.env.DOCS.split(','),
      ...process.env.DOCS.split(',').map(src => '!' + src.replace('**/*', 'node_modules/**/*'))
    ]
    console.log(array)
    gulp.watch(array, ['docs'])
  }
})

gulp.task('sync', () => {
  browserSync.init({
    server: {
      baseDir: DOCS_OUTPUT
    }
  })
  gulp.watch(`${DOCS_OUTPUT}/*`).on('change', browserSync.reload)
})

gulp.task('default', ['sass', 'js', 'docs', 'watch', 'sync'])
