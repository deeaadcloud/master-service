const { src, dest, watch, parallel, series } = require("gulp");
const browserSync = require("browser-sync").create();
const scss = require("gulp-sass")(require("sass"));
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");

function scripts() {
  return src("app/JS/mainScript.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/JS"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/CSS/style.scss")
    .pipe(autoprefixer({ overrideBrowsersList: ["last 10 version"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/CSS"))
    .pipe(browserSync.stream());
}

function markup() {
  return src("app/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(concat("index.html"))
    .pipe(dest("app"));
}

function watching() {
  watch(["app/CSS/style.scss"], styles);
  watch(["app/JS/mainScript.js"], scripts);
  watch(["app/*.html"], markup);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function cleanDist() {
  return src("dist").pipe(clean());
}
function building() {
  return src(["app/CSS/style.min.css", "app/JS/main.min.js", "app/**/*.html"], {
    base: "app",
  })
  .pipe(dest("dist"));
}

exports.markup = markup;
exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(markup, styles, scripts, browsersync, watching);
