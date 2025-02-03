import { INCOME, EXPENSE, TRANSFER, LOAN } from "./types.ts";
import {
  TransferSubcategory,
  LoanSubcategory,
  ReimbursementState,
  Currency,
} from "./types.ts";
import { ProcessMethod } from "./types.ts";

const account = "同济校园卡";

const processors: ProcessMethod[] = [
  {
    squeeze: false,
    match: ({ amount }) => amount > 0 && amount % 10000 === 0,
    process: (rec) => ({
      type: TRANSFER,
      time: rec.time,
      amount: rec.amount,
      from: "中行借记卡",
      to: account,
      subcategory: TransferSubcategory.normal,
    }),
  },
  {
    squeeze: false,
    match: ({ amount }) => amount > 0,
    process: (rec) => ({
      type: INCOME,
      time: rec.time,
      amount: rec.amount,
      account,
      subcategory: "福利补贴",
      remark: "补助",
    }),
  },
  {
    squeeze: false,
    match: ({ place }) => place === "四平路校区电控",
    process: (rec) => ({
      type: EXPENSE,
      time: rec.time,
      amount: -rec.amount,
      account,
      category: "生活",
      subcategory: "水电费",
    }),
  },
  {
    squeeze: true,
    match: ({ place }) => place.includes("浴室"),
    maxTimeDiff: 1000 * 60 * 60,
    process: (recs) => {
      const amount = -recs.reduce((acc, rec) => acc + rec.amount, 0);
      return {
        type: EXPENSE,
        time: recs.at(-1)!.time,
        amount,
        account,
        category: "生活",
        subcategory: "水电费",
      };
    },
  },
  {
    squeeze: false,
    match: ({ place }) => place === "四平路校区第一超市",
    process: (rec) => ({
      type: EXPENSE,
      time: rec.time,
      amount: -rec.amount,
      account,
      category: "零嘴",
      subcategory: "零食",
      shop: "教育超市",
    }),
  },
  {
    squeeze: false,
    match: ({ place, amount }) =>
      place === "四平路校区西苑饮食广场西点4" && amount === -330,
    process: (rec) => ({
      type: EXPENSE,
      time: rec.time,
      amount: 330,
      account,
      category: "零嘴",
      subcategory: "饮品",
      shop: "面包房",
      remark: "雪碧",
    }),
  },
  {
    squeeze: false,
    match: ({ place }) =>
      place.includes("饮食广场") || place.includes("余庆堂"),
    process: (rec) => {
      const subcategory = ((hr) => {
        if (hr < 10) return "早餐";
        if (hr < 16) return "午餐";
        return "晚餐";
      })(rec.time.getHours());
      const shop = ((place) => {
        if (place.includes("西点4")) return "面包房";
        if (place.includes("西苑")) return "西苑食堂";
        if (place.includes("南苑")) return "南苑食堂";
        if (place.includes("北苑")) return "北苑食堂";
        if (place.includes("学苑")) return "学苑食堂";
        if (place.includes("余庆堂")) return "余香食集";
      })(rec.place);
      return {
        type: EXPENSE,
        time: rec.time,
        amount: Math.abs(rec.amount),
        account,
        category: "正餐",
        subcategory,
        shop,
      };
    },
  },
];

export default processors;
