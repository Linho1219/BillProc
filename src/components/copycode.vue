<template>
  <div class="code-container">
    <code
      ><div class="line">
        <span style="color: #e1e4e8">(()</span
        ><span style="color: #f97583">=></span
        ><span style="color: #e1e4e8">{</span
        ><span style="color: #f97583">return</span
        ><span style="color: #79b8ff"> JSON</span
        ><span style="color: #e1e4e8">.</span
        ><span style="color: #b392f0">stringify</span
        ><span style="color: #e1e4e8">([</span
        ><span style="color: #f97583">...</span
        ><span style="color: #e1e4e8">document.</span
        ><span style="color: #b392f0">querySelector</span
        ><span style="color: #e1e4e8">(</span
        ><span style="color: #9ecbff">"iframe"</span
        ><span style="color: #e1e4e8">).contentDocument.</span
        ><span style="color: #b392f0">querySelector</span
        ><span style="color: #e1e4e8">(</span
        ><span style="color: #9ecbff">".datagrid-view2 .datagrid-btable"</span
        ><span style="color: #e1e4e8">).rows,].</span
        ><span style="color: #b392f0">map</span
        ><span style="color: #e1e4e8">((</span
        ><span style="color: #ffab70">row</span
        ><span style="color: #e1e4e8">)</span
        ><span style="color: #f97583">=></span
        ><span style="color: #e1e4e8">[</span
        ><span style="color: #f97583">...</span
        ><span style="color: #e1e4e8">row.cells].</span
        ><span style="color: #b392f0">map</span
        ><span style="color: #e1e4e8">((</span
        ><span style="color: #ffab70">cell</span
        ><span style="color: #e1e4e8">)</span
        ><span style="color: #f97583">=></span
        ><span style="color: #e1e4e8">cell.innerText)))})();</span>
      </div></code
    >
    <s-tooltip class="copy sidebutton">
      <s-icon-button slot="trigger" @click="copyGetCode">
        <svg viewBox="0 -960 960 960">
          <path
            d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
          ></path>
        </svg>
      </s-icon-button>
      复制代码
    </s-tooltip>
    <s-tooltip class="install sidebutton">
      <s-icon-button slot="trigger" @click="installUserScript">
        <svg viewBox="0 -960 960 960">
          <path
            d="M320-120v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h320v80H160v480h640v-120h80v120q0 33-23.5 56.5T800-200H640v80H320Zm360-280L480-600l56-56 104 103v-287h80v287l104-103 56 56-200 200Z"
          ></path>
        </svg>
      </s-icon-button>
      安装 UserScript
    </s-tooltip>
  </div>
</template>

<script setup lang="ts">
const getCode = `(()=>{return JSON.stringify([...document.querySelector("iframe").contentDocument.querySelector(".datagrid-view2 .datagrid-btable").rows,].map((row)=>[...row.cells].map((cell)=>cell.innerText)))})();`;
import { Snackbar } from "sober";

function copyGetCode() {
  try {
    navigator.clipboard.writeText(getCode);
    Snackbar.builder({
      text: "复制成功",
      type: "success",
    });
  } catch (e) {
    Snackbar.builder({
      text: "复制失败",
      type: "error",
    });
  }
}

function installUserScript() {
  window.open("/userscript.user.js", "_blank");
}
</script>

<style>
.code-container {
  background: var(--s-color-surface-container-low);
  color: #e1e4e8;
  font-size: 1rem;
  margin: 0;
  position: relative;
  word-break: break-all;
  border-radius: 5px;
  padding: 0;
}

.code-container code {
  display: block;
  background: none;
  font-size: inherit;
  padding: 12px 48px 12px 16px;
  overflow: auto;
  white-space: inherit;
  line-height: 1.6;
  user-select: text;
  font-family: JetBrains Mono, SF Mono, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  white-space: pre;
}

.code-container code .line {
  width: fit-content;
}

.sidebutton {
  position: absolute;
  top: 0;
  background: inherit;
  padding: 5px 4px 0;
}

.copy {
  right: 44px;
}

.install {
  position: absolute;
  right: 0;
}
</style>
