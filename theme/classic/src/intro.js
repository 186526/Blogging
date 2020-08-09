document.getElementById("avatar").src = config.theme_config.avatar;
document.getElementById("intro-text-title").innerHTML =
  config.theme_config.author + "'s Blog";
document.getElementById("intro-text-intro").innerHTML =
  "—— " + config.theme_config.introduction;

async function init_post_container() {
  let post_container = "";
  for (let x = 0; x < config.post.length; x++) {
    const post = {};
    post.url = settings.post + config.post[x].url + ".md";
    await fetch(post.url)
      .then((response) => response.text())
      .then((content) => {
        post.preview = {
          response: content,
        };
        post.preview.mdcontent = markdownrender(content);
        return markdownrender(content);
      })
      .then((content) => {
        document.getElementsByClassName("none")[0].innerHTML = content;
        imgs = document
          .getElementsByClassName("none")[0]
          .getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
          imgs[i].src = "";
        }
      })
      .then(function () {
        post.preview.title = document
          .getElementsByClassName("none")[0]
          .getElementsByTagName("h1")[0].innerText;
        post.preview.intro = config.post[x].introduction;
      })
      .then(function () {
        if (window.location.search == "?page=archive") {
          post.container =
            '<div class="post-container"><h1>' +
            post.preview.title +
            '</h1><div class="post-info">' +
            post.preview.mdcontent +
            '</div><p><a href="?p=' +
            config.post[x].url +
            '">Reading<i class="material-icons arrow_forward"></i></a></p></div>';
        } else {
          post.container =
            '<div class="post-container"><h1>' +
            post.preview.title +
            '</h1><p class="post-intro">' +
            post.preview.intro +
            '</p><p><a href="?p=' +
            config.post[x].url +
            '">Reading<i class="material-icons arrow_forward"></i></a></p></div>';
        }
        post_container = post_container + post.container;
      });
  }
  return post_container;
}

function loadcomments() {
  if (config.comment.enable) {
    for (x in comment.depend.js) {
      a = document.createElement("script");
      a.src = comment.depend.js[x];
      document.getElementById("jscomments").append(a);
    }
    a = document.createElement("script");
    a.src = settings.domain + "src/js/" + comment.load;
    a.defer = "defer";
    document.getElementById("jscomments").append(a);
  }
}

add_pic = function () {
  var imgs = document.getElementsByTagName("img");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].loading = "lazy";
  }
};
if (getpar("page")) {
  init_post_container().then((content) => {
    document.getElementById("post").innerHTML = content;
  });
} else {
  loadcomments();
}
document.getElementById("des").content = config.theme_config.introduction;
