// JSON.stringify([...$0.rows].map(row=>[...row.cells].map(cell=>cell.innerText)))
import fs from "fs";
import { RawRec } from "./types.ts";

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
