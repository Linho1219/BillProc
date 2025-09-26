// ==UserScript==
// @name         校园卡处理
// @namespace    http://tampermonkey.net/
// @version      2025-09-26
// @description  try to take over the world!
// @author       Linho
// @match        https://yikatong.tongji.edu.cn/user/*
// @match        https://yikatong.tongji.edu.cn/User/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js
// @grant        none
// ==/UserScript==

(() => {
  "use strict";
  const parserURL = "https://bill.linho.cc/#";
  window.onload = () => {
    const sidebar = document.querySelector("#sideleft");

    const gotoBillBtn = document.createElement("a");
    gotoBillBtn.href = "javascript:void(0);";
    gotoBillBtn.textContent = "打开账单";
    gotoBillBtn.classList.add("indexlogin");
    gotoBillBtn.onclick = () =>
      goPage(
        15,
        0,
        null,
        "我的校园卡",
        "流水信息",
        "",
        "",
        "我的校园卡",
        "流水信息",
        "0",
        "0"
      );

    const captureBtn = document.createElement("a");
    captureBtn.href = "javascript:void(0);";
    captureBtn.textContent = "获取 JSON";
    captureBtn.classList.add("indexlogin");
    captureBtn.onclick = () => {
      const iframe = document.querySelector("iframe#forcomepage");
      const contentDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      const json = JSON.stringify(
        [
          ...contentDocument.querySelector(".datagrid-view2 .datagrid-btable")
            .rows,
        ].map((row) => [...row.cells].map((cell) => cell.innerText))
      );
      try {
        navigator.clipboard.writeText(json);
      } catch {}
      window.open(
        parserURL + encodeURIComponent(Base64.encode(json)),
        "_blank"
      );
    };

    sidebar.appendChild(gotoBillBtn);
    sidebar.appendChild(captureBtn);
  };
})();
