<template>
  <s-table>
    <s-thead>
      <s-tr>
        <s-th center>
          <s-checkbox
            @click="handleCheckAll"
            :checked="allChecked"
            :indeterminate="partialChecked"
          ></s-checkbox>
        </s-th>
        <s-th center>#</s-th>
        <s-th center>时间</s-th>
        <s-th center>大类</s-th>
        <s-th center>小类</s-th>
        <s-th right>金额</s-th>
        <s-th center>商家</s-th>
        <s-th>备注</s-th>
      </s-tr>
    </s-thead>
    <s-tbody>
      <s-tr v-for="(item, index) in recs">
        <s-td center
          ><s-checkbox v-model="item.selected" type="checkbox"></s-checkbox
        ></s-td>
        <s-td center>{{ index + 1 }}</s-td>
        <s-td center>{{
          DateTime.fromJSDate(item.time).toFormat("yyyy-MM-dd HH:mm:ss")
        }}</s-td>
        <s-td center>{{ item.type }}</s-td>
        <s-td center>{{ item.subcategory }}</s-td>
        <s-td
          right
          :class="{
            income: item.type === INCOME,
            expense: item.type === EXPENSE,
          }"
          >{{ toDisplayAmount(item) }}</s-td
        >
        <s-td center>{{ "shop" in item ? item.shop ?? "" : "" }}</s-td>
        <s-td>{{ item.remark ?? "" }}</s-td>
      </s-tr>
    </s-tbody>
  </s-table>
</template>

<script lang="ts" setup>
import { Rec, RecWithSelect } from "@/types.ts";
import { INCOME, EXPENSE } from "@/types.ts";
import { DateTime } from "luxon";
import { computed } from "vue";
const recs = defineModel<RecWithSelect[]>();
function toDisplayAmount({ amount }: Rec): string {
  return (amount / 100).toFixed(2);
}

const allChecked = computed(() => recs.value?.every((item) => item.selected));
const partialChecked = computed(
  () => recs.value?.some((item) => item.selected) && !allChecked.value
);

function handleCheckAll() {
  if (allChecked.value) recs.value?.forEach((item) => (item.selected = false));
  else recs.value?.forEach((item) => (item.selected = true));
}
</script>

<style>
s-table {
  overflow: auto;
  height: 0;
  flex-grow: 1;
  max-width: 100%;
}

s-thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

s-td {
  padding: 0 1rem;
  vertical-align: middle;
}

s-th {
  padding: 0.2rem 1rem;
  vertical-align: middle;
}

s-td[minwidth] {
  width: min-content;
}

s-td[center],
s-th[center] {
  text-align: center;
}

s-td[right],
s-th[right] {
  text-align: right;
}

s-td.income {
  color: var(--s-color-success);
}
s-td.expense {
  color: var(--s-color-error);
}

s-tr {
  transition: background-color 0.1s;
}
s-tbody s-tr:hover {
  background-color: var(--s-color-surface-container-low);
}
</style>
