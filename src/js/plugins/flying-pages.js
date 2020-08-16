window.FPConfig = {
    delay: 0,    // 浏览器空闲多少秒后开始预加载
    ignoreKeywords: [],    // 不进行预加载的链接，例 ["#", "/about"]
    maxRPS: 10,    // 每秒最大加载数
    hoverDelay: 50    // 鼠标悬浮后预加的延迟，毫秒单位
};
async function preheat(url) {
    a = document.createElement("link");
    a.rel = "prefetch";
    a.href = url;
    document.head.append(a);
}
preheat(settings.themeUrl + "html/200.html");
preheat(settings.themeUrl + "html/404.html");
preheat(settings.themeUrl + "html/home.html");
preheat(settings.themeUrl + "html/archive.html");