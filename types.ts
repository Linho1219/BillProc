export const INCOME = "收入",
  EXPENSE = "支出",
  TRANSFER = "转账",
  LOAN = "借贷";

export enum Currency {
  CNY = "人民币",
  USD = "美元",
  EUR = "欧元",
  HKD = "港币",
  JPY = "日元",
  GBP = "英镑",
  AUD = "澳大利亚元",
  CAD = "加拿大元",
  THB = "泰国铢",
  SGD = "新加坡元",
  CHF = "瑞士法郎",
  DKK = "丹麦克朗",
  MOP = "澳门元",
  MYR = "林吉特",
  NOK = "挪威克朗",
  NZD = "新西兰元",
  PHP = "菲律宾比索",
  RUB = "卢布",
  SEK = "瑞典克朗",
  TWD = "新台币",
  BRL = "巴西雷亚尔",
  KER = "韩元",
  ZAR = "南非兰特",
  ARS = "阿根廷比索",
  TRY = "新土耳其里拉",
  PLN = "波兰兹罗提",
  UAH = "乌克兰格里夫纳",
  MXN = "墨西哥元",
  INR = "印度卢比",
  MMK = "缅元",
  UGX = "乌干达先令",
  VND = "越南盾",
  PKR = "巴基斯坦卢比",
  SAR = "沙特里亚尔",
  LAK = "老挝基普",
  TZS = "坦桑尼亚先令",
  BYN = "白俄罗斯卢布",
  AED = "阿联酋迪拉姆",
  PGK = "巴布亚新几内亚基那",
  MTN = "莫桑比克美提卡",
  KHR = "柬埔寨瑞尔",
  COP = "哥伦比亚比索",
  NGN = "尼日利亚奈拉",
  KGS = "吉尔吉斯斯坦索姆",
  IDR = "印尼卢比",
  XOF = "西非法郎",
  KES = "肯尼亚先令",
  NPR = "尼泊尔卢比",
  EGP = "埃及镑",
  RON = "罗马尼亚列伊",
}

export enum TransferSubcategory {
  normal = "账户互转",
  credit = "信用还款",
  buyfinance = "理财买入",
  sellfinance = "理财赎回",
}

export enum LoanSubcategory {
  borrow = "借入",
  lend = "借出",
  payback = "还款",
  receive = "收款",
}

export enum ReimbursementState {
  not = "非报销",
  pending = "待报销",
  done = "已报销",
}

export interface RawRec {
  time: Date;
  place: string;
  pos: number;
  amount: number;
  type: string;
  balance: number;
}

interface RecBase {
  type: string;
  /** 日期时间 */
  time: Date;
  /** 金额，正整数，x100 */
  amount: number;
  /** 备注 */
  remark?: string;
  /** 图片 URL，最多添加 4 个图片地址 */
  image?: (`http://${string}` | `https://${string}`)[];
  /** 标签 */
  label?: string[];
  /** 币种。默认为人民币。如需填写，请填入币种的**中文名称** */
  currency?: Currency;
  /** 商家 */
  shop?: string;
}

interface RecExpense extends RecBase {
  type: typeof EXPENSE;
  /** 支出大类，如不存在会自动创建 */
  category: string;
  /** 支出小类，如不存在会自动创建 */
  subcategory: string;
  /** 账户 */
  account: string;
  /** 是否报销。默认为非报销 */
  reimbursement?: ReimbursementState;
}

interface RecIncome extends RecBase {
  type: typeof INCOME;
  /** 收入类别，如不存在会自动创建 */
  subcategory: string;
  /** 账户 */
  account: string;
  /** 是否报销。默认为非报销 */
  reimbursement?: "已报销";
}

interface RecTransfer extends RecBase {
  type: typeof TRANSFER;
  /** 转出账户（账户 1） */
  from: string;
  /** 转入账户（账户 2） */
  to: string;
  /** 类别，仅允许填写应用内已有的小类名称 */
  subcategory: TransferSubcategory;
}

interface RecLoan extends RecBase {
  type: typeof LOAN;
  /** 转出账户（账户 1） */
  from: string;
  /** 转入账户（账户 2） */
  to: string;
  /** 类别，仅允许填写应用内已有的小类名称 */
  subcategory: LoanSubcategory;
}

export type Rec = RecIncome | RecExpense | RecTransfer | RecLoan;

interface ProcessMethodBase {
  match: (rec: RawRec) => boolean;
}

interface ProcessMethodNormal extends ProcessMethodBase {
  squeeze: false;
  process: (rec: RawRec) => Rec;
}

interface ProcessMethodSqueeze extends ProcessMethodBase {
  squeeze: true;
  maxTimeDiff: number;
  process: (recs: RawRec[]) => Rec;
}

export type ProcessMethod = ProcessMethodNormal | ProcessMethodSqueeze;