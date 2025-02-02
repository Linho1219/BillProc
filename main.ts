// JSON.stringify([...$0.rows].map(row=>[...row.cells].map(cell=>cell.innerText)))
import fs from "fs";
import iconv from "iconv-lite";
import { INCOME, EXPENSE, tableHeader } from "./types.ts";
import { RawRec, Rec } from "./types.ts";
import config from "./config.ts";

const rawData = fs.readFileSync("data.json", "utf-8");

const data: RawRec[] = (<string[][]>JSON.parse(rawData)).map(
  ([time, place, pos, amount, type, balance]) => ({
    time: new Date(time),
    place,
    pos: Number(pos),
    amount: Number(amount) * 100,
    type,
    balance: Number(balance) * 100,
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
      data[i].time.getTime() - rec.time.getTime() < processor.maxTimeDiff
    )
      i++;
    result.push(processor.process(data.slice(index, i)));
    jumpto = i;
  }
}

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

fs.writeFileSync("result.csv", iconv.encode(resultStr, "gbk"));