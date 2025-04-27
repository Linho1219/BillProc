// JSON.stringify([...$0.rows].map(row=>[...row.cells].map(cell=>cell.innerText)))

import fs from "fs";
import iconv from "iconv-lite";
import { DateTime } from "luxon";
import { INCOME, EXPENSE, tableHeader } from "./src/types.ts";
import { RawRec, Rec } from "./src/types.ts";
import config from "./src/config.ts";

const rawData = fs.readFileSync("data.json", "utf-8");

const data: RawRec[] = (<string[][]>JSON.parse(rawData)).map(
  ([time, place, pos, amount, type, balance]) => ({
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

const total = result.reduce((acc, r) => {
  if (r.type === INCOME) return acc + r.amount;
  if (r.type === EXPENSE) return acc - r.amount;
  return acc;
}, 0);

const resultStr =
  tableHeader +
  result
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

const fileName = "result-" + DateTime.now().toFormat("MMdd-HHmmss") + ".csv";

fs.writeFileSync(fileName, iconv.encode(resultStr, "gbk"));

const fmtNum = (n: number) => (n > 0 ? `+ ${n / 100}` : `- ${-n / 100}`);

console.log(`From:  ${fmtNum(data.at(-1)!.balance - data.at(-1)!.amount)}`);
console.log(`To:    ${fmtNum(data[0].balance)}`);
console.log(`Total: ${fmtNum(total)}`);
console.log(`Result: ./${fileName}`);