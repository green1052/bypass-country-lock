// ==UserScript==
// @name Bypass Country Lock
// @version 1.0.0
// @author green1052
// @description 아카라이브의 "이 콘텐츠는 해당 국가에서 이용할 수 없습니다."를 우회 합니다.
// @supportURL https://github.com/green1052/bypass-country-lock/issues
// @match http*://arca.live/*
// @namespace bypass-country-lock
// @rut-at document-start
// @noframes
// @grant GM_xmlhttpRequest
// @homepageURL https://github.com/green1052/bypass-country-lock
// @downloadURL https://github.com/green1052/bypass-country-lock/raw/master/bypass-country-lock.user.js
// @updateURL https://github.com/green1052/bypass-country-lock/raw/master/bypass-country-lock.user.js
// @license GPLv3
// ==/UserScript==

(() => {
    const overlay = ".arca-overlay-notice";

    if (!document.querySelector(overlay)?.innerHTML.includes("이 콘텐츠는 해당 국가에서 이용할 수 없습니다")) return;

    // 게시글 보기
    if (/\/b\/.*\/.*/gi.test(location.pathname)) {
        const [, slug, index] = /\/b\/(.*)\/(.*)/gi.exec(location.pathname);

        if (!slug || !index) return;

        GM_xmlhttpRequest({
            url: `https://arca.live/api/app/view/article/${slug}/${index}`,
            headers: {
                "user-agent": "live.arca.android/0.8.326",
                "accept-encoding": "gzip"
            },
            responseType: "json",
            timeout: 10000,
            onload: (response) => {
                const content = JSON.parse(response.responseText)?.content;

                if (!content) return;

                const overlayElement = document.querySelector(overlay);

                overlayElement.classList.remove(...overlayElement.classList);
                overlayElement.classList.add("fr-view");
                overlayElement.classList.add("article-content");

                overlayElement.innerHTML = content;
            }
        });
    }
})();