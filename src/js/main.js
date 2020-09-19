/*
 * Bloging 0.114514
 * Open Sources With MIT License
 * Author: 186526
 * Build with Love & bug
 */
function blogging_info(t){console.log("%c Blogging %c "+t+" %c", "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px; color:#fff", "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0; color: #fff" ,"background: transparent");}
function whenAvailable(name, callback) {
  var interval = 100; // ms
  window.setTimeout(function () {
    if (window[name]) {
      callback(window[name]);
    } else {
      window.setTimeout(arguments.callee, interval);
    }
  }, interval);
}
function getpar(r) {
  for (
    var n = window.location.search.substring(1).split("&"), t = 0;
    t < n.length;
    t++
  ) {
    var i = n[t].split("=");
    if (i[0] == r && null == i[1]) return !0;
    if (i[0] == r) return i[1];
  }
  return !1;
}
if (!getpar("p")) {
  if (!getpar("url")) {
    if (!getpar("page")) {
      window.location.search = "?page=home"; //check if user didn't give a param
    } else {
      var settings = { par: "page" };
    }
  } else {
    var settings = { par: "url" };
  }
} else {
  var settings = { par: "p" };
}
let t = "/";
var comment;
for (let i of window.location.pathname.split("/").slice(1, -1)) {
  t = t + i + "/";
}
settings.domain = window.location.protocol + "//" + window.location.host + t;
var config, mdcontent;
blogging_info("init Blogging ...");
fetch("config.json")
  .then((res) => {
    if (res.status >= 200 && res.status < 300) {
      blogging_info("Load config");
      return res;
    } else {
      document.all[0].innerHTML =
        "<h1>Error fetch config.json<br>Status Code=" + res.status + "</h1>";
      console.log(res.status);
    }
  })
  .then((res) => res.json())
  .then((resconfig)=>{
    config = resconfig;
    settings.themeUrl =
      settings.domain + config.file.theme + config.theme + "/";
    settings.post = settings.domain + config.file.post;
    for (i in config.comment.config) {
      comment = config.comment.config[i];
    }
  })
  .then((e) => {
    a = document.createElement("link");
    a.rel = "prefetch";
    if (settings.par === "page") {
      a.href = settings.themeUrl + "html/" + getpar(settings.par) + ".html";
    } else if (settings.par === "url" || settings.par === "p") {
      a.href = settings.themeUrl + "html/200.html";
    }
    document.head.append(a);
  })
  .then(()=>{
    blogging_info("Load Plugin who loadtime = init");
    for (let i in config.plugins) {
      if (config.plugins[i].loadtime == "init") {
        blogging_info(
          "Load " +
            config.plugins[i].name +
            " with defer enabled " +
            config.plugins[i].defer
        );
        for (let b in config.plugins[i].depend) {
          let a = document.createElement("script");
          a.src = config.plugins[i].depend[b];
          document.head.append(a);
        }
        let a = document.createElement("script");
        a.src = config.plugins[i].script;
        if (config.plugins[i].defer) {
          a.defer = true;
        }
        document.head.append(a);
      }
    }
  }).then(()=>{
    whenAvailable("markdownrender", () => {
      blogging_info("Markdown Render Load finish");
      return 114514;
    });
  })
  .then(function () {
    if (settings.par === "url") {
      blogging_info("Load post");
      settings.content = { url: decodeURIComponent(getpar(settings.par)) };
      fetch(settings.content.url)
        .then((res) => {
          settings.content.status = res.status;
          settings.date = new Date();
          if (res.status >= 200 && res.status < 300) {
            return res;
          } else {
            fetch(settings.themeUrl + "html/" + "404.html")
              .then((response) => response.text())
              .then(function (text) {
                settings.content.success = false;
                settings.content.preview = {
                  response: null,
                  mdcontent: null,
                };
                document.write(text);
              });
          }
        })
        .then((res) => res.text())
        .then((content) => {
          settings.content.preview = {
            response: content,
          };
          settings.content.preview.mdcontent = marked(content);
          return markdownrender(content);
        })
        .then((mdcontent) => {
          fetch(settings.themeUrl + "html/" + "200.html")
            .then((response) => response.text())
            .then(function (text) {
              settings.content.success = true;
              document.write(text);
            });
        })
        .catch(t=>{
          settings.content.preview.mdcontent = t.message;
          document.write(t.message);
          return t.message;
        });
    } else if (settings.par === "p") {
      blogging_info("Load post");
      settings.content = {
        url: decodeURIComponent(settings.post + getpar(settings.par) + ".md"),
      };
      fetch(settings.content.url)
        .then((res) => {
          settings.content.status = res.status;
          settings.date = new Date();
          if (res.status >= 200 && res.status < 300) {
            return res;
          } else {
            fetch(settings.themeUrl + "html/" + "404.html")
              .then((response) => response.text())
              .then(function (text) {
                settings.content.success = false;
                settings.content.preview = {
                  response: null,
                  mdcontent: null,
                };
                document.write(text);
              });
          }
        })
        .then((res) => res.text())
        .then((content) => {
          settings.content.preview = {
            response: content,
          };
          settings.content.preview.mdcontent = marked(content);
          return markdownrender(content);
        })
        .then((mdcontent) => {
          fetch(settings.themeUrl + "html/" + "200.html")
            .then((response) => response.text())
            .then(function (text) {
              settings.content.success = true;
              document.write(text);
            });
        })
        .catch(function (t) {
          settings.content.preview.mdcontent = t.message;
          document.write(t.message);
          return t.message;
        });
    } else if (settings.par === "page") {
      blogging_info("geting page");
      settings.content = {
        url: settings.themeUrl + "html/" + getpar(settings.par) + ".html",
      };
      fetch(settings.content.url)
        .then((res) => {
          settings.content.status = res.status;
          settings.date = new Date();
          if (res.status >= 200 && res.status < 300) {
            return res;
          } else {
            fetch(settings.themeUrl + "html/" + "404.html")
              .then((response) => response.text())
              .then(function (text) {
                settings.content.success = false;
                settings.content.preview = {
                  response: null,
                  mdcontent: null,
                };
                document.write(text);
              });
          }
        })
        .then((content) => content.text())
        .then((content) => {
          settings.content.success = true;
          settings.content.preview = {
            response: content,
          };
          document.write(content);
        });
    }
  })
  .then(()=>{
    blogging_info("rendering content");
  });
