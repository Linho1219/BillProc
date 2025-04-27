<template>
  <pre><code><div class="line"><span style="color:#E1E4E8">(()</span><span style="color:#F97583">=></span><span style="color:#E1E4E8">{</span><span style="color:#F97583">return</span><span style="color:#79B8FF"> JSON</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">stringify</span><span style="color:#E1E4E8">([</span><span style="color:#F97583">...</span><span style="color:#E1E4E8">document.</span><span style="color:#B392F0">querySelector</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"iframe"</span><span style="color:#E1E4E8">).contentDocument.</span><span style="color:#B392F0">querySelector</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">".datagrid-view2 .datagrid-btable"</span><span style="color:#E1E4E8">).rows,].</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">row</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">=></span><span style="color:#E1E4E8">[</span><span style="color:#F97583">...</span><span style="color:#E1E4E8">row.cells].</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">cell</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">=></span><span style="color:#E1E4E8">cell.innerText)))})();</span></div></code><s-tooltip class="copy">
          <s-icon-button slot="trigger" @click="copyGetCode">
            <svg viewBox="0 -960 960 960">
              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"></path>
            </svg>
          </s-icon-button>
          复制代码
        </s-tooltip></pre>
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
</script>

<style>
pre {
  background: var(--s-color-surface-container-low);
  color: #e1e4e8;
  font-size: 1rem;
  margin: 0;
  position: relative;
  word-break: break-all;
  border-radius: 5px;
  padding: 0;
}

pre code {
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
}

pre code .line{
  width: fit-content;
}

.copy {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 4px 0 0;
  background: inherit;
  border-radius: inherit;
}
</style>
