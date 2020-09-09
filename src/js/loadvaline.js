blogging_info("Loading Valine...");
var GUEST = ["nick", "mail", "link"],
  guest = "nick,mail,link";
(guest = guest.split(",").filter(function (e) {
  return GUEST.indexOf(e) > -1;
})),
  (load_comments = function () {
    new Valine({
      el: "#comments",
      verify: comment.config.verify,
      notify: comment.config.notify,
      appId: comment.config.appId,
      appKey: comment.config.appKey,
      placeholder: comment.config.placeholder,
      avatar: "identicon",
      meta: guest,
      pageSize: "10",
      lang: comment.config.language || "en",
      path: window.location.search,
    });
    blogging_info("Valine load finish");
  }),
  whenAvailable("Valine",()=>{load_comments();});
