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
    // 充值
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
    // 学校补助
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
    // 宿舍电费
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
    // 嘉定班车
    match: ({ place }) => place.includes("班车"),
    process: (rec) => ({
      type: EXPENSE,
      time: rec.time,
      amount: -rec.amount,
      account,
      category: "交通",
      subcategory: "公共交通",
      shop: "班车",
    }),
  },
  {
    // 澡堂
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
        shop: "西南八浴室",
      };
    },
  },
  {
    // 教育超市买零食
    // 全部判定为零食，因为生活用品都是上网买的
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
    // 面包房买饮料
    match: ({ place, amount }) => place.includes("西点") && amount >= -380,
    process: (rec) => ({
      type: EXPENSE,
      time: rec.time,
      amount: -rec.amount,
      account,
      category: "零嘴",
      subcategory: "饮品",
      shop: "面包房",
      remark: "雪碧",
    }),
  },
  {
    // 西苑食堂特判
    // 因为不仅有正餐，还有奶茶，水果捞和烧烤
    match: ({ place, pos }) => place === "四平路校区西苑广场小炒部",
    process: (rec) => {
      let remark: string | undefined;
      const categories = ((pos, hr) => {
        if (pos === 44)
          return {
            category: "零嘴",
            subcategory: "饮品",
          };
        if (pos === 40)
          return {
            category: "正餐",
            subcategory: "水果",
          };
        if (pos === 54) {
          remark = "烧烤";
          return {
            category: "正餐",
            subcategory: "夜宵",
          };
        }
        return {
          category: "正餐",
          subcategory: hr < 10 ? "早餐" : hr < 16 ? "午餐" : "晚餐",
        };
      })(rec.pos, rec.time.getHours());
      return {
        type: EXPENSE,
        time: rec.time,
        amount: -rec.amount,
        account,
        ...categories,
        shop: "西苑食堂",
        remark,
      };
    },
  },

  {
    match: ({ place }) =>
      place.includes("广场") ||
      place.includes("余庆堂") ||
      place.includes("西点"),
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
