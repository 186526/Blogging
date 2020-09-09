let js = document.createElement("link");
whenAvailable("marked", () => {
    blogging_info("Marked Load finish");
    return 114514;
});
function markdownrender(e) {
  return marked(e);
}
(js.rel = "subresource"),
  (js.href = "https://cdn.jsdelivr.net/npm/marked@1.1.1/marked.min.js"),
  document.head.append(js);
