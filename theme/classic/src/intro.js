document.getElementById("avatar").src = config.theme_config.avatar;
document.getElementById("intro-text-title").innerHTML =
  config.theme_config.author + "'s Blog";
document.getElementById("intro-text-intro").innerHTML =
  "—— " + config.theme_config.introduction;

async function get_posts_content(post_url, x) {
  let post_container = "",
    post = {};
  await fetch(post_url.url)
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
      for (let i = 0; i < imgs.length; i++) {
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
      if (window.location.search === "?page=archive") {
        post.container =
          '<div class="post-container"><a href="?p=' +
          config.post[x].url +
          '"><h1>' +
          post.preview.title +
          '</h1></a><div class="post-time margin-bottom"><i class="material-icons date_range"></i>' +
          loadtime(config.post[x].url).posttime +
          '</div></div>';
      } else {
        post.container =
          '<div class="post-container"><h1>' +
          post.preview.title +
          '</h1><p class="post-intro">' +
          post.preview.intro +
          '</p><div class="post-time"><i class="material-icons date_range"></i>' +
          loadtime(config.post[x].url).posttime +
          '</div><div class="post-tags">' + createtags(config.post[x].url).innerHTML + '</div><p><a href="?p=' +
          config.post[x].url +
          '">Reading<i class="material-icons arrow_forward"></i></a></p></div>';
      }
      return post.container;
    })
    .then((content) => {
      document.getElementById("post").innerHTML += content;
    })
    .then(function () {
      document.getElementsByClassName("none")[0].innerHTML = "";
    });
  return post_container;
}

async function init_post_container() {
  var post_container = "";
  for (let x = 0; x < config.post.length; x++) {
    const post = {};
    post.url = settings.post + config.post[x].url + ".md";
    post_container = post_container + get_posts_content(post, x);
  }
  return post_container;
}

var search = async () => {
  var post_container = "";
  document.getElementById("tag").append(createtag([decodeURI(getpar("tag"))]));
  if (!getpar("tag")) {
    window.location.href = settings.domain;
  }
  try {
    checktags([decodeURI(getpar("tag"))]);
  } catch {
    document.querySelector("#tags").innerHTML = "<h1>Tags Not Found</h1>";
  }
  if (checktags([decodeURI(getpar("tag"))]) == false) {
    document.querySelector("#tags").innerHTML = "<h1>Tags Not Found</h1>";
  }
  let a = checktags([decodeURI(getpar("tag"))]);
  for (let x = 0; x < config.post.length; x++) {
    for (let y in a) {
      if (config.post[x].url === a[y]) {
        const post = {};
        post.url = settings.post + config.post[x].url + ".md";
        post_container = post_container + get_posts_content(post, x);
        break;
      }
    }
  }
  return post_container;
};

async function init_plugins() {
  blogging_info("Load Plugin who loadtime = themerender");
  for (let i in config.plugins) {
    if (config.plugins[i].loadtime === "themerender") {
      blogging_info(
        "Load " +
        config.plugins[i].name +
        " with defer enabled " +
        config.plugins[i].defer
      );
      for (let b in config.plugins[i].depend) {
        let a = document.createElement("script");
        a.src = config.plugins[i].depend[b];
        await document.head.appendChild(a);
      }
      let a = document.createElement("script");
      a.src = config.plugins[i].script;
      if (config.plugins[i].deferS) {
        a.defer = true;
      }
      document.head.append(a);
    }
  }
  setTimeout(() => {
    blogging_info("plugins load finish");
  }, 1);
}

function loadcomments() {
  if (config.comment.enable) {
    blogging_info("Start load comment");
    for (let x in comment.depend.js) {
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

var loadtime = (posturl) => {
  for (let x in config.post) {
    if (posturl === config.post[x].url) {
      return {
        postunixtimestamp: Math.round(config.post[x].time / 1000),
        posttime: new Date(Math.round(config.post[x].time)).toLocaleString(),
        nowtime: new Date().toLocaleString(),
      };
    }
  }
};

var gettime = (e) => {
  let a = document.createElement("div");
  let icon = document.createElement("i");
  icon.classList = "material-icons date_range";
  a.append(icon);
  a.classList = "posttime";
  a.innerHTML += loadtime(e).posttime;
  return a;
};

function config_page() {
  var imgs = document.getElementsByTagName("img");
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].loading = "lazy";
  }
  let a = document.createElement("link");
  a.rel = "shortcut icon";
  a.href = config.theme_config.avatar;
  document.head.append(a);
}

async function init_post() {
  document.getElementById("func").append(gettime(getpar("p")));
  document.getElementById("func").append(createtags(getpar("p")));
}

var createtags = (url) => {
  let tags = gettags(url);
  return createtag(tags);
};

var createtag = (tags) => {
  let tags_tags = [];
  let a = document.createElement("div");
  a.classList = "tags-container";
  for (let i in tags) {
    tags_tags[i] = document.createElement("a");
    tags_tags[i].classList = "tags-tags";
    tags_tags[i].innerHTML = "<i class='material-icons i-1'>label</i>" + tags[i];
    tags_tags[i].href = "?page=tags&tag=" + tags[i];
    a.append(tags_tags[i]);
  }
  return a;
};

var checktags = (tags) => {
  let x = [];
  for (let y in tags) {
    for (let i in config.post) {
      if (gettags(config.post[i].url).toString().match(tags[y]) === null) {
        continue;
      } else {
        for (let z in gettags(config.post[i].url)) {
          if (gettags(config.post[i].url)[z] === tags[y]) {
            x.push(config.post[i].url);
          }
        }
      }
    }
  }
  return x;
};

var gettags = (url) => {
  for (let i in config.post) {
    if (url === config.post[i].url) {
      return config.post[i].tags;
    }
  }
};

if (getpar("page") != "tags" && getpar("page")) {
  init_plugins();
  config_page();
  init_post_container();
} else if (getpar("p")) {
  let finished = true;
  if (
    finished &&
    document.getElementById("comments").getBoundingClientRect().top <= 1300
  ) {
    loadcomments();
    finished = false;
    document.onscroll = function () { };
  }
  document.onscroll = function () {
    if (
      finished &&
      document.getElementById("comments").getBoundingClientRect().top <= 1300
    ) {
      loadcomments();
      finished = false;
      document.onscroll = function () { };
    }
  };
  init_plugins();
  config_page();
  init_post();
} else if (getpar("page") === "tags") {
  init_plugins();
  config_page();
  search();
}
document.getElementById("des").content = config.theme_config.introduction;
