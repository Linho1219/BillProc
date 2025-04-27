export const INCOME = "收入",
  EXPENSE = "支出",
  TRANSFER = "转账",
  LOAN = "借贷";

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
  /** 角色 */
  character?: string;
  /** 商家 */
  shop?: string;
}

interface RecIncome extends RecBase {
  type: typeof INCOME;
  /** 收入类别，如不存在会自动创建 */
  subcategory: string;
  /** 账户 */
  account: string;
  /** 是否报销。默认为非报销 */
  reimbursement?: "已报销";
  /** 角色 */
  character?: string;
  /** 商家 */
  shop?: string;
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

export type RecWithSelect = Rec & { selected: boolean };

interface ProcessMethodBase {
  match: (rec: RawRec) => boolean;
}

interface ProcessMethodNormal extends ProcessMethodBase {
  squeeze?: false;
  process: (rec: RawRec) => Rec;
}

interface ProcessMethodSqueeze extends ProcessMethodBase {
  squeeze: true;
  maxTimeDiff: number;
  process: (recs: RawRec[]) => Rec;
}

export type ProcessMethod = ProcessMethodNormal | ProcessMethodSqueeze;

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

export const tableHeader = `请在电脑上使用Excel进行操作，将其他应用的数据按要求拷贝至此模板中（不要另外新建文件）。整个编辑过程需要耐心和细心，如果数据量过多，建议分批导入。,,,,,,,,,,,,,
,,,,,,,,,,,,,
【注意】要求必填的字段，不能为空！选填的字段，可以用“/”代替，也可以不填。下方表格中的示例数据可以删除，表格的标题请保留。,,,,,,,,,,,,,
,,,,,,,,,,,,,
必填字段：,,,,,,,,,,,,,
【类型】必填。只允许填入「支出」、「收入」、「转账」或「借贷」,,,,,,,,,,,,,
【日期】必填。可以只填日期，不填时间。数据格式为「2021-10-01 06:10:01」或「2021/10/01 06:10:01」,,,,,,,,,,,,,
【大类】仅支出需要填写大类，收入、转账、借贷无需填写，请参考示例数据,,,,,,,,,,,,,
【小类】必填。支出、收入如果填写了应用内不存在的小类，应用会自动创建；转账、借贷仅允许填写应用内已有的小类名称，如转账的账户互转、信用还款，借贷的借入、收款等,,,,,,,,,,,,,
【金额】必填。,,,,,,,,,,,,,
【账户】必填。支出、收入只需填写「账户」；转账、借贷需填写「账户」与「账户2」。如果您的账单中不包含账户信息，可填入“无账户”，并在应用内创建一个名为「无账户」的虚拟账户与之对应,,,,,,,,,,,,,
【账户】对于转账类型，「账户」代表转出账户，「账户2」代表转入账户。如储蓄卡转账至余额宝，账户填写储蓄卡，账户2填写余额宝,,,,,,,,,,,,,
【账户】对于借贷-借入/收款明细，「账户」代表借贷对象，「账户2」代表您的内部账户。如向张三借入100至储蓄卡，账户填写张三，账户2填写储蓄卡,,,,,,,,,,,,,
【账户】对于借贷-借出/还款明细，「账户」代表您的内部账户，「账户2」代表借贷对象。如从储蓄卡还款给张三100，账户填写储蓄卡，账户2填写张三,,,,,,,,,,,,,
,,,,,,,,,,,,,
选填字段：,,,,,,,,,,,,,
【报销】选填。对于支出类型，可填入「非报销」、「待报销」、「已报销」，也可以不填；对于收入类型，如果是报销款，可填入「已报销」,,,,,,,,,,,,,
【备注】选填。,,,,,,,,,,,,,
【图片】选填。仅支持填入可直接访问的http或https地址。最多添加4个图片地址，每个地址间通过「空格」分开,,,,,,,,,,,,,
【角色】选填。对于支出、收入类型，可以填入角色信息，如有多个角色则通过「空格」分开。如果不同角色拥有不用金额，格式为角色A：10.00 角色B：20.00,,,,,,,,,,,,,
【标签】选填。如有多个标签则通过「空格」分开,,,,,,,,,,,,,
【币种】选填。默认为人民币。如需填写，请填入小星记账-设置-币种管理中币种的中文名称,,,,,,,,,,,,,
【商家】选填。,,,,,,,,,,,,,
,,,,,,,,,,,,,
,,,,,,,,,,,,,
类型,日期,大类,小类,金额,账户,账户2,报销,备注,图片,角色,标签,币种,商家\n`;
