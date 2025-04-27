<template>
  <s-fab @click="downloadFile">
    <s-icon name="arrow_downward" slot="start"></s-icon>
    下载
  </s-fab>
</template>

<script setup lang="ts">
import { RecWithSelect } from "@/types";
import { tableHeader, INCOME, EXPENSE } from "@/types";
import iconv from "iconv-lite";
import { DateTime } from "luxon";

const props = defineProps<{
  data: RecWithSelect[];
}>();

function downloadFile() {
  const resultStr =
    tableHeader +
    props.data
      .filter((r) => r.selected)
      .map((r): string[] => {
        if (r.type === INCOME || r.type === EXPENSE)
          return [
            r.type,
            r.time.toLocaleString(),
            r.type === EXPENSE ? r.category : "",
            r.subcategory,
            String(r.amount / 100),
            r.account,
            "",
            r.reimbursement ?? "",
            r.remark ?? "",
            r.image ? r.image.join(" ") : "",
            r.character ?? "",
            r.label ? r.label.join(" ") : "",
            r.currency ?? "",
            r.shop ?? "",
          ];
        return [
          r.type,
          r.time.toLocaleString(),
          "",
          r.subcategory,
          String(r.amount / 100),
          r.from,
          r.to,
          "",
          r.remark ?? "",
          r.image ? r.image.join(" ") : "",
          "",
          r.label ? r.label.join(" ") : "",
          r.currency ?? "",
          "",
        ];
      })
      .map((r) => r.join(","))
      .join("\n");
  const blob = new Blob([iconv.encode(resultStr, "gbk")], {
    type: "text/csv;charset=gbk",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `校园卡流水-${DateTime.now().toFormat("MMdd-HHmmss")}.csv`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
