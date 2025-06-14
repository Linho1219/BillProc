<template>
  <s-page theme="auto">
    <main>
      <CopyCode />
      <s-text-field
        v-model.lazy="rawJSON"
        label="输入 JSON"
        class="monospace-field"
      ></s-text-field>
      <s-divider></s-divider>
      <div class="filter">
        <s-icon name="menu">
          <svg viewBox="0 -960 960 960">
            <path
              d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"
            ></path>
          </svg>
        </s-icon>
        <s-date-picker
          label="起始日期"
          v-model.lazy="startDate"
        ></s-date-picker>
        <s-date-picker label="终止日期" v-model.lazy="endDate"></s-date-picker>
        <s-button type="elevated" @click="updateSelect">应用筛选</s-button>
        <s-button type="text" @click="startDate = endDate = ''" slot="trigger"
          >清除日期</s-button
        >
      </div>
      <DisplayData v-model="processedObjWithSelect" />
      <DownloadBtn :data="processedObjWithSelect" />
    </main>
  </s-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DisplayData from "@/components/display.vue";
import CopyCode from "@/components/copycode.vue";
import DownloadBtn from "./components/downloadbtn.vue";

const rawJSON = ref("");
import { RawRec, Rec, RecWithSelect } from "@/types.ts";
import config from "@/config.ts";
import { watch } from "vue";

const processedObj = computed(() => {
  if (rawJSON.value.trim() === "") return [];
  const parsedJSON = (() => {
    try {
      return JSON.parse(rawJSON.value) as string[][];
    } catch (e) {
      console.error("JSON parse error", e);
      return [];
    }
  })();
  const data: RawRec[] = parsedJSON.map(
    ([_, time, place, pos, amount, type, balance]) => ({
      time: new Date(time),
      place,
      pos: Number(pos),
      amount: Math.round(Number(amount) * 100),
      type,
      balance: Math.round(Number(balance) * 100),
    })
  );
  const result: Rec[] = [];
  let jumpto = -1;
  for (const [index, rec] of data.entries()) {
    if (index < jumpto) continue;
    const processor = config.find(({ match }) => match(rec));
    if (!processor) {
      console.error(
        `No processor found for record ${index}: ${JSON.stringify(rec)}`
      );
      continue;
    }
    if (!processor.squeeze) {
      result.push(processor.process(rec));
    } else {
      let i = index + 1;
      while (
        i < data.length &&
        processor.match(data[i]) &&
        Math.abs(data[i].time.getTime() - rec.time.getTime()) <
          processor.maxTimeDiff
      )
        i++;
      result.push(processor.process(data.slice(index, i)));
      jumpto = i;
    }
  }
  return result;
});

const startDate = ref("");
const endDate = ref("");

const addSelect = (arr: Rec[]): RecWithSelect[] => {
  const start =
    startDate.value !== "" ? new Date(startDate.value).getTime() : -1;
  const end =
    endDate.value !== "" ? new Date(endDate.value).getTime() : Infinity;
  const checkInRange = (date: Date) =>
    date.getTime() >= start && date.getTime() <= end;
  return arr.map((item) => ({ ...item, selected: checkInRange(item.time) }));
};
const processedObjWithSelect = ref(addSelect(processedObj.value));

watch(processedObj, () => updateSelect());

const updateSelect = () =>
  (processedObjWithSelect.value = addSelect(processedObj.value));
</script>

<style>
s-page {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  width: 100%;
  max-width: 800px;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

s-divider {
  margin: 0.5rem 0;
}

.monospace-field {
  width: auto;
}

.monospace-field::part(input) {
  font-family: JetBrains Mono, SF Mono, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 1rem;
}

.filter {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 40px;
  position: relative;
}
.filter > s-icon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
