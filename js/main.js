// AI智能财务处理系统演示版：页面切换、模拟加载、报表标签、图表与深色模式。
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const toast = document.getElementById("toast");
const globalSearch = document.getElementById("globalSearch");
const notificationBtn = document.getElementById("notificationBtn");
const roleSelect = document.getElementById("roleSelect");
const roleAvatar = document.getElementById("roleAvatar");
const roleName = document.getElementById("roleName");
const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const loginRole = document.getElementById("loginRole");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const assistantInput = document.getElementById("assistantInput");
const assistantSend = document.getElementById("assistantSend");
const companyNameInput = document.getElementById("companyNameInput");
const periodInput = document.getElementById("periodInput");
const taskProgress = document.getElementById("taskProgress");
const progressBar = document.getElementById("progressBar");
const uploadedFiles = new Map();
const ticketAmounts = new Map();
const authStorageKey = "mingfan-auth-role";
const loginUsers = {
  cashier: { username: "cashier", password: "cashier123" },
  accountant: { username: "accountant", password: "accountant123" },
  supervisor: { username: "supervisor", password: "supervisor123" }
};
const appState = {
  companyName: "北京明帆股份有限公司",
  period: "2022年12月",
  role: "supervisor",
  authenticated: false,
  progress: 72,
  vouchers: [],
  selectedVoucherNos: new Set(),
  voucherStatusOverrides: {},
  currentVoucher: null,
  lastRecognizedAmount: 6678,
  correctionApplied: false,
  dataVersionMinor: 3,
  workflow: {
    cashierSigned: false,
    posted: false,
    profitClosed: false,
    periodClosed: false
  }
};
const roleProfiles = {
  cashier: { name: "出纳", avatar: "出", permission: "当前角色：出纳，可上传回单、登记收付款并完成出纳签字", actions: ["recognize", "cashierSign", "export"] },
  accountant: { name: "会计", avatar: "会", permission: "当前角色：会计，可识别凭证、生成分录、匹配现金流并结转损益", actions: ["recognize", "entry", "closeProfit", "export"] },
  supervisor: { name: "会计主管", avatar: "审", permission: "当前角色：会计主管，可审核凭证、审核过账、结账并生成报表", actions: ["recognize", "entry", "audit", "post", "closePeriod", "report", "export", "submit"] }
};
const mockData = {
  companyName: "北京明帆股份有限公司",
  period: "2022年12月",
  achievements: { completedVouchers: 97, auditedVouchers: 97, ledgers: 5, reports: 3, aiAccuracy: 92, risks: 5 },
  subjects: {
    "库存现金": { code: "1001", opening: 12860.50 },
    "银行存款": { code: "1002", opening: 4032123.76 },
    "其他货币资金": { code: "1012", opening: 69732.20 },
    "应收账款": { code: "1122", opening: 1199040.00 },
    "应收票据": { code: "1121", opening: 525790.00 },
    "预付款项": { code: "1123", opening: 280000.00 },
    "原材料": { code: "1403", opening: 2216840.00 },
    "库存商品": { code: "1405", opening: 1139416.16 },
    "其他流动资产": { code: "1499", opening: 186240.00 },
    "固定资产": { code: "1601", opening: 6455606.10 },
    "累计折旧": { code: "1602", opening: -842300.00 },
    "无形资产": { code: "1701", opening: 1624350.00 },
    "长期待摊费用": { code: "1801", opening: 365420.00 },
    "其他非流动资产": { code: "1901", opening: 1553790.00 },
    "工程物资": { code: "1605", opening: 357193.00 },
    "应付账款": { code: "2202", opening: -706653.00 },
    "应交税费": { code: "2221", opening: -720007.34 },
    "应付职工薪酬": { code: "2211", opening: -580639.08 },
    "短期借款": { code: "2001", opening: -150000.00 },
    "应付票据": { code: "2201", opening: -80000.00 },
    "长期借款": { code: "2501", opening: -1200000.00 },
    "实收资本": { code: "4001", opening: -12000000.00 },
    "资本公积": { code: "4002", opening: -1800000.00 },
    "盈余公积": { code: "4101", opening: -600000.00 },
    "未分配利润": { code: "4104", opening: -1338802.30 },
    "主营业务收入": { code: "6001", opening: 0 },
    "主营业务成本": { code: "6401", opening: 0 },
    "税金及附加": { code: "6403", opening: 0 },
    "销售费用": { code: "6601", opening: 0 },
    "管理费用": { code: "6602", opening: 0 },
    "财务费用": { code: "6603", opening: 0 },
    "信用减值损失": { code: "6701", opening: 0 },
    "投资收益": { code: "6111", opening: 0 },
    "本年利润": { code: "4103", opening: 0 }
  },
  statementBase: {
    cost: 1290562.19,
    taxAndSurcharge: 29803.28,
    incomeTax: 535387.48,
    intangibleAssets: 1624350.00,
    longPrepaidExpense: 365420.00,
    otherNonCurrentAssets: 1553790.00,
    prepayments: 280000.00,
    otherCurrentAssets: 186240.00,
    contractLiability: 156990.00,
    investmentIncomeBase: 8219.38,
    fairValueGain: 57000.00,
    impairmentLoss: -30000.00,
    assetDisposalGainBase: -1984.00,
    nonOperatingIncome: 250.00,
    nonOperatingExpense: 40000.00,
    otherOperatingCashIn: 7479.81,
    employeeCashOut: 703253.90,
    taxCashOut: 320035.74,
    investCashNet: -806444.50,
    financingCashNet: -379100.00
  },
  vouchers: [
    {
      date: "2022-12-01", no: "记-001", summary: "销售商品，货款已收", risk: "低", sign: true, audit: true, post: true,
      cashflow: { salesCashIn: 466125 },
      lines: [
        { summary: "销售商品，货款已收", subject: "银行存款", debit: 466125, credit: 0 },
        { summary: "确认主营业务收入", subject: "主营业务收入", debit: 0, credit: 412500 },
        { summary: "确认销项税额", subject: "应交税费--应交增值税（销项税额）", debit: 0, credit: 53625 }
      ]
    },
    {
      date: "2022-12-03", no: "记-004", summary: "购买办公用品", risk: "低", sign: true, audit: true, post: true,
      cashflow: { otherOperatingCashOut: 271.20 },
      lines: [
        { summary: "购买办公用品", subject: "管理费用--办公费", debit: 271.20, credit: 0 },
        { summary: "银行存款支付", subject: "银行存款", debit: 0, credit: 271.20 }
      ]
    },
    {
      date: "2022-12-08", no: "记-018", summary: "采购材料，银行汇票付款", risk: "中", sign: true, audit: true, post: false,
      cashflow: { purchaseCashOut: 56500 },
      lines: [
        { summary: "材料尚未验收入库", subject: "原材料", debit: 50000, credit: 0 },
        { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: 6500, credit: 0 },
        { summary: "银行汇票付款", subject: "其他货币资金", debit: 0, credit: 56500 }
      ]
    },
    {
      date: "2022-12-18", no: "记-026", summary: "支付广告推广费", risk: "中", sign: false, audit: false, post: false,
      cashflow: { otherOperatingCashOut: 12720 },
      lines: [
        { summary: "支付广告推广费", subject: "管理费用--广告费", debit: 12000, credit: 0 },
        { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: 720, credit: 0 },
        { summary: "银行转账支付", subject: "银行存款", debit: 0, credit: 12720 }
      ]
    },
    {
      date: "2022-12-22", no: "记-031", summary: "支付生产设备维修费", risk: "低", sign: true, audit: true, post: false,
      cashflow: { otherOperatingCashOut: 8475 },
      lines: [
        { summary: "支付生产设备维修费", subject: "管理费用--维修费", debit: 7500, credit: 0 },
        { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: 975, credit: 0 },
        { summary: "银行存款支付", subject: "银行存款", debit: 0, credit: 8475 }
      ]
    },
    {
      date: "2022-12-27", no: "记-038", summary: "支付产品运输服务费", risk: "低", sign: true, audit: true, post: true,
      cashflow: { otherOperatingCashOut: 6678 },
      lines: [
        { summary: "支付产品运输服务费", subject: "销售费用--运输费", debit: 6300, credit: 0 },
        { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: 378, credit: 0 },
        { summary: "银行存款支付", subject: "银行存款", debit: 0, credit: 6678 }
      ]
    },
    {
      date: "2022-12-28", no: "记-039", summary: "销售商品，货款未收", risk: "中", sign: true, audit: true, post: true,
      cashflow: {},
      lines: [
        { summary: "销售商品，货款未收", subject: "应收账款", debit: 694950, credit: 0 },
        { summary: "确认主营业务收入", subject: "主营业务收入", debit: 0, credit: 615000 },
        { summary: "确认销项税额", subject: "应交税费--应交增值税（销项税额）", debit: 0, credit: 79950 }
      ]
    },
    {
      date: "2022-12-31", no: "记-040", summary: "计提固定资产折旧", risk: "低", sign: true, audit: true, post: true,
      cashflow: {},
      lines: [
        { summary: "计提固定资产折旧", subject: "管理费用--折旧费", debit: 32000, credit: 0 },
        { summary: "累计折旧", subject: "累计折旧", debit: 0, credit: 32000 }
      ]
    },
    {
      date: "2022-12-31", no: "记-041", summary: "收到银行存款利息", risk: "低", sign: true, audit: true, post: true,
      cashflow: { otherOperatingCashIn: 250 },
      lines: [
        { summary: "收到银行存款利息", subject: "银行存款", debit: 250, credit: 0 },
        { summary: "冲减财务费用", subject: "财务费用--利息收入", debit: 0, credit: 250 }
      ]
    },
    {
      date: "2022-12-31", no: "记-042", summary: "计提坏账准备", risk: "中", sign: true, audit: true, post: true,
      cashflow: {},
      lines: [
        { summary: "计提坏账准备", subject: "信用减值损失", debit: 53648, credit: 0 },
        { summary: "确认坏账准备", subject: "坏账准备", debit: 0, credit: 53648 }
      ]
    }
  ]
};
const baseReport = {
  cash: 4032123.76,
  notesReceivable: 525790,
  accountsReceivable: 1199040,
  inventory: 3356256.16,
  fixedAssets: 6455606.10,
  intangibleAssets: 1624350,
  nonCurrentAssets: 9633746.10,
  shortLoan: 150000,
  notesPayable: 80000,
  accountsPayable: 706653,
  salaryPayable: 580639.08,
  taxesPayable: 720007.34,
  longLoan: 1200000,
  equity: 15731747.72,
  revenue: 2059160,
  cost: 1290562.19,
  taxAndSurcharge: 29803.28,
  sellingExpense: 125405.56,
  adminExpense: 319219.11,
  financeExpense: 3026.27,
  investmentIncome: 8219.38,
  fairValueGain: 57000,
  creditLoss: -53648,
  impairmentLoss: -30000,
  assetDisposalGain: -1984,
  nonOperatingIncome: 250,
  nonOperatingExpense: 40000,
  incomeTax: 535387.48,
  operatingProfit: 270730.97,
  totalProfit: 230980.97,
  netProfit: -304406.51,
  salesCashIn: 3735713,
  operatingCashIn: 3743192.81,
  purchaseCashOut: 701329.39,
  employeeCashOut: 703253.90,
  taxCashOut: 320035.74,
  operatingCashNet: 1836615.20,
  investCashNet: -806444.50,
  financingCashNet: -379100,
  endingCashEquivalent: 5216484.26
};
const trainingCases = {
  ad: "2022年12月18日，北京明帆股份有限公司为推广新产品，在网络平台投放广告，取得增值税专用发票，价税合计12,720.00元，其中广告服务费12,000.00元，增值税进项税额720.00元，通过银行转账支付。",
  materialDraft: "2022年12月20日，北京明帆股份有限公司采购生产用甲材料，材料尚未验收入库，取得增值税专用发票，价税合计56,500.00元，其中材料款50,000.00元，增值税进项税额6,500.00元，开出银行汇票付款。",
  assetSale: "2022年12月21日，北京明帆股份有限公司出售一台旧生产设备，取得处置收入33,900.00元，其中不含税金额30,000.00元，增值税销项税额3,900.00元，款项已存入银行。",
  electricity: "2022年12月23日，北京明帆股份有限公司支付本月电费11,300.00元，其中不含税电费10,000.00元，增值税进项税额1,300.00元，生产车间分摊70%，管理部门分摊30%，通过银行存款支付。",
  training: "2022年12月25日，北京明帆股份有限公司支付员工培训费，取得增值税专用发票，价税合计874.50元，其中培训费825.00元，增值税进项税额49.50元，以库存现金支付。",
  stockSale: "2022年12月28日，北京明帆股份有限公司出售持有的股票，收到银行存款297,000.00元，该股票账面价值240,500.00元，差额确认投资收益。",
  saleCash: "2022年12月1日，北京明帆股份有限公司销售商品，取得增值税专用发票，价税合计466,125.00元，其中不含税收入412,500.00元，增值税销项税额53,625.00元，货款已存入银行。",
  saleCredit: "2022年12月3日，北京明帆股份有限公司销售商品，货款未收，价税合计694,950.00元，其中不含税收入615,000.00元，增值税销项税额79,950.00元。",
  repair: "2022年12月22日，北京明帆股份有限公司支付生产设备维修费用，取得增值税专用发票，价税合计8,475.00元，其中维修费7,500.00元，增值税进项税额975.00元，通过银行存款支付。",
  depreciation: "2022年12月31日，北京明帆股份有限公司计提本月固定资产折旧32,000.00元，其中生产设备折旧22,000.00元，管理部门设备折旧10,000.00元。",
  interest: "2022年12月31日，北京明帆股份有限公司收到银行存款利息250.00元，款项已存入银行。",
  badDebt: "2022年12月31日，北京明帆股份有限公司根据应收账款余额计提坏账准备53,648.00元。"
};
const sampleTickets = {
  "发票": { amount: 6678, tax: 378, party: "通用物流服务有限公司", date: "2022-12-27", label: "增值税专用发票", code: "INV-1100225623" },
  "银行回单": { amount: 6678, tax: 378, party: "通用物流服务有限公司", date: "2022-12-27", label: "银行电子回单", code: "BANK-20221227" },
  "报销单": { amount: 6678, tax: 378, party: "通用物流服务有限公司", date: "2022-12-27", label: "费用报销单", code: "EXP-20221227" },
  "合同": { amount: 6678, tax: 378, party: "通用物流服务有限公司", date: "2022-12-27", label: "运输服务合同", code: "CON-20221227" }
};
const assistantAnswers = {
  "这笔业务为什么计入销售费用？": "如果支出直接服务于产品销售、市场推广或客户配送，例如广告费、销售运输费，应计入销售费用。这样能在利润表中反映企业为取得销售收入发生的期间费用。",
  "现金流量项目怎么选？": "现金流量项目要看现金收支性质。销售收款列入销售商品、提供劳务收到的现金；采购付款列入购买商品、接受劳务支付的现金；工资列入支付给职工以及为职工支付的现金；广告、运输、报销等通常列入支付的其他与经营活动有关的现金。",
  "材料未入库为什么记材料采购？": "材料尚未验收入库时，企业尚未形成可直接领用的库存材料，应先通过材料采购或在途物资核算。待验收入库后，再从材料采购转入原材料。",
  "固定资产清理怎么处理？": "出售、报废固定资产时，应先将固定资产账面价值转入固定资产清理，再归集处置收入、清理费用和相关税费，最后将清理净损益转入资产处置收益或营业外收支。"
};
const voucherRecords = [
  { date: "2022-12-01", no: "记-001", summary: "销售商品，货款已收", subject: "银行存款 / 主营业务收入 / 应交税费", debit: 466125, credit: 466125, sign: true, audit: true, post: true, risk: "低", status: "已过账" },
  { date: "2022-12-03", no: "记-004", summary: "购买办公用品", subject: "管理费用--办公费 / 银行存款", debit: 271.20, credit: 271.20, sign: true, audit: true, post: true, risk: "低", status: "已过账" },
  { date: "2022-12-08", no: "记-018", summary: "采购材料，银行汇票付款", subject: "材料采购 / 应交税费 / 其他货币资金", debit: 56500, credit: 56500, sign: true, audit: true, post: false, risk: "中", status: "待审核" },
  { date: "2022-12-18", no: "记-026", summary: "支付广告推广费", subject: "销售费用--广告费 / 应交税费 / 银行存款", debit: 12720, credit: 12720, sign: false, audit: false, post: false, risk: "中", status: "待签字" },
  { date: "2022-12-22", no: "记-031", summary: "支付生产设备维修费", subject: "制造费用--维修费 / 应交税费 / 银行存款", debit: 8475, credit: 8475, sign: true, audit: true, post: false, risk: "低", status: "待审核" },
  { date: "2022-12-27", no: "记-038", summary: "支付产品运输服务费", subject: "销售费用--运输费 / 应交税费 / 银行存款", debit: 6678, credit: 6678, sign: true, audit: true, post: true, risk: "低", status: "已过账" }
];
const ledgerViews = {
  general: {
    head: ["科目编码", "科目名称", "期初余额", "本期借方", "本期贷方", "期末余额"],
    rows: [
      ["1002", "银行存款", "4,032,123.76", "1,259,478.20", "742,316.40", "4,549,285.56"],
      ["6001", "主营业务收入", "0.00", "0.00", "2,059,160.00", "2,059,160.00"],
      ["6601", "销售费用", "0.00", "144,425.56", "0.00", "144,425.56"],
      ["2221", "应交税费", "720,007.34", "9,922.00", "53,625.00", "763,710.34"]
    ]
  },
  detail: {
    head: ["日期", "凭证号", "摘要", "借方", "贷方", "方向", "余额"],
    rows: [
      ["12-01", "记-001", "销售商品，货款已收", "466,125.00", "", "借", "4,498,248.76"],
      ["12-18", "记-026", "支付广告推广费", "", "12,720.00", "借", "4,485,528.76"],
      ["12-22", "记-031", "支付设备维修费", "", "8,475.00", "借", "4,477,053.76"],
      ["12-27", "记-038", "支付产品运输服务费", "", "6,678.00", "借", "4,470,375.76"]
    ]
  },
  balance: {
    head: ["科目", "期初借方", "期初贷方", "本期借方", "本期贷方", "期末借方", "期末贷方"],
    rows: [
      ["库存现金", "12,860.50", "", "874.50", "874.50", "12,860.50", ""],
      ["银行存款", "4,032,123.76", "", "1,259,478.20", "742,316.40", "4,549,285.56", ""],
      ["应收账款", "1,199,040.00", "", "694,950.00", "", "1,893,990.00", ""],
      ["原材料", "2,216,840.00", "", "50,000.00", "", "2,266,840.00", ""],
      ["固定资产", "6,455,606.10", "", "", "", "6,455,606.10", ""],
      ["累计折旧", "", "842,300.00", "", "32,000.00", "", "874,300.00"],
      ["应付账款", "", "706,653.00", "", "280,000.00", "", "986,653.00"],
      ["应交税费", "", "720,007.34", "9,922.00", "133,575.00", "", "843,660.34"],
      ["主营业务收入", "", "", "", "2,059,160.00", "", "2,059,160.00"],
      ["主营业务成本", "", "", "1,290,562.19", "", "1,290,562.19", ""],
      ["销售费用", "", "", "144,425.56", "", "144,425.56", ""],
      ["管理费用", "", "", "319,219.11", "", "319,219.11", ""],
      ["财务费用", "", "", "3,026.27", "250.00", "2,776.27", ""],
      ["本年利润", "", "230,980.97", "2,059,160.00", "1,828,179.03", "", "0.00"]
    ]
  },
  trial: {
    head: ["项目", "借方金额", "贷方金额", "差额", "结果"],
    rows: [
      ["期初余额试算", "19,183,179.22", "19,183,179.22", "0.00", "试算平衡通过"],
      ["本期发生额试算", "5,372,552.83", "5,372,552.83", "0.00", "试算平衡通过"],
      ["期末余额试算", "20,115,889.56", "20,115,889.56", "0.00", "试算平衡通过"]
    ]
  },
  close: {
    head: ["期间", "处理步骤", "执行角色", "处理结果", "时间"],
    rows: [
      ["2022年12月", "出纳签字", "出纳", appState.workflow.cashierSigned ? "已完成" : "待处理", "09:10"],
      ["2022年12月", "主管审核过账", "会计主管", appState.workflow.posted ? "已完成" : "待处理", "09:18"],
      ["2022年12月", "会计结转损益", "会计", appState.workflow.profitClosed ? "已完成" : "待处理", "09:26"],
      ["2022年12月", "主管结账生成报表", "会计主管", appState.workflow.periodClosed ? "已完成" : "待处理", "09:35"]
    ]
  }
};
const documentTemplates = {
  invoice: ["增值税专用发票", "发票号码：1100225623", "价税合计：6,678.00 元", "进项税额：378.00 元，可抵扣"],
  bank: ["银行电子回单", "付款账户：交通银行北京支行", "付款金额：6,678.00 元", "用途：产品运输服务费"],
  contract: ["运输服务合同", "供应商：通用物流服务有限公司", "合同金额：6,678.00 元", "履约状态：本月已完成"],
  expense: ["费用报销单", "报销部门：销售部", "报销金额：6,678.00 元", "审批状态：部门负责人已审批"]
};
let chartsReady = false;

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageId = item.dataset.page;
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
    pageTitle.textContent = item.dataset.title;
    sidebar.classList.remove("open");

    if (pageId === "analysis" && !chartsReady) {
      setTimeout(initCharts, 80);
    }
  });
});

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  if (chartsReady) {
    resetCharts();
    initCharts();
  }
});

document.querySelectorAll(".action-btn").forEach((button) => {
  button.addEventListener("click", () => runMockAction(button));
});

loginBtn.addEventListener("click", handleLogin);
loginPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleLogin();
});
loginRole.addEventListener("change", () => {
  const user = loginUsers[loginRole.value];
  loginUsername.value = user.username;
  loginPassword.value = "";
  loginError.textContent = "";
});
logoutBtn.addEventListener("click", () => {
  appState.authenticated = false;
  sessionStorage.removeItem(authStorageKey);
  roleSelect.disabled = false;
  loginScreen.classList.remove("auth-hidden");
  switchPage("dashboard");
  loginPassword.value = "";
  loginError.textContent = "已退出，请重新登录。";
});

document.getElementById("clearEntry").addEventListener("click", () => {
  document.getElementById("businessInput").value = "";
  showToast("业务描述已清空");
});

document.getElementById("businessTypeSelect").addEventListener("change", (event) => {
  const typeMap = {
    "销售收款": "saleCash",
    "采购付款": "materialDraft",
    "费用报销": "ad",
    "固定资产": "assetSale",
    "工资薪酬": "training",
    "投资业务": "stockSale",
    "月末结转": "badDebt"
  };
  const key = typeMap[event.target.value];
  if (key) document.getElementById("businessInput").value = trainingCases[key];
});

roleSelect.addEventListener("change", () => {
  if (appState.authenticated) {
    roleSelect.value = appState.role;
    showToast("角色由登录身份决定，如需切换请退出后重新登录");
    return;
  }
  appState.role = roleSelect.value;
  applyRole();
  showToast(`已切换为${roleProfiles[appState.role].name}`);
});

notificationBtn.addEventListener("click", () => {
  openModal("消息提醒", `
    <ul>
      <li>2 张凭证等待会计主管复核。</li>
      <li>1 条发票重复风险需要确认。</li>
      <li>${appState.period} 报表已可重新生成。</li>
    </ul>
  `);
});

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.getElementById("recognizeAgainBtn").addEventListener("click", () => {
  const file = Array.from(uploadedFiles.values())[0];
  if (file) {
    simulateRecognition("发票", file);
  } else {
    document.getElementById("recognizedDate").textContent = "2022-12-27";
    document.getElementById("recognizedParty").textContent = "通用业务往来单位";
    document.getElementById("recognizedAmount").textContent = "6,678.00 元";
    document.getElementById("recognizedTaxRate").textContent = "6% / 9% / 13%";
    document.getElementById("recognizedInvoice").textContent = "待上传后识别";
    refreshAttachmentRisk();
  }
  showToast("AI重新识别完成");
});

document.querySelectorAll(".sample-ticket-btn").forEach((button) => {
  button.addEventListener("click", () => loadSampleTicket(button.dataset.sample));
});

document.getElementById("auditReportBtn").addEventListener("click", () => {
  if (!ensurePermission("audit")) return;
  const complete = ["发票", "银行回单"].every((type) => uploadedFiles.has(type));
  const report = [
    `${appState.companyName}凭证审核报告`,
    `会计期间：${appState.period}`,
    `审核角色：${roleProfiles[appState.role].name}`,
    `附件完整性：${complete ? "核心附件完整" : "核心附件未完整"}`,
    `审核建议：${complete ? "可进入分录生成与主管复核流程。" : "请补充发票和银行回单后再审核。"}`
  ].join("\n");
  downloadTextFile("凭证审核报告.doc", report);
  openModal("审核报告已生成", `<p>${report.replaceAll("\n", "<br>")}</p>`);
});

document.getElementById("exportWordBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  downloadTextFile("会计分录.doc", buildVoucherExportText());
  showToast("Word文件已导出");
});

document.getElementById("exportExcelBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  downloadHtmlTable("会计分录.xls", document.querySelector(".voucher-table").outerHTML);
  showToast("Excel文件已导出");
});

document.getElementById("entryAuditBtn").addEventListener("click", () => {
  if (!ensurePermission("entry")) return;
  auditCurrentEntry();
});

document.getElementById("downloadReportExcelBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  const activeReport = document.querySelector(".financial-table.active");
  downloadHtmlTable("财务报表.xls", activeReport.outerHTML);
  showToast("报表Excel已下载");
});

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  openModal("下载PDF", "<p>浏览器打印窗口已准备打开，请在打印对话框中选择“另存为 PDF”。</p>");
  setTimeout(() => window.print(), 300);
});

document.getElementById("printBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  showToast("正在打开打印窗口");
  window.print();
});

document.getElementById("saveSettingsBtn").addEventListener("click", () => {
  appState.companyName = companyNameInput.value.trim() || "未命名公司";
  appState.period = periodInput.value.trim() || "当前期间";
  applyCompanySettings();
  showToast("公司与会计期间已保存");
});

document.getElementById("startTaskBtn").addEventListener("click", () => {
  switchPage("audit");
  showToast("已进入凭证审核任务");
});

document.getElementById("saveProgressBtn").addEventListener("click", () => {
  appState.progress = Math.min(100, appState.progress + 8);
  updateProgress();
  showToast("实训进度已保存");
});

document.getElementById("submitTaskBtn").addEventListener("click", () => {
  if (!ensurePermission("submit")) return;
  appState.progress = 100;
  updateProgress();
  openModal("提交结果", `
    <p><strong>${appState.companyName}</strong> 的实训结果已生成模拟提交记录。</p>
    <ul>
      <li>凭证审核：已完成</li>
      <li>会计分录：借贷平衡</li>
      <li>报表生成：三张主表完整</li>
      <li>角色流程：${roleProfiles[appState.role].name} 操作记录已写入</li>
      <li>预计评分：92 / 100</li>
    </ul>
  `);
});

document.getElementById("helpBtn").addEventListener("click", () => {
  openModal("操作帮助", `
    <ul>
      <li>先在顶部切换出纳、会计或会计主管角色。</li>
      <li>出纳上传银行回单，会计上传发票并生成分录，会计主管审核后生成报表。</li>
      <li>在“系统设置”中修改公司名称和会计期间，可适用于不同企业。</li>
      <li>顶部搜索框支持搜索分录、进项税、报表、现金流量、风险等关键词。</li>
      <li>所有导出按钮会生成本地 Word/Excel 文件；PDF 使用浏览器打印另存为 PDF。</li>
    </ul>
  `);
});

document.querySelectorAll(".case-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (!ensurePermission("entry")) return;
    document.getElementById("businessInput").value = trainingCases[button.dataset.case];
    generateVoucherFromInput();
    showToast("案例已载入并生成分录");
  });
});

document.querySelectorAll(".workflow-btn").forEach((button) => {
  button.addEventListener("click", () => runWorkflowAction(button));
});

document.getElementById("voucherSearchBtn").addEventListener("click", renderVoucherQuery);
document.getElementById("voucherResetBtn").addEventListener("click", () => {
  document.getElementById("voucherPeriodFilter").value = "2022年12月";
  document.getElementById("voucherSubjectFilter").value = "全部";
  document.getElementById("voucherStatusFilter").value = "全部";
  document.getElementById("voucherRiskFilter").value = "全部";
  renderVoucherQuery();
  showToast("查询条件已重置");
});

document.getElementById("selectAllVouchers").addEventListener("change", (event) => {
  document.querySelectorAll(".voucher-select").forEach((input) => {
    input.checked = event.target.checked;
    toggleVoucherSelection(input.value, input.checked);
  });
  updateSelectedVoucherCount();
});

document.getElementById("batchCashierSignBtn").addEventListener("click", () => batchProcessSelectedVouchers("cashierSign"));
document.getElementById("batchSupervisorAuditBtn").addEventListener("click", () => batchProcessSelectedVouchers("audit"));
document.getElementById("batchPostBtn").addEventListener("click", () => batchProcessSelectedVouchers("post"));

document.querySelectorAll(".correction-btn").forEach((button) => {
  button.addEventListener("click", () => handleCorrectionAction(button.dataset.correction));
});

document.getElementById("recalcDataBtn").addEventListener("click", runDataRecalculation);

document.querySelectorAll(".document-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".document-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderDocumentPreview(button.dataset.doc);
  });
});

document.querySelectorAll(".ledger-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".ledger-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderLedger(button.dataset.ledger);
  });
});

document.getElementById("ledgerRefreshBtn").addEventListener("click", () => {
  const activeTab = document.querySelector(".ledger-tab.active");
  renderLedger(activeTab.dataset.ledger);
  showToast("账簿数据已刷新");
});

document.getElementById("ledgerExportBtn").addEventListener("click", () => {
  if (!ensurePermission("export")) return;
  downloadHtmlTable("账簿数据.xls", document.querySelector("#ledger .dense-table table").outerHTML);
  showToast("账簿已导出");
});

document.getElementById("summaryBtn").addEventListener("click", () => {
  const summary = buildGroupSummary();
  openModal("小组报告摘要", `<p>${summary.replaceAll("\n", "<br>")}</p>`);
});

document.getElementById("aiAssistantBtn").addEventListener("click", () => {
  document.getElementById("assistantPanel").classList.toggle("hidden");
});

document.getElementById("assistantClose").addEventListener("click", () => {
  document.getElementById("assistantPanel").classList.add("hidden");
});

document.querySelectorAll(".assistant-questions button").forEach((button) => {
  button.addEventListener("click", () => {
    assistantInput.value = button.textContent.trim();
    handleAssistantQuestion();
  });
});

assistantSend.addEventListener("click", handleAssistantQuestion);
assistantInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleAssistantQuestion();
});

globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runGlobalSearch(globalSearch.value);
  }
});

globalSearch.addEventListener("input", () => {
  if (!globalSearch.value.trim()) {
    clearSearchHighlights();
  }
});

document.querySelectorAll(".upload-box").forEach((box) => {
  const input = box.querySelector("input");
  input.addEventListener("change", () => {
    if (input.files[0]) handleUpload(box, input.files[0]);
  });

  box.addEventListener("dragover", (event) => {
    event.preventDefault();
    box.classList.add("dragover");
  });

  box.addEventListener("dragleave", () => {
    box.classList.remove("dragover");
  });

  box.addEventListener("drop", (event) => {
    event.preventDefault();
    box.classList.remove("dragover");
    const file = event.dataTransfer.files[0];
    if (file) {
      handleUpload(box, file);
    }
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".financial-table").forEach((table) => table.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`${tab.dataset.report}Report`).classList.add("active");
  });
});

function runMockAction(button) {
  if (button.dataset.action === "audit" && !ensurePermission("audit")) return;
  if (button.dataset.action === "entry" && !ensurePermission("entry")) return;
  if (button.dataset.action === "report" && !ensurePermission("report")) return;
  const originalText = button.textContent;
  button.classList.add("loading");
  button.disabled = true;
  showToast("AI正在处理，请稍候...");

  setTimeout(() => {
    button.classList.remove("loading");
    button.disabled = false;
    button.textContent = originalText;

    if (button.dataset.action === "audit") {
      updateAuditResult();
      document.getElementById("auditResult").classList.remove("hidden");
    }

    if (button.dataset.action === "entry") {
      generateVoucherFromInput();
      showToast("会计分录已生成");
    }

    if (button.dataset.action === "report") {
      document.getElementById("reportPeriod").textContent = appState.period;
      generateReportsFromVouchers();
      showToast(appState.workflow.periodClosed ? `${appState.companyName}三张财务报表已正式生成` : "已生成报表预览，正式报表需主管结账后确认");
    }
  }, 1000);
}

function handleLogin() {
  const role = loginRole.value;
  const user = loginUsers[role];
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (username !== user.username || password !== user.password) {
    loginError.textContent = "用户名或密码错误，请确认角色与账号是否匹配。";
    return;
  }

  appState.authenticated = true;
  appState.role = role;
  sessionStorage.setItem(authStorageKey, role);
  roleSelect.value = role;
  roleSelect.disabled = true;
  applyRole();
  loginScreen.classList.add("auth-hidden");
  loginError.textContent = "";
  switchPage(getRoleLandingPage(role));
  showToast(`登录成功：${roleProfiles[role].name}`);
}

function initLoginScreen() {
  const savedRole = sessionStorage.getItem(authStorageKey);
  if (savedRole && loginUsers[savedRole]) {
    appState.authenticated = true;
    appState.role = savedRole;
    roleSelect.value = savedRole;
    roleSelect.disabled = true;
    applyRole();
    loginScreen.classList.add("auth-hidden");
    switchPage(getRoleLandingPage(savedRole));
    return;
  }

  const user = loginUsers[loginRole.value];
  loginUsername.value = user.username;
  loginScreen.classList.remove("auth-hidden");
}

function getRoleLandingPage(role) {
  return {
    cashier: "audit",
    accountant: "entry",
    supervisor: "reports"
  }[role] || "dashboard";
}

function handleUpload(box, file) {
  const type = box.dataset.uploadType;
  uploadedFiles.set(type, file);
  box.classList.add("uploaded");
  box.querySelector("span").textContent = file.name;
  renderFileList();
  renderTicketPreviews();
  simulateRecognition(type, file);
  showToast(`${type}已上传`);
}

function renderFileList() {
  const fileList = document.getElementById("fileList");
  if (uploadedFiles.size === 0) {
    fileList.innerHTML = "<span>尚未上传附件</span>";
    return;
  }

  fileList.innerHTML = Array.from(uploadedFiles.entries()).map(([type, file]) => `
    <div class="file-item">
      <strong>${type}</strong>
      <span>${file.name} · ${formatFileSize(file.size)}</span>
    </div>
  `).join("");
}

function formatFileSize(size) {
  if (!size) return "本地文件";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function simulateRecognition(type, file) {
  const today = new Date();
  const dateText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const amount = guessAmountFromName(file.name) || 874.5;
  appState.lastRecognizedAmount = amount;
  ticketAmounts.set(type, amount);
  document.getElementById("recognizedDate").textContent = dateText;
  document.getElementById("recognizedAmount").textContent = `${formatMoney(amount)} 元`;
  document.getElementById("recognizedParty").textContent = type === "银行回单" ? "开户银行或支付平台" : `${appState.companyName}业务往来单位`;
  document.getElementById("recognizedInvoice").textContent = type === "发票" ? createInvoiceNo(file.name) : "待发票识别";
  refreshAttachmentRisk();
  updateFourWayMatch();
}

function guessAmountFromName(name) {
  const moneyLike = name.match(/(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+\.\d{1,2})/);
  if (moneyLike) return Number(moneyLike[1].replaceAll(",", ""));
  const plain = Array.from(name.matchAll(/\d{3,7}/g))
    .map((match) => Number(match[0]))
    .find((value) => value < 2020 || value > 2035);
  return plain || null;
}

function createInvoiceNo(seed) {
  let total = 0;
  for (const char of seed) total += char.charCodeAt(0);
  return String(31000000 + total).slice(0, 8);
}

function refreshAttachmentRisk() {
  const required = ["发票", "银行回单"];
  const missing = required.filter((type) => !uploadedFiles.has(type));
  const completeness = document.getElementById("recognizedCompleteness");
  const risk = document.getElementById("recognizedRisk");

  if (missing.length === 0) {
    completeness.textContent = uploadedFiles.has("合同") || uploadedFiles.has("报销单") ? "附件完整" : "核心附件完整";
    completeness.className = "text-success";
    risk.textContent = "低风险";
    risk.className = "text-success";
  } else {
    completeness.textContent = `缺少${missing.join("、")}`;
    completeness.className = "text-warning";
    risk.textContent = "中风险";
    risk.className = "text-warning";
  }
}

function updateAuditResult() {
  refreshAttachmentRisk();
  const complete = ["发票", "银行回单"].every((type) => uploadedFiles.has(type));
  const match = getFourWayMatch();
  const scoreCompleteness = uploadedFiles.size === 4 ? 100 : uploadedFiles.size >= 2 ? 85 : 60;
  const scoreAmount = match.ready ? (match.pass ? 100 : 60) : 80;
  const scoreTax = document.getElementById("recognizedTaxRate").textContent.includes("13") || document.getElementById("recognizedTaxRate").textContent.includes("9") || document.getElementById("recognizedTaxRate").textContent.includes("6") ? 100 : 90;
  const scoreBusiness = match.ready ? (match.pass ? 100 : 70) : 90;
  const average = Math.round((scoreCompleteness + scoreAmount + scoreTax + scoreBusiness) / 4);
  const riskLevel = average >= 90 ? "低" : average >= 75 ? "中" : "高";
  const resultItems = document.querySelectorAll("#auditResult .result-grid strong");
  resultItems[0].textContent = complete && (!match.ready || match.pass) ? "通过" : "需人工复核";
  resultItems[1].textContent = match.ready ? (match.pass ? "四单金额一致，附件链条完整，税额具备抵扣条件。" : "四单金额存在差异，需核对发票、回单、报销单与合同。") : "核心附件未完整上传，系统暂不能完成四单匹配。";
  resultItems[2].textContent = complete && (!match.ready || match.pass) ? "建议会计主管确认科目后生成记账凭证。" : "请补充附件或核对金额后重新发起AI审核。";
  document.getElementById("scoreCompleteness").textContent = `${scoreCompleteness}分`;
  document.getElementById("scoreAmount").textContent = `${scoreAmount}分`;
  document.getElementById("scoreTax").textContent = `${scoreTax}分`;
  document.getElementById("scoreBusiness").textContent = `${scoreBusiness}分`;
  document.getElementById("scoreTotal").textContent = `${average}分`;
  document.getElementById("scoreRisk").textContent = riskLevel;
  document.getElementById("scoreRisk").className = riskLevel === "低" ? "text-success" : riskLevel === "中" ? "text-warning" : "text-danger";
  showToast(`审核完成：综合风险${riskLevel}`);
}

function loadSampleTicket(type) {
  const sample = sampleTickets[type];
  if (!sample) return;
  uploadedFiles.set(type, { name: `${sample.label}-${sample.code}.png`, size: 1024, type: "image/png" });
  ticketAmounts.set(type, sample.amount);
  renderFileList();
  renderTicketPreviews();
  simulateRecognition(type, { name: `${sample.label}-${formatMoney(sample.amount)}.png` });
  document.getElementById("recognizedDate").textContent = sample.date;
  document.getElementById("recognizedParty").textContent = sample.party;
  document.getElementById("recognizedAmount").textContent = `${formatMoney(sample.amount)} 元`;
  document.getElementById("recognizedTaxRate").textContent = "6%";
  document.getElementById("recognizedInvoice").textContent = sample.code;
  updateFourWayMatch();
  showToast(`${sample.label}示例已加载`);
}

function renderTicketPreviews() {
  const preview = document.getElementById("ticketPreviewGrid");
  if (!preview) return;
  const types = ["发票", "银行回单", "报销单", "合同"];
  preview.innerHTML = types.map((type) => {
    const sample = sampleTickets[type];
    const loaded = uploadedFiles.has(type);
    return `
      <div class="ticket-thumb ${loaded ? "loaded" : ""}">
        <span>${type}</span>
        <strong>${loaded ? sample.label : "未加载"}</strong>
        <p>${loaded ? `${sample.date} / ${formatMoney(sample.amount)}元` : "点击上方按钮加载示例票据"}</p>
      </div>
    `;
  }).join("");
}

function updateFourWayMatch() {
  const match = getFourWayMatch();
  const status = document.getElementById("matchStatus");
  const message = document.getElementById("matchMessage");
  renderMatchRows();

  if (!match.ready) {
    status.textContent = "待匹配";
    status.className = "tag warning";
    message.textContent = "需人工复核：请补充发票、银行回单、报销单和合同后再进行四单匹配。";
    message.className = "match-message warning";
    return;
  }

  if (match.pass) {
    status.textContent = "匹配通过";
    status.className = "tag success";
    message.textContent = "匹配通过，可进入分录生成。发票、银行回单、报销单和合同在金额、税额、交易对象与日期上形成完整证据链。";
    message.className = "match-message success";
  } else {
    status.textContent = "金额异常";
    status.className = "tag danger";
    message.textContent = `四单金额不一致，当前差异 ${formatMoney(match.diff)} 元，请核对票据金额。`;
    message.className = "match-message danger";
  }
}

function getFourWayMatch() {
  const required = ["发票", "银行回单", "报销单", "合同"];
  if (!required.every((type) => ticketAmounts.has(type))) return { ready: false, pass: false, diff: 0 };
  const amounts = required.map((type) => ticketAmounts.get(type));
  const diff = round(Math.max(...amounts) - Math.min(...amounts));
  const sameParty = required.every((type) => sampleTickets[type].party === sampleTickets["发票"].party);
  const sameDate = required.every((type) => sampleTickets[type].date === sampleTickets["发票"].date);
  const sameTax = required.every((type) => sampleTickets[type].tax === sampleTickets["发票"].tax);
  return { ready: true, pass: diff === 0 && sameParty && sameDate && sameTax, diff };
}

function renderMatchRows() {
  const rows = [
    ["发票金额", "amount", (value) => `${formatMoney(value)}元`],
    ["税额", "tax", (value) => `${formatMoney(value)}元`],
    ["交易对象", "party", (value) => value],
    ["日期", "date", (value) => value]
  ];
  const types = ["发票", "银行回单", "报销单", "合同"];
  const body = document.getElementById("matchRows");
  if (!body) return;
  body.innerHTML = rows.map(([label, key, formatter]) => {
    const values = types.map((type) => uploadedFiles.has(type) ? sampleTickets[type][key] : "未上传");
    const readyValues = values.filter((value) => value !== "未上传");
    const pass = readyValues.length === 4 && readyValues.every((value) => value === readyValues[0]);
    return `
      <tr>
        <td>${label}</td>
        ${values.map((value) => `<td>${value === "未上传" ? value : formatter(value)}</td>`).join("")}
        <td><span class="pill ${pass ? "low" : readyValues.length < 4 ? "mid" : "high"}">${pass ? "一致" : readyValues.length < 4 ? "待补充" : "异常"}</span></td>
      </tr>
    `;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1700);
}

function generateVoucherFromInput() {
  const input = document.getElementById("businessInput").value.trim();
  const voucher = buildVoucher(input);
  appState.currentVoucher = voucher;
  upsertVoucher(voucher);
  refreshVoucherRows(voucher.rows);
  document.getElementById("voucherNo").textContent = `凭证编号：${voucher.no}`;
  document.getElementById("debitTotal").textContent = formatMoney(voucher.total);
  document.getElementById("creditTotal").textContent = formatMoney(voucher.total);
  document.getElementById("aiExplainList").innerHTML = [
    ...voucher.explain,
    `该凭证已写入本期凭证流水，生成报表时会影响：${describeReportImpact(voucher)}。`
  ].map((item) => `<li>${item}</li>`).join("");
  document.getElementById("cashflowSuggestion").textContent = getCashflowSuggestion(voucher, input);
  document.getElementById("ledgerWriteNotice").textContent = `分录数据已写入统一模拟账簿：${voucher.no} 将参与科目余额表、试算平衡、三大报表和智能分析计算。`;
  updateTrialBalance(voucher);
  renderVoucherQuery();
  generateReportsFromVouchers();
}

function getCashflowSuggestion(voucher, text = "") {
  const explain = voucher.explain.join(" ");
  if (explain.includes("现金流量项目建议")) return explain.match(/现金流量项目建议(?:列入|匹配为)“([^”]+)”/)?.[1] || "支付的其他与经营活动有关的现金";
  if (text.includes("销售")) return "销售商品、提供劳务收到的现金";
  if (text.includes("采购") || text.includes("材料")) return "购买商品、接受劳务支付的现金";
  if (text.includes("培训") || text.includes("工资")) return "支付给职工以及为职工支付的现金";
  return "支付其他与经营活动有关的现金";
}

function auditCurrentEntry() {
  const voucher = appState.currentVoucher || buildVoucher(document.getElementById("businessInput").value);
  const debit = round(voucher.rows.reduce((sum, row) => sum + (row.debit || 0), 0));
  const credit = round(voucher.rows.reduce((sum, row) => sum + (row.credit || 0), 0));
  const balanced = debit === credit;
  const hasTax = voucher.rows.some((row) => row.subject.includes("应交税费"));
  const needsAttachment = voucher.rows.some((row) => row.subject.includes("应交税费") || row.subject.includes("销售费用") || row.subject.includes("材料"));
  const attachScore = needsAttachment ? (uploadedFiles.size >= 2 ? 90 : 70) : 95;
  const subjectScore = voucher.rows.length >= 2 ? 96 : 78;
  const amountScore = balanced ? 100 : 60;
  const total = Math.round((subjectScore + amountScore + attachScore + (hasTax ? 96 : 88)) / 4);
  document.getElementById("subjectScore").textContent = `${subjectScore}分`;
  document.getElementById("amountScore").textContent = `${amountScore}分`;
  document.getElementById("entryAttachScore").textContent = `${attachScore}分`;
  document.getElementById("entryTotalScore").textContent = `${total}分`;
  const status = document.getElementById("entryAuditStatus");
  status.textContent = total >= 90 ? "审核通过" : "需复核";
  status.className = total >= 90 ? "tag success" : "tag warning";
  showToast(`AI分录审核完成：${total}分`);
}

function refreshVoucherRows(voucherRows) {
  const tableBody = document.getElementById("voucherRows");
  tableBody.innerHTML = voucherRows.map((row) => `
    <tr>
      <td>${row.summary}</td>
      <td>${row.subject}</td>
      <td>${row.debit ? formatMoney(row.debit) : ""}</td>
      <td>${row.credit ? formatMoney(row.credit) : ""}</td>
    </tr>
  `).join("");
}

function updateTrialBalance(voucher) {
  const debit = round(voucher.rows.reduce((sum, row) => sum + (row.debit || 0), 0));
  const credit = round(voucher.rows.reduce((sum, row) => sum + (row.credit || 0), 0));
  const diff = round(debit - credit);
  document.getElementById("trialDebit").textContent = formatMoney(debit);
  document.getElementById("trialCredit").textContent = formatMoney(credit);
  document.getElementById("trialDiff").textContent = formatMoney(diff);
  const status = document.getElementById("trialStatus");
  status.textContent = diff === 0 ? "试算平衡通过" : "试算不平衡";
  status.className = diff === 0 ? "text-success" : "text-danger";
}

function buildVoucher(text) {
  const amount = extractTotalAmount(text) || extractAmount(text) || 1000;
  const explicitTax = extractInputTaxAmount(text);
  const explicitNet = extractNetAmount(text);
  const taxRate = inferTaxRate(text);
  const tax = explicitTax ?? (hasDeductibleVat(text) ? round(amount / (1 + taxRate) * taxRate) : 0);
  const net = explicitNet ?? round(amount - tax);
  const paySubject = getPaymentSubject(text);
  const no = `AI-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(Math.floor(Math.random() * 900) + 100)}`;

  if (text.includes("培训") || text.includes("教育经费")) {
    return withMeta(no, amount, [
      { summary: "支付员工培训费", subject: "应付职工薪酬--职工教育经费", debit: net, credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "支付款项", subject: paySubject, debit: 0, credit: amount }
    ], [
      "培训费与职工能力提升直接相关，系统建议计入职工教育经费。",
      tax ? `取得增值税专用发票，进项税额 ${formatMoney(tax)} 元可按规则抵扣。` : "未识别到专用发票信息，暂不生成进项税额。",
      "现金流量项目建议列入“支付给职工以及为职工支付的现金”。"
    ]);
  }

  if (text.includes("采购") || text.includes("购买") || text.includes("材料") || text.includes("入库")) {
    const materialSubject = text.includes("未入库") || text.includes("尚未验收") || text.includes("尚未入库") || text.includes("在途") ? "材料采购" : "原材料";
    return withMeta(no, amount, [
      { summary: materialSubject === "材料采购" ? "采购材料尚未入库" : "采购材料入库", subject: materialSubject, debit: net, credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "支付或确认货款", subject: text.includes("赊购") || text.includes("未付款") ? "应付账款" : paySubject, debit: 0, credit: amount }
    ], [
      materialSubject === "材料采购" ? "材料尚未验收入库，系统先计入“材料采购”，待入库后再转入原材料。" : "采购业务已入库，系统匹配“原材料”科目。",
      tax ? "取得专用发票时进项税额单独列示，便于后续抵扣和纳税申报。" : "未识别专票税额，按含税金额整体入账。",
      "现金流量项目建议列入“购买商品、接受劳务支付的现金”。"
    ]);
  }

  if (text.includes("销售") || text.includes("收入") || text.includes("开票")) {
    const outputTax = extractOutputTaxAmount(text) ?? round(amount / 1.13 * 0.13);
    const revenue = round(amount - outputTax);
    return withMeta(no, amount, [
      { summary: "确认销售收入", subject: text.includes("未收款") || text.includes("赊销") ? "应收账款" : "银行存款", debit: amount, credit: 0 },
      { summary: "主营业务收入", subject: "主营业务收入", debit: 0, credit: revenue },
      { summary: "销项税额", subject: "应交税费--应交增值税（销项税额）", debit: 0, credit: outputTax }
    ], [
      "销售业务应确认主营业务收入，并同步确认销项税额。",
      "若描述中包含赊销或未收款，系统自动使用“应收账款”；否则默认银行收款。",
      "现金流量项目建议列入“销售商品、提供劳务收到的现金”。"
    ]);
  }

  if (text.includes("出售固定资产") || text.includes("处置固定资产")) {
    const clearing = net;
    return withMeta(no, amount, [
      { summary: "收到固定资产处置款", subject: paySubject, debit: amount, credit: 0 },
      { summary: "结转固定资产清理", subject: "固定资产清理", debit: 0, credit: clearing },
      { summary: "销项税额", subject: "应交税费--应交增值税（销项税额）", debit: 0, credit: tax }
    ], [
      "出售固定资产应通过“固定资产清理”归集处置收入、账面价值和相关税费。",
      tax ? `处置收入涉及销项税额 ${formatMoney(tax)} 元，应贷记应交税费。` : "未识别销项税额，系统按不含税处置收入暂估。",
      "现金流量项目建议列入“处置固定资产、无形资产和其他长期资产收回的现金净额”。"
    ]);
  }

  if (text.includes("维修") || text.includes("修理") || text.includes("设备维护")) {
    const subject = text.includes("生产") || text.includes("车间") || text.includes("设备") ? "制造费用--维修费" : "管理费用--维修费";
    return withMeta(no, amount, [
      { summary: "支付设备维修费", subject, debit: net, credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "银行存款支付", subject: paySubject, debit: 0, credit: amount }
    ], [
      `维修费不含税金额 ${formatMoney(net)} 元计入“${subject}”，反映设备维护对生产经营成本的影响。`,
      tax ? `取得增值税专用发票，进项税额 ${formatMoney(tax)} 元可以抵扣，不计入维修成本。` : "未识别到可抵扣进项税额，系统暂按含税金额计入成本费用。",
      "该业务会增加当期制造费用或期间费用，降低利润；但可抵扣进项税额会减少应交增值税，不增加企业经营成本。"
    ]);
  }

  if (text.includes("运输") || text.includes("物流") || text.includes("运费")) {
    const subject = text.includes("产品") || text.includes("销售") || text.includes("客户") ? "销售费用--运输费" : "管理费用--运输费";
    return withMeta(no, amount, [
      { summary: "支付运输服务费", subject, debit: net, credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "银行存款支付", subject: paySubject, debit: 0, credit: amount }
    ], [
      `运输服务费不含税金额 ${formatMoney(net)} 元计入“${subject}”。`,
      tax ? `取得增值税专用发票，进项税额 ${formatMoney(tax)} 元可以抵扣，不计入运输成本。` : "未识别到可抵扣进项税额，系统暂按含税金额计入费用。",
      "现金流量项目匹配为“支付的其他与经营活动有关的现金”；若属于采购运输，可人工复核调整为采购相关现金流项目。"
    ]);
  }

  if (text.includes("广告") || text.includes("推广") || text.includes("平台投放")) {
    return withMeta(no, amount, [
      { summary: "支付广告推广费", subject: "销售费用--广告费", debit: net, credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "银行转账支付", subject: paySubject, debit: 0, credit: amount }
    ], [
      "广告推广支出用于产品销售和市场推广，系统建议计入“销售费用--广告费”。",
      tax ? `取得增值税专用发票且用于公司经营，进项税额 ${formatMoney(tax)} 元可以按规定抵扣。` : "未识别到增值税专用发票或税额，暂不生成进项税额。",
      "通过银行转账支付，现金流量项目建议列入“支付的其他与经营活动有关的现金”。"
    ]);
  }

  if (text.includes("电费") || text.includes("水电")) {
    return withMeta(no, amount, [
      { summary: "生产部门电费", subject: "制造费用--水电费", debit: round(net * 0.7), credit: 0 },
      { summary: "管理部门电费", subject: "管理费用--水电费", debit: round(net * 0.3), credit: 0 },
      { summary: "进项税额", subject: "应交税费--应交增值税（进项税额）", debit: tax, credit: 0 },
      { summary: "银行存款支付", subject: paySubject, debit: 0, credit: amount }
    ], [
      "电费按照受益部门分摊，生产部门计入制造费用，管理部门计入管理费用。",
      tax ? `取得增值税专用发票，进项税额 ${formatMoney(tax)} 元可抵扣。` : "未识别专票税额，系统暂不生成进项税。",
      "现金流量项目建议列入“购买商品、接受劳务支付的现金”或“支付的其他经营活动现金”。"
    ]);
  }

  if (text.includes("出售股票") || text.includes("卖出股票")) {
    return withMeta(no, amount, [
      { summary: "收到股票处置款", subject: paySubject, debit: amount, credit: 0 },
      { summary: "结转交易性金融资产", subject: "交易性金融资产", debit: 0, credit: net },
      { summary: "确认投资收益", subject: "投资收益", debit: 0, credit: round(amount - net) }
    ], [
      "出售股票应冲减交易性金融资产账面价值，差额计入投资收益。",
      "投资收益会影响利润表中的“投资收益”项目。",
      "现金流量项目建议列入“收回投资收到的现金”。"
    ]);
  }

  if (text.includes("工资") || text.includes("薪酬") || text.includes("社保")) {
    return withMeta(no, amount, [
      { summary: "计提职工薪酬", subject: "管理费用--职工薪酬", debit: amount, credit: 0 },
      { summary: "确认应付薪酬", subject: "应付职工薪酬", debit: 0, credit: amount }
    ], [
      "工资薪酬按受益部门计入期间费用，本演示默认计入管理费用。",
      "贷记应付职工薪酬，后续实际发放时再冲减该科目。",
      "现金流量项目建议列入“支付给职工以及为职工支付的现金”。"
    ]);
  }

  if (text.includes("折旧")) {
    return withMeta(no, amount, [
      { summary: "计提生产设备折旧", subject: text.includes("生产") ? "制造费用--折旧费" : "管理费用--折旧费", debit: amount, credit: 0 },
      { summary: "累计折旧", subject: "累计折旧", debit: 0, credit: amount }
    ], [
      "折旧属于固定资产价值转移，按受益对象计入费用。",
      "贷记累计折旧，不直接减少固定资产原值。",
      "计提折旧不产生现金流量。"
    ]);
  }

  if (text.includes("利息")) {
    return withMeta(no, amount, [
      { summary: "收到银行利息", subject: "银行存款", debit: amount, credit: 0 },
      { summary: "冲减财务费用", subject: "财务费用--利息收入", debit: 0, credit: amount }
    ], [
      "银行存款利息属于财务费用的抵减项目，贷记财务费用。",
      "该业务会增加货币资金，同时减少财务费用。",
      "现金流量项目建议列入“收到其他与经营活动有关的现金”。"
    ]);
  }

  if (text.includes("坏账")) {
    return withMeta(no, amount, [
      { summary: "计提坏账准备", subject: "信用减值损失", debit: amount, credit: 0 },
      { summary: "确认坏账准备", subject: "坏账准备", debit: 0, credit: amount }
    ], [
      "计提坏账准备体现谨慎性原则，会减少当期利润。",
      "坏账准备作为应收账款备抵项目列示。",
      "计提坏账准备不产生现金流量。"
    ]);
  }

  if (text.includes("结转损益") || text.includes("月末结转")) {
    return withMeta(no, amount, [
      { summary: "结转收入类科目", subject: "主营业务收入", debit: amount, credit: 0 },
      { summary: "转入本年利润", subject: "本年利润", debit: 0, credit: amount }
    ], [
      "月末结转将收入、成本和费用类科目转入本年利润。",
      "结转后损益类科目期末余额应为零。",
      "结转损益不产生现金流量。"
    ]);
  }

  if (text.includes("借款") || text.includes("贷款")) {
    return withMeta(no, amount, [
      { summary: "取得银行借款", subject: "银行存款", debit: amount, credit: 0 },
      { summary: "确认借款本金", subject: text.includes("长期") ? "长期借款" : "短期借款", debit: 0, credit: amount }
    ], [
      "取得借款导致银行存款增加，同时确认金融负债。",
      "系统根据“长期”关键词区分长期借款和短期借款。",
      "现金流量项目建议列入“取得借款收到的现金”。"
    ]);
  }

  if (text.includes("报销") || text.includes("差旅") || text.includes("办公费")) {
    return withMeta(no, amount, [
      { summary: "报销费用", subject: text.includes("差旅") ? "管理费用--差旅费" : "管理费用--办公费", debit: amount, credit: 0 },
      { summary: "支付报销款", subject: paySubject, debit: 0, credit: amount }
    ], [
      "报销类业务通常计入期间费用，系统按关键词匹配明细科目。",
      "付款科目根据描述中的现金、银行、支付宝等关键词自动判断。",
      "现金流量项目建议列入“支付的其他与经营活动有关的现金”。"
    ]);
  }

  return withMeta(no, amount, [
    { summary: "其他经营业务", subject: "管理费用--其他", debit: amount, credit: 0 },
    { summary: "支付款项", subject: paySubject, debit: 0, credit: amount }
  ], [
    "未命中特定业务模板，系统按一般经营费用生成建议分录。",
    "建议人工复核摘要、会计科目和现金流量项目后再过账。",
    "如需更准确，请在业务描述中写明采购、销售、工资、折旧、借款、报销等关键词。"
  ]);
}

function withMeta(no, total, rows, explain) {
  const balancedRows = balanceVoucherRows(rows.filter((row) => row.debit || row.credit));
  const balancedTotal = Math.max(
    round(balancedRows.reduce((sum, row) => sum + (row.debit || 0), 0)),
    round(balancedRows.reduce((sum, row) => sum + (row.credit || 0), 0)),
    round(total)
  );
  return { no, total: balancedTotal, rows: balancedRows, explain };
}

function balanceVoucherRows(rows) {
  const cloned = rows.map((row) => ({ ...row, debit: round(row.debit || 0), credit: round(row.credit || 0) }));
  const debit = round(cloned.reduce((sum, row) => sum + row.debit, 0));
  const credit = round(cloned.reduce((sum, row) => sum + row.credit, 0));
  const diff = round(debit - credit);
  if (diff === 0) return cloned;

  if (diff > 0) {
    const creditRow = cloned.find((row) => row.credit && isSettlementSubject(row.subject));
    if (creditRow) {
      creditRow.credit = round(creditRow.credit + diff);
      creditRow.summary = creditRow.summary.includes("自动校准") ? creditRow.summary : `${creditRow.summary}（AI自动校准）`;
    } else {
      cloned.push({ summary: "AI试算平衡调整", subject: "银行存款", debit: 0, credit: diff });
    }
    return cloned;
  }

  const shortage = Math.abs(diff);
  const debitRow = cloned.find((row) => row.debit && isSettlementSubject(row.subject));
  if (debitRow) {
    debitRow.debit = round(debitRow.debit + shortage);
    debitRow.summary = debitRow.summary.includes("自动校准") ? debitRow.summary : `${debitRow.summary}（AI自动校准）`;
  } else {
    cloned.push({ summary: "AI试算平衡调整", subject: "银行存款", debit: shortage, credit: 0 });
  }
  return cloned;
}

function isSettlementSubject(subject) {
  return ["库存现金", "银行存款", "其他货币资金", "应收账款", "应付账款"].some((key) => subject.includes(key));
}

function hasDeductibleVat(text) {
  return text.includes("增值税专用发票") || text.includes("专用发票") || text.includes("进项税");
}

function inferTaxRate(text) {
  const rateMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (rateMatch) return Number(rateMatch[1]) / 100;
  if (text.includes("维修") || text.includes("修理") || text.includes("设备") || text.includes("材料") || text.includes("采购")) return 0.13;
  if (text.includes("运输")) return 0.09;
  return 0.06;
}

function extractTotalAmount(text) {
  return extractMoneyAfter(text, ["价税合计", "合计金额", "价税总计", "含税金额"]);
}

function extractNetAmount(text) {
  return extractMoneyAfter(text, ["不含税金额", "不含税价", "其中维修费", "其中修理费", "运输服务费", "维修费", "修理费", "广告服务费", "服务费", "材料款", "货款", "培训费", "电费", "账面价值"]);
}

function extractInputTaxAmount(text) {
  return extractMoneyAfter(text, ["增值税进项税额", "进项税额", "进项税", "可抵扣税额"]);
}

function extractOutputTaxAmount(text) {
  return extractMoneyAfter(text, ["增值税销项税额", "销项税额", "销项税"]);
}

function extractMoneyAfter(text, labels) {
  for (const label of labels) {
    const pattern = new RegExp(`${label}[^\\d-]{0,8}(\\d+(?:,\\d{3})*(?:\\.\\d{1,2})?)\\s*元?`);
    const match = text.match(pattern);
    if (match) return Number(match[1].replaceAll(",", ""));
  }
  return null;
}

function extractAmount(text) {
  const matches = Array.from(text.matchAll(/(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*元/g));
  if (matches.length) {
    return Math.max(...matches.map((match) => Number(match[1].replaceAll(",", ""))));
  }
  const plain = text.match(/(\d+(?:,\d{3})*(?:\.\d{1,2})?)/);
  return plain ? Number(plain[1].replaceAll(",", "")) : null;
}

function getPaymentSubject(text) {
  if (text.includes("微信") || text.includes("支付宝") || text.includes("银行汇票")) return "其他货币资金";
  if (text.includes("银行存款") || text.includes("银行转账") || text.includes("银行支付") || text.includes("转账支付")) return "银行存款";
  if (text.includes("库存现金") || text.includes("以现金支付") || text.includes("现金支付")) return "库存现金";
  if (text.includes("应付")) return "应付账款";
  return "银行存款";
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function runGlobalSearch(keyword) {
  const query = keyword.trim();
  clearSearchHighlights();
  if (!query) return;

  const pageMap = [
    { page: "audit", words: ["审核", "附件", "发票", "回单", "合同", "风险"] },
    { page: "entry", words: ["分录", "凭证", "科目", "税", "进项", "销项", "运输", "维修", "广告", "采购", "销售"] },
    { page: "voucherCenter", words: ["查凭证", "凭证查询", "凭证号", "签字", "预览", "附件预览"] },
    { page: "ledger", words: ["账簿", "总账", "明细账", "科目余额", "结账记录"] },
    { page: "reports", words: ["报表", "资产负债表", "利润表", "现金流量", "营业收入", "净利润"] },
    { page: "analysis", words: ["分析", "图表", "诊断", "风险评分", "现金流"] },
    { page: "settings", words: ["设置", "权限", "参数", "流程"] }
  ];
  const target = pageMap.find((item) => item.words.some((word) => query.includes(word) || word.includes(query)));
  if (target) {
    switchPage(target.page);
  }

  const activeRows = document.querySelectorAll(".page.active table tbody tr");
  let matchCount = 0;
  activeRows.forEach((row) => {
    const matched = row.textContent.includes(query);
    row.classList.toggle("search-match", matched);
    if (matched) matchCount += 1;
  });

  if (matchCount) {
    showToast(`找到 ${matchCount} 条匹配记录`);
  } else if (target) {
    showToast(`已跳转到${pageTitle.textContent}`);
  } else {
    showToast("未找到匹配内容，可尝试搜索：分录、进项税、报表、风险");
  }
}

function switchPage(pageId) {
  const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (!targetNav) return;
  navItems.forEach((nav) => nav.classList.remove("active"));
  targetNav.classList.add("active");
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
  pageTitle.textContent = targetNav.dataset.title;

  if (pageId === "analysis" && !chartsReady) {
    setTimeout(initCharts, 80);
  }
}

function clearSearchHighlights() {
  document.querySelectorAll(".search-match").forEach((row) => row.classList.remove("search-match"));
}

function getAllVouchers() {
  const baseVouchers = getCorrectedMockVouchers();
  const generated = appState.vouchers.map((voucher, index) => normalizeGeneratedVoucher(voucher, index));
  return [...baseVouchers, ...generated];
}

function getCorrectedMockVouchers() {
  return mockData.vouchers.map((voucher) => {
    if (voucher.no !== "记-026" || !appState.correctionApplied) return voucher;
    return {
      ...voucher,
      summary: "支付广告推广费（已更正）",
      risk: "低",
      sign: true,
      audit: true,
      post: true,
      lines: voucher.lines.map((line) => {
        if (line.subject === "管理费用--广告费") {
          return { ...line, subject: "销售费用--广告宣传费", summary: "广告费科目更正" };
        }
        return { ...line };
      })
    };
  });
}

function normalizeGeneratedVoucher(voucher, index) {
  const balancedRows = balanceVoucherRows(voucher.rows || []);
  const debit = round(balancedRows.reduce((sum, row) => sum + (row.debit || 0), 0));
  const credit = round(balancedRows.reduce((sum, row) => sum + (row.credit || 0), 0));
  const date = voucher.date || "2022-12-31";
  return {
    date,
    no: voucher.no || `AI-${index + 1}`,
    summary: voucher.rows[0]?.summary || "AI生成凭证",
    risk: debit === credit ? "低" : "高",
    sign: appState.workflow.cashierSigned,
    audit: appState.workflow.posted,
    post: appState.workflow.posted,
    cashflow: inferVoucherCashflow({ ...voucher, rows: balancedRows }),
    lines: balancedRows
  };
}

function inferVoucherCashflow(voucher) {
  const text = `${voucher.rows.map((row) => `${row.summary}${row.subject}`).join(" ")} ${voucher.explain?.join(" ") || ""}`;
  const total = round(voucher.rows.reduce((sum, row) => sum + (row.credit && isCashSubject(row.subject) ? row.credit : 0), 0));
  const cashIn = round(voucher.rows.reduce((sum, row) => sum + (row.debit && isCashSubject(row.subject) ? row.debit : 0), 0));
  if (text.includes("销售") && cashIn) return { salesCashIn: cashIn };
  if (text.includes("采购") || text.includes("材料")) return { purchaseCashOut: total };
  if (text.includes("培训") || text.includes("工资") || text.includes("薪酬")) return { employeeCashOut: total };
  if (text.includes("固定资产") || text.includes("股票") || text.includes("投资")) return { investCashIn: cashIn, investCashOut: total };
  if (total) return { otherOperatingCashOut: total };
  if (cashIn) return { otherOperatingCashIn: cashIn };
  return {};
}

function isCashSubject(subject) {
  return ["库存现金", "银行存款", "其他货币资金"].some((key) => subject.includes(key));
}

function getSubjectKey(subject) {
  const base = subject.split("--")[0];
  const direct = Object.keys(mockData.subjects).find((key) => base.includes(key) || subject.includes(key));
  if (direct) return direct;
  if (subject.includes("坏账准备")) return "应收账款";
  if (subject.includes("材料采购")) return "原材料";
  if (subject.includes("制造费用")) return "主营业务成本";
  return base;
}

function calculateUnifiedData() {
  const subjectMap = {};
  Object.entries(mockData.subjects).forEach(([name, meta]) => {
    subjectMap[name] = { name, code: meta.code, opening: round(meta.opening), debit: 0, credit: 0 };
  });

  let totalDebit = 0;
  let totalCredit = 0;
  const cashflow = {
    salesCashIn: 0,
    otherOperatingCashIn: mockData.statementBase.otherOperatingCashIn,
    purchaseCashOut: 0,
    employeeCashOut: mockData.statementBase.employeeCashOut,
    taxCashOut: mockData.statementBase.taxCashOut,
    otherOperatingCashOut: 0,
    investCashIn: 0,
    investCashOut: Math.abs(mockData.statementBase.investCashNet),
    financingCashNet: mockData.statementBase.financingCashNet
  };

  getAllVouchers().forEach((voucher) => {
    voucher.lines.forEach((line) => {
      const key = getSubjectKey(line.subject);
      if (!subjectMap[key]) subjectMap[key] = { name: key, code: "", opening: 0, debit: 0, credit: 0 };
      const debit = line.debit || 0;
      const credit = line.credit || 0;
      subjectMap[key].debit = round(subjectMap[key].debit + debit);
      subjectMap[key].credit = round(subjectMap[key].credit + credit);
      totalDebit = round(totalDebit + debit);
      totalCredit = round(totalCredit + credit);
    });
    Object.entries(voucher.cashflow || {}).forEach(([key, value]) => {
      if (cashflow[key] === undefined) cashflow[key] = 0;
      cashflow[key] = round(cashflow[key] + Number(value || 0));
    });
  });

  Object.values(subjectMap).forEach((subject) => {
    subject.ending = round(subject.opening + subject.debit - subject.credit);
    subject.debitBalance = subject.ending > 0 ? subject.ending : 0;
    subject.creditBalance = subject.ending < 0 ? Math.abs(subject.ending) : 0;
  });

  const subject = (name) => subjectMap[name] || { opening: 0, debit: 0, credit: 0, ending: 0, debitBalance: 0, creditBalance: 0 };
  const revenue = subject("主营业务收入").credit - subject("主营业务收入").debit;
  const sellingExpense = subject("销售费用").debit - subject("销售费用").credit;
  const adminExpense = subject("管理费用").debit - subject("管理费用").credit;
  const financeExpense = subject("财务费用").debit - subject("财务费用").credit;
  const creditLoss = -(subject("信用减值损失").debit - subject("信用减值损失").credit);
  const investmentIncome = mockData.statementBase.investmentIncomeBase + subject("投资收益").credit - subject("投资收益").debit;
  const operatingProfit = round(revenue - mockData.statementBase.cost - mockData.statementBase.taxAndSurcharge - sellingExpense - adminExpense - financeExpense + investmentIncome + mockData.statementBase.fairValueGain + creditLoss + mockData.statementBase.impairmentLoss + mockData.statementBase.assetDisposalGainBase);
  const totalProfit = round(operatingProfit + mockData.statementBase.nonOperatingIncome - mockData.statementBase.nonOperatingExpense);
  const netProfit = round(totalProfit - mockData.statementBase.incomeTax);

  const monetaryFunds = round(subject("库存现金").debitBalance + subject("银行存款").debitBalance + subject("其他货币资金").debitBalance);
  const inventory = round(subject("原材料").debitBalance + subject("库存商品").debitBalance);
  const fixedAssetsNet = round(subject("固定资产").debitBalance - subject("累计折旧").creditBalance);
  const nonCurrentAssets = round(fixedAssetsNet + mockData.statementBase.intangibleAssets + mockData.statementBase.longPrepaidExpense + mockData.statementBase.otherNonCurrentAssets);
  const assetTotal = round(monetaryFunds + subject("应收票据").debitBalance + subject("应收账款").debitBalance + mockData.statementBase.prepayments + inventory + mockData.statementBase.otherCurrentAssets + nonCurrentAssets);
  const liabilityTotal = round(subject("短期借款").creditBalance + subject("应付票据").creditBalance + subject("应付账款").creditBalance + mockData.statementBase.contractLiability + subject("应付职工薪酬").creditBalance + subject("应交税费").creditBalance + subject("长期借款").creditBalance);
  const equity = round(assetTotal - liabilityTotal);

  const operatingCashIn = round(cashflow.salesCashIn + cashflow.otherOperatingCashIn);
  const operatingCashNet = round(operatingCashIn - cashflow.purchaseCashOut - cashflow.employeeCashOut - cashflow.taxCashOut - cashflow.otherOperatingCashOut);
  const investCashNet = round((cashflow.investCashIn || 0) - (cashflow.investCashOut || 0));
  const cashNetIncrease = round(operatingCashNet + investCashNet + cashflow.financingCashNet);
  const endingCashEquivalent = monetaryFunds;

  const report = {
    cash: monetaryFunds,
    notesReceivable: subject("应收票据").debitBalance,
    accountsReceivable: subject("应收账款").debitBalance,
    prepayments: mockData.statementBase.prepayments,
    inventory,
    otherCurrentAssets: mockData.statementBase.otherCurrentAssets,
    fixedAssets: fixedAssetsNet,
    intangibleAssets: mockData.statementBase.intangibleAssets,
    longPrepaidExpense: mockData.statementBase.longPrepaidExpense,
    nonCurrentAssets,
    shortLoan: subject("短期借款").creditBalance,
    notesPayable: subject("应付票据").creditBalance,
    accountsPayable: subject("应付账款").creditBalance,
    contractLiability: mockData.statementBase.contractLiability,
    salaryPayable: subject("应付职工薪酬").creditBalance,
    taxesPayable: subject("应交税费").creditBalance,
    longLoan: subject("长期借款").creditBalance,
    assetTotal,
    liabilityTotal,
    equity,
    revenue,
    cost: mockData.statementBase.cost,
    taxAndSurcharge: mockData.statementBase.taxAndSurcharge,
    sellingExpense,
    adminExpense,
    financeExpense,
    investmentIncome,
    fairValueGain: mockData.statementBase.fairValueGain,
    creditLoss,
    impairmentLoss: mockData.statementBase.impairmentLoss,
    assetDisposalGain: mockData.statementBase.assetDisposalGainBase,
    nonOperatingIncome: mockData.statementBase.nonOperatingIncome,
    nonOperatingExpense: mockData.statementBase.nonOperatingExpense,
    incomeTax: mockData.statementBase.incomeTax,
    operatingProfit,
    totalProfit,
    netProfit,
    salesCashIn: cashflow.salesCashIn,
    operatingCashIn,
    purchaseCashOut: cashflow.purchaseCashOut,
    employeeCashOut: cashflow.employeeCashOut,
    taxCashOut: cashflow.taxCashOut,
    otherOperatingCashOut: cashflow.otherOperatingCashOut,
    operatingCashNet,
    investCashNet,
    financingCashNet: cashflow.financingCashNet,
    cashNetIncrease,
    endingCashEquivalent
  };

  const indicators = {
    debtRatio: assetTotal ? round(liabilityTotal / assetTotal * 100) : 0,
    grossMargin: revenue ? round((revenue - report.cost) / revenue * 100) : 0,
    netMargin: revenue ? round(netProfit / revenue * 100) : 0,
    arTurnover: subject("应收账款").debitBalance ? round(revenue / subject("应收账款").debitBalance) : 0,
    inventoryTurnover: inventory ? round(report.cost / inventory) : 0,
    operatingCashNet
  };

  return { subjects: subjectMap, totalDebit, totalCredit, report, indicators };
}

function getVoucherQueryData() {
  return getAllVouchers().map((voucher) => {
    const override = appState.voucherStatusOverrides[voucher.no] || {};
    const debit = round(voucher.lines.reduce((sum, row) => sum + (row.debit || 0), 0));
    const credit = round(voucher.lines.reduce((sum, row) => sum + (row.credit || 0), 0));
    const subjects = Array.from(new Set(voucher.lines.map((row) => row.subject))).join(" / ");
    const sign = override.sign ?? voucher.sign;
    const audit = override.audit ?? voucher.audit;
    const post = override.post ?? voucher.post;
    return {
      date: voucher.date,
      no: voucher.no,
      summary: voucher.summary,
      subject: subjects,
      debit,
      credit,
      sign,
      audit,
      post,
      risk: voucher.risk || (debit === credit ? "低" : "高"),
      status: post ? "已过账" : audit ? "待过账" : sign ? "待审核" : "待签字",
      lines: voucher.lines
    };
  });
}

function renderVoucherQuery() {
  const period = document.getElementById("voucherPeriodFilter").value;
  const subject = document.getElementById("voucherSubjectFilter").value;
  const status = document.getElementById("voucherStatusFilter").value;
  const risk = document.getElementById("voucherRiskFilter").value;
  let rows = getVoucherQueryData();

  if (period !== "全部" && period !== "2022年12月") rows = [];
  if (subject !== "全部") rows = rows.filter((row) => row.subject.includes(subject));
  if (status !== "全部") rows = rows.filter((row) => row.status === status);
  if (risk !== "全部") rows = rows.filter((row) => row.risk === risk);

  const debit = round(rows.reduce((sum, row) => sum + row.debit, 0));
  const credit = round(rows.reduce((sum, row) => sum + row.credit, 0));
  document.getElementById("voucherCount").textContent = rows.length;
  document.getElementById("voucherDebitSum").textContent = formatMoney(debit);
  document.getElementById("voucherCreditSum").textContent = formatMoney(credit);
  const balanceStatus = document.getElementById("voucherBalanceStatus");
  balanceStatus.textContent = debit === credit ? "借贷平衡" : "存在差额";
  balanceStatus.className = debit === credit ? "text-success" : "text-danger";

  document.getElementById("voucherQueryRows").innerHTML = rows.map((row) => `
    <tr>
      <td><input class="voucher-select" type="checkbox" value="${row.no}" ${appState.selectedVoucherNos.has(row.no) ? "checked" : ""} aria-label="选择${row.no}"></td>
      <td>${row.date}</td>
      <td>${row.no}</td>
      <td>${row.summary}</td>
      <td>${row.subject}</td>
      <td>${formatMoney(row.debit)}</td>
      <td>${formatMoney(row.credit)}</td>
      <td>${statusDot(row.sign, "已签字", "待复核")}</td>
      <td>${statusDot(row.audit, "已审核", "待复核")}</td>
      <td>${statusDot(row.post, "已过账", "待复核")}</td>
      <td><span class="pill ${row.risk === "低" ? "low" : row.risk === "中" ? "mid" : "high"}">${row.risk}风险</span></td>
      <td>
        <button class="table-action" data-view-voucher="${row.no}">查看详情</button>
        <button class="table-action" data-preview-doc="${row.no}">附件</button>
        <button class="table-action" data-correct-voucher="${row.no}">更正</button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-view-voucher]").forEach((button) => {
    button.addEventListener("click", () => showVoucherDetail(button.dataset.viewVoucher));
  });
  document.querySelectorAll("[data-preview-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      renderDocumentPreview("invoice");
      showToast(`已定位 ${button.dataset.previewDoc} 的附件预览`);
    });
  });
  document.querySelectorAll("[data-correct-voucher]").forEach((button) => {
    button.addEventListener("click", () => selectVoucherForCorrection(button.dataset.correctVoucher));
  });
  document.querySelectorAll(".voucher-select").forEach((input) => {
    input.addEventListener("change", () => {
      toggleVoucherSelection(input.value, input.checked);
      updateSelectedVoucherCount();
    });
  });
  updateSelectedVoucherCount();
}

function statusDot(done, doneText, pendingText) {
  return `<span class="status-dot ${done ? "done" : "pending"}">${done ? doneText : pendingText}</span>`;
}

function toggleVoucherSelection(no, checked) {
  if (checked) appState.selectedVoucherNos.add(no);
  else appState.selectedVoucherNos.delete(no);
}

function updateSelectedVoucherCount() {
  const countNode = document.getElementById("selectedVoucherCount");
  if (countNode) countNode.textContent = `${appState.selectedVoucherNos.size}张`;
  const all = Array.from(document.querySelectorAll(".voucher-select"));
  const selectAll = document.getElementById("selectAllVouchers");
  if (selectAll) {
    selectAll.checked = all.length > 0 && all.every((input) => input.checked);
    selectAll.indeterminate = all.some((input) => input.checked) && !selectAll.checked;
  }
}

function batchProcessSelectedVouchers(action) {
  const selected = Array.from(appState.selectedVoucherNos);
  if (!selected.length) {
    showToast("请先勾选需要处理的凭证");
    return;
  }
  const permissionMap = { cashierSign: "cashierSign", audit: "post", post: "post" };
  if (!ensurePermission(permissionMap[action])) return;

  let processed = 0;
  const rows = getVoucherQueryData();
  selected.forEach((no) => {
    const row = rows.find((item) => item.no === no);
    if (!row) return;
    const current = appState.voucherStatusOverrides[no] || { sign: row.sign, audit: row.audit, post: row.post };
    if (action === "cashierSign" && !current.post) {
      current.sign = true;
      processed += 1;
    }
    if (action === "audit" && current.sign && !current.post) {
      current.audit = true;
      processed += 1;
    }
    if (action === "post" && current.sign && current.audit && !current.post) {
      current.post = true;
      processed += 1;
    }
    appState.voucherStatusOverrides[no] = current;
  });

  if (!processed) {
    const message = action === "cashierSign" ? "选中凭证无需签字或已过账" : action === "audit" ? "选中凭证需先出纳签字，或已过账" : "选中凭证需先签字并审核";
    showToast(message);
    return;
  }

  if (action === "cashierSign") appState.workflow.cashierSigned = true;
  if (action === "audit" || action === "post") appState.workflow.posted = true;
  updateWorkflowUI();
  renderVoucherQuery();
  renderLedger(document.querySelector(".ledger-tab.active")?.dataset.ledger || "general");
  appendCorrectionLog(`批量处理凭证：${selected.join("、")}，操作为${action === "cashierSign" ? "出纳签字" : action === "audit" ? "主管审核" : "主管过账"}，成功 ${processed} 张。`);
  showToast(`已处理选中凭证 ${processed} 张`);
}

function showVoucherDetail(no) {
  const row = getVoucherQueryData().find((item) => item.no === no);
  if (!row) return;
  const detailRows = (row.lines || [{ summary: row.summary, subject: row.subject, debit: row.debit, credit: row.credit }]).map((line) => `
    <tr>
      <td>${line.summary}</td>
      <td>${line.subject}</td>
      <td>${line.debit ? formatMoney(line.debit) : ""}</td>
      <td>${line.credit ? formatMoney(line.credit) : ""}</td>
    </tr>
  `).join("");
  const balanced = round(row.debit - row.credit) === 0;
  openModal("凭证查看详情", `
    <div class="modal-voucher">
      <h4>${appState.companyName} 记账凭证</h4>
      <p>日期：${row.date}　凭证号：${row.no}</p>
      <table>
        <thead><tr><th>摘要</th><th>会计科目</th><th>借方金额</th><th>贷方金额</th></tr></thead>
        <tbody>${detailRows}<tr class="total-row"><td colspan="2">合计</td><td>${formatMoney(row.debit)}</td><td>${formatMoney(row.credit)}</td></tr></tbody>
      </table>
      <p><strong>附件预览：</strong>发票、银行回单、合同、报销单均已建立结构化索引。</p>
      <p><strong>AI审核意见：</strong>${row.risk === "低" ? "凭证借贷平衡，税额和现金流量项目匹配合理。" : "凭证需人工复核附件完整性和四单金额一致性。"}</p>
      <p><strong>借贷是否平衡：</strong>${balanced ? "借贷平衡" : "存在差额，需复核"}</p>
      <p><strong>风险等级：</strong>${row.risk}风险</p>
      <p><strong>现金流量项目建议：</strong>${row.summary.includes("销售") ? "销售商品、提供劳务收到的现金" : row.summary.includes("采购") ? "购买商品、接受劳务支付的现金" : "支付其他与经营活动有关的现金"}</p>
    </div>
  `);
}

function selectVoucherForCorrection(no) {
  const row = getVoucherQueryData().find((item) => item.no === no);
  if (!row) return;
  appState.selectedCorrectionVoucher = no;
  const status = appState.workflow.periodClosed ? "已结账" : row.post ? "已过账" : row.audit ? "已审核未过账" : row.sign ? "已签字未审核" : "未审核";
  const advice = getCorrectionAdvice(status);
  document.getElementById("selectedVoucherNo").textContent = row.no;
  document.getElementById("selectedVoucherSummary").textContent = row.summary;
  const statusNode = document.getElementById("selectedVoucherStatus");
  statusNode.textContent = status;
  statusNode.className = status === "未审核" ? "text-success" : status === "已结账" ? "text-danger" : "text-warning";
  document.getElementById("selectedCorrectionAdvice").textContent = advice;
  document.getElementById("selectedVoucherPanel").classList.add("selected");
  appendCorrectionLog(`选择待更正凭证 ${row.no}：${row.summary}。系统判断状态为“${status}”，推荐处理方式：${advice}`);
  document.querySelector(".correction-center")?.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(`已选择 ${row.no} 进入凭证更正中心`);
}

function getCorrectionAdvice(status) {
  if (status === "未审核" || status === "已签字未审核") return "可重新识别、重新生成分录并保存修改";
  if (status === "已审核未过账") return "需会计主管退回审核后再修改";
  if (status === "已过账") return "禁止直接修改，建议红字冲销后录入正确凭证，或编制更正分录";
  if (status === "已结账") return "需先反结账，再按权限执行退回、冲销或更正分录";
  return "请根据凭证状态选择处理方式";
}

function handleCorrectionAction(action) {
  const actionMap = {
    recognize: {
      message: "重新识别完成：系统确认该业务为产品推广活动，原管理费用科目疑似错误。",
      log: "执行重新识别：AI重新读取业务摘要、发票项目和费用用途，识别为产品推广活动。"
    },
    regenerate: {
      message: "重新生成分录完成：建议借记销售费用--广告宣传费。",
      log: "执行重新生成分录：系统生成建议分录，但因原凭证已过账，不直接覆盖原凭证。"
    },
    return: {
      message: "主管退回已记录：仅适用于已审核未过账凭证。",
      log: "会计主管执行退回审核：系统提示该演示凭证已过账，不能直接退回修改，应走红字冲销或更正分录。"
    },
    red: {
      target: "redVoucherResult",
      message: "红字冲销凭证已生成。",
      log: "生成红字冲销凭证：保留原错误凭证，并以负数金额冲销原管理费用、进项税额和银行存款记录。"
    },
    correct: {
      target: "correctVoucherResult",
      message: "正确凭证已生成。",
      log: "生成正确凭证：借记销售费用--广告宣传费，进项税额保持可抵扣，贷记银行存款。"
    },
    adjust: {
      target: "adjustVoucherResult",
      message: "更正分录已生成。",
      log: "生成更正分录：借记销售费用--广告宣传费，贷记管理费用--广告费，仅调整费用结构。"
    },
    repost: {
      message: "重新过账完成：更正凭证已写入模拟账簿。",
      log: "重新过账：系统将更正凭证写入模拟账簿，并保留操作人、时间和更正原因。"
    },
    report: {
      target: "reportUpdateResult",
      message: "重新生成报表完成，勾稽关系校验通过。",
      log: "重新生成报表：科目余额、利润表费用结构和智能分析指标已更新，勾稽关系校验通过。"
    }
  };
  const config = actionMap[action];
  if (!config) return;

  if (action === "report") {
    applyCorrectionToData("重新生成报表");
    generateReportsFromVouchers();
    renderLedger(document.querySelector(".ledger-tab.active")?.dataset.ledger || "general");
  }

  if (["correct", "adjust", "repost"].includes(action)) {
    applyCorrectionToData(config.message);
  }

  if (config.target) {
    document.getElementById(config.target)?.classList.remove("hidden");
  }
  appendCorrectionLog(config.log);
  showToast(config.message);
}

function applyCorrectionToData(reason = "更正广告费科目") {
  if (!appState.correctionApplied) {
    appState.correctionApplied = true;
    appendDataVersion(reason);
  }
  refreshLinkedDataViews();
}

function refreshLinkedDataViews() {
  renderVoucherQuery();
  renderLedger(document.querySelector(".ledger-tab.active")?.dataset.ledger || "general");
  generateReportsFromVouchers();
  if (chartsReady || document.getElementById("analysis").classList.contains("active")) {
    resetCharts();
    setTimeout(initCharts, 60);
  }
}

function appendDataVersion(reason) {
  appState.dataVersionMinor += 1;
  const rows = document.getElementById("dataVersionRows");
  if (!rows) return;
  const tr = document.createElement("tr");
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  tr.innerHTML = `<td>V1.${appState.dataVersionMinor}</td><td>${time}</td><td>${reason}</td><td>${roleProfiles[appState.role].name}</td><td><span class="pill low">通过</span></td>`;
  rows.appendChild(tr);
}

function runDataRecalculation() {
  const button = document.getElementById("recalcDataBtn");
  const steps = Array.from(document.querySelectorAll("#recalcSteps div"));
  button.classList.add("loading");
  button.disabled = true;
  steps.forEach((step) => {
    step.classList.remove("done", "active");
    step.querySelector("strong").textContent = step.querySelector("strong").dataset.index || step.querySelector("strong").textContent.replace("✓", "");
  });

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add("active");
      if (index > 0) steps[index - 1].classList.remove("active");
      step.classList.add("done");
      step.querySelector("strong").dataset.index = String(index + 1);
      step.querySelector("strong").textContent = "✓";

      if (index === steps.length - 1) {
        appState.correctionApplied = true;
        refreshLinkedDataViews();
        renderRecalcComparison();
        renderRecalcChecks();
        appendCorrectionLog("数据重算完成：凭证汇总、科目余额、三大报表和智能分析指标已同步更新。");
        appendDataVersion("数据更新与重算");
        button.classList.remove("loading");
        button.disabled = false;
        document.getElementById("recalcCompareStatus").textContent = "已更新";
        document.getElementById("recalcCompareStatus").className = "tag success";
        document.getElementById("recalcCheckStatus").textContent = "校验通过";
        document.getElementById("recalcCheckStatus").className = "tag success";
        showToast("数据更新完成，勾稽关系校验通过");
      }
    }, 260 * (index + 1));
  });
}

function renderRecalcComparison() {
  const rows = [
    ["销售费用", "144,425.56", "156,425.56", "+12,000.00", "广告费更正后计入销售费用，影响利润表期间费用。"],
    ["管理费用", "288,600.00", "276,600.00", "-12,000.00", "原错误计入管理费用的广告费已转出。"],
    ["净利润", "-304,406.51", "-292,406.51", "+12,000.00", "费用重分类后利润表结构更准确。"]
  ];
  document.getElementById("recalcCompareRows").innerHTML = rows.map((row) => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td class="${row[3].startsWith("+") ? "text-success" : "text-danger"}">${row[3]}</td>
      <td>${row[4]}</td>
    </tr>
  `).join("");
}

function renderRecalcChecks() {
  const checks = [
    "借方合计 = 贷方合计：通过",
    "资产总计 = 负债和所有者权益总计：通过",
    "利润表净利润已同步智能分析：通过",
    "现金流量表期末现金已同步资产负债表货币资金：通过"
  ];
  document.getElementById("recalcCheckList").innerHTML = checks.map((item) => `
    <p><span class="status-dot done">✓</span> ${item}</p>
  `).join("");
}

function appendCorrectionLog(text) {
  const log = document.getElementById("correctionLog");
  if (!log) return;
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  item.textContent = `${time} ${roleProfiles[appState.role].name}：${text}`;
  log.appendChild(item);
}

function renderDocumentPreview(type) {
  const doc = documentTemplates[type] || documentTemplates.invoice;
  document.getElementById("documentPreview").innerHTML = `
    <div class="doc-paper">
      <span class="doc-badge">AI识别</span>
      <h4>${doc[0]}</h4>
      <p>${doc[1]}</p>
      <p>${doc[2]}</p>
      <p>${doc[3]}</p>
      <p>关联企业：${appState.companyName}</p>
    </div>
    <div class="doc-insight">
      <strong>校验结论</strong>
      <p>系统以字段结构化结果展示附件，不复制原始实训平台界面。当前附件与凭证金额一致，可作为审核、过账和结账依据。</p>
    </div>
  `;
}

function renderLedger(type = "general") {
  const view = type === "close" ? getCloseLedgerView() : buildLedgerView(type);
  const unified = calculateUnifiedData();
  const diff = round(unified.totalDebit - unified.totalCredit);
  document.getElementById("ledgerTrialDebit").textContent = formatMoney(unified.totalDebit);
  document.getElementById("ledgerTrialCredit").textContent = formatMoney(unified.totalCredit);
  document.getElementById("ledgerTrialDiff").textContent = formatMoney(diff);
  const trialStatus = document.getElementById("ledgerTrialStatus");
  trialStatus.textContent = diff === 0 ? "试算平衡通过" : "试算不平衡";
  trialStatus.className = diff === 0 ? "text-success" : "text-danger";
  document.getElementById("ledgerHead").innerHTML = `<tr>${view.head.map((item) => `<th>${item}</th>`).join("")}</tr>`;
  document.getElementById("ledgerRows").innerHTML = view.rows.map((row) => `
    <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>
  `).join("");
}

function buildLedgerView(type = "general") {
  const unified = calculateUnifiedData();
  const subjects = Object.values(unified.subjects)
    .filter((item) => item.opening || item.debit || item.credit || item.ending)
    .sort((a, b) => String(a.code).localeCompare(String(b.code)));

  if (type === "detail") {
    return {
      head: ["日期", "凭证号", "摘要", "会计科目", "借方金额", "贷方金额", "状态"],
      rows: getAllVouchers().flatMap((voucher) => voucher.lines.map((line) => [
        voucher.date,
        voucher.no,
        line.summary,
        line.subject,
        line.debit ? formatMoney(line.debit) : "",
        line.credit ? formatMoney(line.credit) : "",
        voucher.post ? "已过账" : voucher.audit ? "待过账" : "待复核"
      ]))
    };
  }

  if (type === "balance") {
    return {
      head: ["科目", "期初借方", "期初贷方", "本期借方", "本期贷方", "期末借方", "期末贷方"],
      rows: subjects.map((item) => [
        item.name,
        item.opening > 0 ? formatMoney(item.opening) : "",
        item.opening < 0 ? formatMoney(Math.abs(item.opening)) : "",
        item.debit ? formatMoney(item.debit) : "",
        item.credit ? formatMoney(item.credit) : "",
        item.debitBalance ? formatMoney(item.debitBalance) : "",
        item.creditBalance ? formatMoney(item.creditBalance) : ""
      ])
    };
  }

  if (type === "trial") {
    const openingDebit = round(subjects.reduce((sum, item) => sum + (item.opening > 0 ? item.opening : 0), 0));
    const openingCredit = round(subjects.reduce((sum, item) => sum + (item.opening < 0 ? Math.abs(item.opening) : 0), 0));
    const endingDebit = round(subjects.reduce((sum, item) => sum + item.debitBalance, 0));
    const endingCredit = round(subjects.reduce((sum, item) => sum + item.creditBalance, 0));
    return {
      head: ["项目", "借方金额", "贷方金额", "差额", "结果"],
      rows: [
        ["期初余额试算", formatMoney(openingDebit), formatMoney(openingCredit), formatMoney(round(openingDebit - openingCredit)), round(openingDebit - openingCredit) === 0 ? "试算平衡通过" : "需复核"],
        ["本期发生额试算", formatMoney(unified.totalDebit), formatMoney(unified.totalCredit), formatMoney(round(unified.totalDebit - unified.totalCredit)), round(unified.totalDebit - unified.totalCredit) === 0 ? "试算平衡通过" : "需复核"],
        ["期末余额试算", formatMoney(endingDebit), formatMoney(endingCredit), formatMoney(round(endingDebit - endingCredit)), round(endingDebit - endingCredit) === 0 ? "试算平衡通过" : "需复核"]
      ]
    };
  }

  return {
    head: ["科目编码", "科目名称", "期初余额", "本期借方", "本期贷方", "期末余额"],
    rows: subjects.map((item) => [
      item.code || "-",
      item.name,
      formatMoney(item.opening),
      formatMoney(item.debit),
      formatMoney(item.credit),
      formatMoney(item.ending)
    ])
  };
}

function getCloseLedgerView() {
  return {
    ...ledgerViews.close,
    rows: [
      ["2022年12月", "出纳签字", "出纳", appState.workflow.cashierSigned ? "已完成" : "待处理", "09:10"],
      ["2022年12月", "主管审核过账", "会计主管", appState.workflow.posted ? "已完成" : "待处理", "09:18"],
      ["2022年12月", "会计结转损益", "会计", appState.workflow.profitClosed ? "已完成" : "待处理", "09:26"],
      ["2022年12月", "主管结账生成报表", "会计主管", appState.workflow.periodClosed ? "已完成" : "待处理", "09:35"]
    ]
  };
}

function applyRole() {
  const profile = roleProfiles[appState.role];
  roleName.textContent = profile.name;
  roleAvatar.textContent = profile.avatar;
  document.getElementById("dashboardRole").textContent = profile.name;
  document.getElementById("rolePermissionText").textContent = profile.permission;
  applyPermissionState();
  updateWorkflowUI();
}

function applyCompanySettings() {
  document.querySelectorAll("[data-company-name]").forEach((node) => {
    node.textContent = appState.companyName;
  });
  document.getElementById("reportPeriod").textContent = appState.period;
  document.getElementById("periodStatus").textContent = `${appState.period}会计期间已启用`;
}

function updateProgress() {
  taskProgress.textContent = `${appState.progress}%`;
  progressBar.style.width = `${appState.progress}%`;
}

function setProgress(value) {
  appState.progress = Math.max(appState.progress, value);
  updateProgress();
}

function ensurePermission(action) {
  if (roleProfiles[appState.role].actions.includes(action)) return true;
  showToast(`${roleProfiles[appState.role].name}无权执行此操作`);
  return false;
}

function applyPermissionState() {
  const rules = [
    ["audit", '[data-action="audit"], #auditReportBtn'],
    ["entry", '[data-action="entry"]'],
    ["report", '[data-action="report"], #submitTaskBtn'],
    ["cashierSign", '[data-workflow="cashierSign"]'],
    ["post", '[data-workflow="post"]'],
    ["closeProfit", '[data-workflow="closeProfit"]'],
    ["closePeriod", '[data-workflow="closePeriod"]'],
    ["export", '#exportWordBtn, #exportExcelBtn, #downloadReportExcelBtn, #downloadPdfBtn, #printBtn, #ledgerExportBtn']
  ];

  rules.forEach(([action, selector]) => {
    document.querySelectorAll(selector).forEach((button) => {
      const allowed = roleProfiles[appState.role].actions.includes(action);
      button.classList.toggle("permission-disabled", !allowed);
      button.title = allowed ? "" : `${roleProfiles[appState.role].name}无权执行`;
    });
  });
}

function runWorkflowAction(button) {
  const action = button.dataset.workflow;
  const permissionMap = {
    cashierSign: "cashierSign",
    post: "post",
    closeProfit: "closeProfit",
    closePeriod: "closePeriod"
  };
  if (!ensurePermission(permissionMap[action])) return;

  if (action === "cashierSign") {
    batchProcessSelectedVouchers("cashierSign");
    return;
  }

  if (action === "post") {
    batchProcessSelectedVouchers("audit");
    batchProcessSelectedVouchers("post");
    return;
  }

  const blocked = getWorkflowBlockReason(action);
  if (blocked) {
    showToast(blocked);
    return;
  }

  const originalText = button.textContent;
  button.classList.add("loading");
  button.disabled = true;
  showToast("正在执行岗位流程...");

  setTimeout(() => {
    button.classList.remove("loading");
    button.disabled = false;
    button.textContent = originalText;
    completeWorkflowAction(action);
  }, 800);
}

function getWorkflowBlockReason(action) {
  const workflow = appState.workflow;
  if (action === "post" && !workflow.cashierSigned) return "请先由出纳完成签字";
  if (action === "closeProfit" && !workflow.posted) return "请先由会计主管审核过账";
  if (action === "closePeriod" && !workflow.profitClosed) return "请先由会计完成结转损益";
  return "";
}

function completeWorkflowAction(action) {
  const messages = {
    cashierSign: "出纳已签字确认，收付款附件进入主管审核环节",
    post: "会计主管已审核过账，凭证数据写入本期账簿",
    closeProfit: "会计已完成损益结转，收入费用类科目转入本年利润",
    closePeriod: "会计主管已结账，三大财务报表已正式生成"
  };
  const progressMap = { cashierSign: 78, post: 84, closeProfit: 92, closePeriod: 100 };

  if (action === "cashierSign") appState.workflow.cashierSigned = true;
  if (action === "post") appState.workflow.posted = true;
  if (action === "closeProfit") appState.workflow.profitClosed = true;
  if (action === "closePeriod") {
    appState.workflow.periodClosed = true;
    generateReportsFromVouchers();
  }

  setProgress(progressMap[action]);
  updateWorkflowUI();
  renderVoucherQuery();
  renderLedger(document.querySelector(".ledger-tab.active")?.dataset.ledger || "general");
  showToast(messages[action]);
}

function updateWorkflowUI() {
  const workflow = appState.workflow;
  const steps = [
    ["cashierSignStep", "cashierSignStatus", workflow.cashierSigned, "已签字", "待签字"],
    ["postingStep", "postingStatus", workflow.posted, "已过账", "待过账"],
    ["profitCloseStep", "profitCloseStatus", workflow.profitClosed, "已结转", "待结转"],
    ["periodCloseStep", "periodCloseStatus", workflow.periodClosed, "已结账", "待结账"]
  ];

  steps.forEach(([stepId, statusId, done, doneText, pendingText]) => {
    const step = document.getElementById(stepId);
    const status = document.getElementById(statusId);
    if (!step || !status) return;
    step.classList.toggle("done", done);
    status.textContent = done ? doneText : pendingText;
  });

  const message = document.getElementById("workflowMessage");
  if (!message) return;
  if (!workflow.cashierSigned) message.textContent = "当前状态：请先切换到“出纳”角色，完成出纳签字。";
  else if (!workflow.posted) message.textContent = "当前状态：请切换到“会计主管”角色，审核凭证并过账。";
  else if (!workflow.profitClosed) message.textContent = "当前状态：请切换到“会计”角色，执行结转损益。";
  else if (!workflow.periodClosed) message.textContent = "当前状态：请切换到“会计主管”角色，结账并生成正式财务报表。";
  else message.textContent = "当前状态：本期已完成结账，财务报表可下载、打印和提交。";
}

function upsertVoucher(voucher) {
  const index = appState.vouchers.findIndex((item) => item.no === voucher.no);
  if (index >= 0) {
    appState.vouchers[index] = voucher;
  } else {
    appState.vouchers.push(voucher);
  }
}

function describeReportImpact(voucher) {
  const impacts = new Set();
  voucher.rows.forEach((row) => {
    const subject = row.subject;
    if (subject.includes("银行存款") || subject.includes("库存现金")) impacts.add("货币资金");
    if (subject.includes("销售费用")) impacts.add("销售费用");
    if (subject.includes("管理费用")) impacts.add("管理费用");
    if (subject.includes("制造费用") || subject.includes("原材料")) impacts.add("存货/营业成本");
    if (subject.includes("材料采购")) impacts.add("存货/材料采购");
    if (subject.includes("投资收益")) impacts.add("投资收益");
    if (subject.includes("固定资产清理")) impacts.add("资产处置");
    if (subject.includes("主营业务收入")) impacts.add("营业收入");
    if (subject.includes("应交税费")) impacts.add("应交税费");
    if (subject.includes("短期借款") || subject.includes("长期借款")) impacts.add("负债");
  });
  return Array.from(impacts).join("、") || "科目余额表";
}

function generateReportsFromVouchers() {
  const unified = calculateUnifiedData();
  const report = unified.report;
  renderBalanceReport(report);
  renderProfitReport(report);
  renderCashflowReport(report);
  renderReconcileChecks(unified);
  renderAnalysisFromData(unified);
}

function calculateReportFromVouchers() {
  return calculateUnifiedData().report;
}

function renderBalanceReport(report) {
  document.querySelector("#balanceReport thead").innerHTML = `<tr><th>资产项目</th><th>期末余额</th><th>负债和所有者权益项目</th><th>期末余额</th></tr>`;
  document.querySelector("#balanceReport tbody").innerHTML = `
    <tr class="report-title-row"><td colspan="4">资产负债表</td></tr>
    <tr class="report-subtitle-row"><td colspan="2">编制单位：${appState.companyName}</td><td>会计期间：${appState.period}</td><td>单位：元</td></tr>
    <tr><td>货币资金</td><td>${formatMoney(report.cash)}</td><td>短期借款</td><td>${formatMoney(report.shortLoan)}</td></tr>
    <tr><td>应收票据</td><td>${formatMoney(report.notesReceivable)}</td><td>应付票据</td><td>${formatMoney(report.notesPayable)}</td></tr>
    <tr><td>应收账款</td><td>${formatMoney(report.accountsReceivable)}</td><td>应付账款</td><td>${formatMoney(report.accountsPayable)}</td></tr>
    <tr><td>预付款项</td><td>${formatMoney(report.prepayments)}</td><td>合同负债</td><td>${formatMoney(report.contractLiability)}</td></tr>
    <tr><td>存货</td><td>${formatMoney(report.inventory)}</td><td>应付职工薪酬</td><td>${formatMoney(report.salaryPayable)}</td></tr>
    <tr><td>其他流动资产</td><td>${formatMoney(report.otherCurrentAssets)}</td><td>应交税费</td><td>${formatMoney(report.taxesPayable)}</td></tr>
    <tr><td>流动资产合计</td><td>${formatMoney(report.cash + report.notesReceivable + report.accountsReceivable + report.prepayments + report.inventory + report.otherCurrentAssets)}</td><td>流动负债合计</td><td>${formatMoney(report.shortLoan + report.notesPayable + report.accountsPayable + report.contractLiability + report.salaryPayable + report.taxesPayable)}</td></tr>
    <tr><td>固定资产</td><td>${formatMoney(report.fixedAssets)}</td><td>长期借款</td><td>${formatMoney(report.longLoan)}</td></tr>
    <tr><td>无形资产</td><td>${formatMoney(report.intangibleAssets)}</td><td></td><td></td></tr>
    <tr><td>长期待摊费用</td><td>${formatMoney(report.longPrepaidExpense)}</td><td>负债合计</td><td>${formatMoney(report.liabilityTotal)}</td></tr>
    <tr><td>非流动资产合计</td><td>${formatMoney(report.nonCurrentAssets)}</td><td>所有者权益合计</td><td>${formatMoney(report.equity)}</td></tr>
    <tr class="total-row"><td>资产总计</td><td>${formatMoney(report.assetTotal)}</td><td>负债和所有者权益总计</td><td>${formatMoney(report.liabilityTotal + report.equity)}</td></tr>
  `;
}

function renderProfitReport(report) {
  document.querySelector("#profitReport thead").innerHTML = `<tr><th>项目</th><th>本月金额</th><th>本年累计金额</th></tr>`;
  document.querySelector("#profitReport tbody").innerHTML = `
    <tr class="report-title-row"><td colspan="3">利润表</td></tr>
    <tr class="report-subtitle-row"><td>编制单位：${appState.companyName}</td><td>会计期间：${appState.period}</td><td>单位：元</td></tr>
    <tr><td>一、营业收入</td><td>${formatMoney(report.revenue)}</td><td></td></tr>
    <tr><td>减：营业成本</td><td>${formatMoney(report.cost)}</td><td></td></tr>
    <tr><td>税金及附加</td><td>${formatMoney(report.taxAndSurcharge)}</td><td></td></tr>
    <tr><td>销售费用</td><td>${formatMoney(report.sellingExpense)}</td><td></td></tr>
    <tr><td>管理费用</td><td>${formatMoney(report.adminExpense)}</td><td></td></tr>
    <tr><td>财务费用</td><td>${formatMoney(report.financeExpense)}</td><td></td></tr>
    <tr><td>加：投资收益</td><td>${formatMoney(report.investmentIncome)}</td><td></td></tr>
    <tr><td>公允价值变动收益</td><td>${formatMoney(report.fairValueGain)}</td><td></td></tr>
    <tr><td>信用减值损失</td><td>${formatMoney(report.creditLoss)}</td><td></td></tr>
    <tr><td>资产减值损失</td><td>${formatMoney(report.impairmentLoss)}</td><td></td></tr>
    <tr><td>资产处置收益</td><td>${formatMoney(report.assetDisposalGain)}</td><td></td></tr>
    <tr><td>二、营业利润</td><td>${formatMoney(report.operatingProfit)}</td><td></td></tr>
    <tr><td>加：营业外收入</td><td>${formatMoney(report.nonOperatingIncome)}</td><td></td></tr>
    <tr><td>减：营业外支出</td><td>${formatMoney(report.nonOperatingExpense)}</td><td></td></tr>
    <tr><td>三、利润总额</td><td>${formatMoney(report.totalProfit)}</td><td></td></tr>
    <tr><td>减：所得税费用</td><td>${formatMoney(report.incomeTax)}</td><td></td></tr>
    <tr class="total-row"><td>四、净利润</td><td>${formatMoney(report.netProfit)}</td><td></td></tr>
  `;
}

function renderCashflowReport(report) {
  document.querySelector("#cashflowReport thead").innerHTML = `<tr><th>项目</th><th>本月金额</th><th>本年累计金额</th></tr>`;
  const otherOperatingCashOut = report.otherOperatingCashOut;
  const cashNetIncrease = report.cashNetIncrease;
  document.querySelector("#cashflowReport tbody").innerHTML = `
    <tr class="report-title-row"><td colspan="3">现金流量表</td></tr>
    <tr class="report-subtitle-row"><td>编制单位：${appState.companyName}</td><td>会计期间：${appState.period}</td><td>单位：元</td></tr>
    <tr><td>销售商品、提供劳务收到的现金</td><td>${formatMoney(report.salesCashIn)}</td><td></td></tr>
    <tr><td>经营活动现金流入小计</td><td>${formatMoney(report.operatingCashIn)}</td><td></td></tr>
    <tr><td>购买商品、接受劳务支付的现金</td><td>${formatMoney(report.purchaseCashOut)}</td><td></td></tr>
    <tr><td>支付给职工以及为职工支付的现金</td><td>${formatMoney(report.employeeCashOut)}</td><td></td></tr>
    <tr><td>支付的各项税费</td><td>${formatMoney(report.taxCashOut)}</td><td></td></tr>
    <tr><td>支付其他与经营活动有关的现金</td><td>${formatMoney(otherOperatingCashOut)}</td><td></td></tr>
    <tr><td>经营活动产生的现金流量净额</td><td>${formatMoney(report.operatingCashNet)}</td><td></td></tr>
    <tr><td>购建固定资产支付的现金</td><td>${formatMoney(Math.abs(report.investCashNet))}</td><td></td></tr>
    <tr><td>投资活动产生的现金流量净额</td><td>${formatMoney(report.investCashNet)}</td><td></td></tr>
    <tr><td>筹资活动产生的现金流量净额</td><td>${formatMoney(report.financingCashNet)}</td><td></td></tr>
    <tr><td>现金及现金等价物净增加额</td><td>${formatMoney(cashNetIncrease)}</td><td></td></tr>
    <tr class="total-row"><td>期末现金及现金等价物余额</td><td>${formatMoney(report.endingCashEquivalent)}</td><td></td></tr>
  `;
}

function renderReconcileChecks(unified) {
  const report = unified.report;
  const checks = [
    ["reconcileAssets", round(report.assetTotal - (report.liabilityTotal + report.equity)) === 0, "资产总计 = 负债和所有者权益总计"],
    ["reconcileTrial", round(unified.totalDebit - unified.totalCredit) === 0, "借方发生额 = 贷方发生额"],
    ["reconcileProfit", round(report.netProfit - calculateUnifiedData().report.netProfit) === 0, "利润表净利润 = 智能分析净利润来源"],
    ["reconcileCash", round(report.endingCashEquivalent - report.cash) === 0, "现金流量表期末现金 = 资产负债表货币资金"]
  ];
  checks.forEach(([id, pass, label]) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.innerHTML = `<span class="status-dot ${pass ? "done" : "pending"}">${pass ? "✓" : "!"}</span> ${label}：${pass ? "通过" : "异常"}`;
  });
}

function renderAnalysisFromData(unified) {
  const { report, indicators } = unified;
  const indicatorGrid = document.querySelector(".indicator-grid");
  if (!indicatorGrid) return;
  const indicatorRows = [
    ["资产负债率", `${indicators.debtRatio.toFixed(1)}%`, indicators.debtRatio < 45 ? "低" : indicators.debtRatio < 65 ? "中" : "高", `负债合计 ${formatMoney(report.liabilityTotal)} 元，资产总计 ${formatMoney(report.assetTotal)} 元，偿债基础较稳。`],
    ["毛利率", `${indicators.grossMargin.toFixed(1)}%`, indicators.grossMargin >= 30 ? "低" : indicators.grossMargin >= 15 ? "中" : "高", `营业收入 ${formatMoney(report.revenue)} 元，营业成本 ${formatMoney(report.cost)} 元，主营业务仍有较好毛利空间。`],
    ["净利率", `${indicators.netMargin.toFixed(1)}%`, indicators.netMargin >= 5 ? "低" : indicators.netMargin >= 0 ? "中" : "高", `净利润 ${formatMoney(report.netProfit)} 元，主要受期间费用、信用减值损失和所得税费用影响。`],
    ["应收账款周转率", indicators.arTurnover.toFixed(2), indicators.arTurnover >= 2 ? "低" : indicators.arTurnover >= 1 ? "中" : "高", `应收账款期末余额 ${formatMoney(report.accountsReceivable)} 元，建议加强客户信用和回款跟踪。`],
    ["存货周转率", indicators.inventoryTurnover.toFixed(2), indicators.inventoryTurnover >= 1 ? "低" : indicators.inventoryTurnover >= 0.5 ? "中" : "高", `存货余额 ${formatMoney(report.inventory)} 元，材料和库存占用资金仍需关注。`],
    ["经营现金流净额", formatMoney(indicators.operatingCashNet), indicators.operatingCashNet > 0 ? "低" : indicators.operatingCashNet > -100000 ? "中" : "高", `经营活动现金流为 ${formatMoney(indicators.operatingCashNet)} 元，能支撑本期日常经营支出。`]
  ];
  indicatorGrid.innerHTML = indicatorRows.map(([name, value, risk, explain]) => `
    <div><span>${name}</span><strong>${value}</strong><em class="pill ${risk === "低" ? "low" : risk === "中" ? "mid" : "high"}">${risk}风险</em><p>${explain}</p></div>
  `).join("");

  const diagnosis = document.querySelector(".diagnosis-grid");
  if (!diagnosis) return;
  diagnosis.innerHTML = `
    <article><h4>盈利能力分析</h4><p>结合北京明帆实训数据，本期营业收入为 ${formatMoney(report.revenue)} 元，毛利率 ${indicators.grossMargin.toFixed(1)}%。净利率为 ${indicators.netMargin.toFixed(1)}%，主要受期间费用、信用减值损失和所得税费用影响，建议加强费用预算控制并完善凭证审核流程。</p></article>
    <article><h4>偿债能力分析</h4><p>本期资产负债率为 ${indicators.debtRatio.toFixed(1)}%，整体负债水平可控。应交税费、应付账款和长期借款仍需按期监控，建议结合现金流预测设置付款预警。</p></article>
    <article><h4>营运能力分析</h4><p>应收账款周转率为 ${indicators.arTurnover.toFixed(2)}，存货周转率为 ${indicators.inventoryTurnover.toFixed(2)}。系统提示企业应加强销售回款、材料验收和库存领用管理，减少资金占用。</p></article>
    <article><h4>现金流分析</h4><p>经营活动现金流净额为 ${formatMoney(report.operatingCashNet)} 元，说明主营业务具备现金流支撑；投资活动现金流为 ${formatMoney(report.investCashNet)} 元，反映固定资产购建等支出对资金形成占用。</p></article>
    <article><h4>风险预警</h4><p>当前风险集中在四单匹配、附件完整性、税额抵扣合规性和岗位权限控制。系统通过AI审核评分、风险标签和角色权限限制，降低错账、漏账和越权操作风险。</p></article>
    <article><h4>改进建议</h4><p>建议维护会计科目、税率、现金流量项目和报表项目映射规则；对高风险凭证设置人工复核；期末严格执行出纳签字、主管审核过账、会计结转损益和主管结账流程。</p></article>
  `;
}

function buildGroupSummary() {
  return [
    "一、实训企业背景：本次小组报告以北京明帆股份有限公司为模拟对象，围绕2022年12月发生的销售收款、采购付款、费用报销、固定资产处置、税额抵扣和期末结账等业务，完成财会信息化系统环境下的账务处理与报表编制。",
    "二、会计账务处理流程：系统从原始凭证入手，对增值税专用发票、银行回单、报销单和合同进行结构化识别，再通过四单匹配检查金额、税额、交易对象和日期是否一致。在凭证审核通过后，系统自动生成会计分录，完成试算平衡，并按岗位流程执行出纳签字、主管审核过账、会计结转损益和主管结账生成报表。",
    "三、财务信息系统存在的问题：实训过程中可以发现，传统财务信息系统容易出现附件上传不完整、会计科目选择依赖人工经验、现金流量项目匹配口径不统一、岗位权限边界不清晰以及期末结账流程缺少过程控制等问题。这些问题会影响凭证质量、报表准确性和审计追溯效率。",
    "四、改进建议：从岗位权责看，应明确出纳、会计和会计主管的操作边界，形成制单、审核、过账、结账相互分离的控制机制；从流程管控看，应建立附件必传规则、四单匹配规则和高风险凭证人工复核规则；从系统设置看，应维护会计科目、税率、现金流量项目和报表项目映射表，保证凭证到账簿、报表的数据口径一致。",
    "五、AI工具价值：AI工具在本次实训中的价值主要体现在三个方面：一是辅助识别票据信息并提示附件缺失，提升凭证审核效率；二是根据业务描述自动生成分录并检查借贷平衡、税额和科目匹配，降低人工录入错误；三是将凭证数据汇总到账簿和三大财务报表，并输出财务诊断报告，为小组分析企业经营状况提供依据。"
  ].join("\n\n");
}

function handleAssistantQuestion() {
  const question = assistantInput.value.trim();
  if (!question) return;
  appendAssistantMessage(question, "user");
  assistantInput.value = "";
  setTimeout(() => {
    appendAssistantMessage(answerAssistantQuestion(question), "bot");
  }, 250);
}

function appendAssistantMessage(text, role) {
  const dialog = document.getElementById("assistantDialog");
  const message = document.createElement("div");
  message.className = `assistant-message ${role}`;
  message.textContent = text;
  dialog.appendChild(message);
  dialog.scrollTop = dialog.scrollHeight;
}

function answerAssistantQuestion(question) {
  const q = normalizeQuestion(question);
  const currentVoucher = appState.currentVoucher;
  const impact = currentVoucher ? describeReportImpact(currentVoucher) : "暂无当前凭证，请先在“AI生成分录”中生成一张凭证";
  const role = roleProfiles[appState.role].name;
  const inferredVoucher = looksLikeBusinessQuestion(question) ? buildVoucher(question) : null;

  if (assistantAnswers[question]) return assistantAnswers[question];

  if (containsAny(q, ["权限", "角色", "出纳", "会计", "主管", "岗位"])) {
    return `当前角色是${role}。系统按岗位分离控制流程：出纳负责收付款附件和出纳签字；会计负责生成分录、匹配现金流量项目并结转损益；会计主管负责审核凭证、审核过账、结账并生成正式报表。未完成前一步时，后续步骤会被系统拦截。`;
  }

  if (inferredVoucher && containsAny(q, ["分录", "怎么做", "处理", "生成", "会计"])) {
    return buildAssistantVoucherReply(inferredVoucher);
  }

  if (inferredVoucher && containsAny(q, ["分析", "影响", "成本", "利润", "报表", "经营"])) {
    return `这笔业务建议处理为：${summarizeVoucherRows(inferredVoucher)}。对报表的影响主要是${describeReportImpact(inferredVoucher)}；若包含可抵扣进项税，税额单独计入“应交税费--应交增值税（进项税额）”，不会计入成本费用。`;
  }

  if (inferredVoucher && containsAny(q, ["现金流", "现金流量", "项目"])) {
    return inferCashflowAnswer(question, inferredVoucher);
  }

  if (inferredVoucher && containsAny(q, ["税", "抵扣", "进项", "专票", "专用发票"])) {
    const taxRow = inferredVoucher.rows.find((row) => row.subject.includes("进项税额"));
    const taxText = taxRow ? `本业务识别到可抵扣进项税额 ${formatMoney(taxRow.debit)} 元，` : "本业务没有明确识别到可抵扣进项税额，";
    return `${taxText}取得增值税专用发票且用于企业应税经营项目时，进项税额可以单独借记“应交税费--应交增值税（进项税额）”，不并入费用或成本。`;
  }

  if (containsAny(q, ["税", "抵扣", "进项", "专票", "专用发票"])) {
    return "如果业务取得增值税专用发票，且用于企业应税经营项目，进项税额通常可以抵扣。系统会优先识别“进项税额”“价税合计”“不含税金额”等字段，把可抵扣税额计入“应交税费--应交增值税（进项税额）”，不计入成本费用。";
  }

  if (containsAny(q, ["现金流", "现金流量", "流量项目"])) {
    return assistantAnswers["现金流量项目怎么选？"];
  }

  if (containsAny(q, ["销售费用", "广告", "推广", "运输", "物流", "运费"])) {
    return assistantAnswers["这笔业务为什么计入销售费用？"];
  }

  if (containsAny(q, ["材料", "未入库", "尚未入库", "材料采购", "在途"])) {
    return assistantAnswers["材料未入库为什么记材料采购？"];
  }

  if (containsAny(q, ["固定资产", "清理", "处置设备", "出售设备"])) {
    return assistantAnswers["固定资产清理怎么处理？"];
  }

  if (containsAny(q, ["报表", "影响", "资产负债表", "利润表", "现金流量表"])) {
    return `当前凭证对报表的影响为：${impact}。生成报表时，系统会读取本期凭证流水，按科目映射更新资产负债表、利润表和现金流量表。`;
  }

  if (containsAny(q, ["分录", "怎么做", "账务处理", "会计处理", "凭证"])) {
    const targetVoucher = inferredVoucher || currentVoucher;
    if (targetVoucher) return buildAssistantVoucherReply(targetVoucher);
    return "你可以把完整业务描述粘贴给我，例如“支付运输服务费，取得增值税专用发票，价税合计6678元，其中进项税额378元，银行存款支付”。我会给出借贷分录、税额处理和现金流量项目。";
  }

  if (containsAny(q, ["四单", "匹配", "附件", "发票", "回单", "报销单", "合同"])) {
    return "四单匹配会核对发票金额、银行回单金额、报销单金额和合同金额。四者一致时显示匹配通过；如果金额不一致，系统会给出红色风险提示，并在审核评分中降低金额一致性分数。";
  }

  if (currentVoucher) {
    return `我先按当前凭证回答：${summarizeVoucherRows(currentVoucher)}。它影响${impact}，你也可以继续问“这笔税能不能抵扣”“现金流量项目是什么”或“对利润表有什么影响”。`;
  }

  return "我还没有识别到具体业务。你可以直接输入一整段业务描述，例如“支付设备维修费，取得增值税专用发票，价税合计8475元，其中进项税额975元，银行存款支付”，我会按财务 Agent 的方式给出分录、税额抵扣、现金流量项目和报表影响。";
}

function normalizeQuestion(text) {
  return text.replace(/\s+/g, "").replace(/[？?。！!,，、：:；;]/g, "");
}

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

function looksLikeBusinessQuestion(text) {
  const q = normalizeQuestion(text);
  return /\d+(?:,\d{3})*(?:\.\d{1,2})?元/.test(text) || containsAny(q, [
    "支付", "取得", "采购", "销售", "出售", "报销", "维修", "运输", "广告", "培训",
    "电费", "材料", "股票", "借款", "工资", "折旧", "银行存款", "库存现金"
  ]);
}

function summarizeVoucherRows(voucher) {
  return voucher.rows.map((row) => {
    const direction = row.debit ? "借" : "贷";
    const amount = row.debit || row.credit;
    return `${direction}：${row.subject} ${formatMoney(amount)}元`;
  }).join("；");
}

function buildAssistantVoucherReply(voucher) {
  const debit = round(voucher.rows.reduce((sum, row) => sum + (row.debit || 0), 0));
  const credit = round(voucher.rows.reduce((sum, row) => sum + (row.credit || 0), 0));
  const balance = debit === credit ? "借贷平衡" : `差额 ${formatMoney(round(debit - credit))} 元，需复核`;
  return [
    `建议会计分录：${summarizeVoucherRows(voucher)}。`,
    `试算结果：借方合计 ${formatMoney(debit)} 元，贷方合计 ${formatMoney(credit)} 元，${balance}。`,
    `AI解释：${voucher.explain.join(" ")}`
  ].join("\n");
}

function inferCashflowAnswer(text, voucher) {
  const q = normalizeQuestion(text);
  if (containsAny(q, ["采购", "材料", "货款"])) return "该业务现金流量项目建议列入“购买商品、接受劳务支付的现金”。";
  if (containsAny(q, ["工资", "薪酬", "培训"])) return "该业务现金流量项目建议列入“支付给职工以及为职工支付的现金”。";
  if (containsAny(q, ["销售", "收入", "收款"])) return "该业务现金流量项目建议列入“销售商品、提供劳务收到的现金”。";
  if (containsAny(q, ["固定资产", "股票", "投资"])) return "该业务更偏投资活动，应匹配处置资产或收回投资相关现金流量项目。";
  const hasCashPayment = voucher.rows.some((row) => (row.subject.includes("银行存款") || row.subject.includes("库存现金")) && row.credit);
  return hasCashPayment ? "该业务属于经营活动付款，现金流量项目建议列入“支付的其他与经营活动有关的现金”。" : "该业务暂未识别到现金收付，现金流量表通常不直接列示，需结合实际收付款确认。";
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modalBackdrop.classList.remove("hidden");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

function buildVoucherExportText() {
  const rows = Array.from(document.querySelectorAll("#voucherRows tr")).map((row) => {
    return Array.from(row.cells).map((cell) => cell.textContent.trim()).join("\t");
  }).join("\n");
  const explain = Array.from(document.querySelectorAll("#aiExplainList li")).map((li) => `- ${li.textContent.trim()}`).join("\n");
  return [
    `${appState.companyName}记账凭证`,
    `会计期间：${appState.period}`,
    document.getElementById("voucherNo").textContent,
    "摘要\t会计科目\t借方金额\t贷方金额",
    rows,
    `合计\t\t${document.getElementById("debitTotal").textContent}\t${document.getElementById("creditTotal").textContent}`,
    "",
    "AI解释",
    explain
  ].join("\n");
}

function downloadTextFile(filename, content) {
  downloadBlob(filename, content, "application/msword;charset=utf-8");
}

function downloadHtmlTable(filename, tableHtml) {
  const html = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <h3>${appState.companyName}</h3>
        <p>会计期间：${appState.period}</p>
        ${tableHtml}
      </body>
    </html>
  `;
  downloadBlob(filename, html, "application/vnd.ms-excel;charset=utf-8");
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

applyRole();
applyCompanySettings();
updateProgress();
updateFourWayMatch();
renderTicketPreviews();
generateReportsFromVouchers();
renderVoucherQuery();
renderLedger();
initLoginScreen();

let chartInstances = [];

function resetCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
  document.querySelectorAll(".chart-card canvas").forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  chartsReady = false;
}

function chartTextColor() {
  return document.body.classList.contains("dark") ? "#E5EDF7" : "#172033";
}

function gridColor() {
  return document.body.classList.contains("dark") ? "#25354C" : "#E2E8F0";
}

function initCharts() {
  if (!window.Chart) {
    initFallbackCharts();
    return;
  }

  const text = chartTextColor();
  const grid = gridColor();
  const unified = calculateUnifiedData();
  const report = unified.report;
  const indicators = unified.indicators;
  Chart.defaults.color = text;
  Chart.defaults.font.family = '"Microsoft YaHei", Arial, sans-serif';

  chartInstances.push(new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: ["7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: [{
        label: "营业收入",
        data: [198, 216, 238, 251, 269, Math.round(report.revenue / 10000)],
        borderColor: "#1E88E5",
        backgroundColor: "rgba(30, 136, 229, 0.14)",
        tension: 0.35,
        fill: true
      }]
    },
    options: chartOptions(grid)
  }));

  chartInstances.push(new Chart(document.getElementById("costChart"), {
    type: "doughnut",
    data: {
      labels: ["营业成本", "管理费用", "销售费用", "税金附加", "财务费用"],
      datasets: [{
        data: [
          round(report.cost / 10000),
          round(report.adminExpense / 10000),
          round(report.sellingExpense / 10000),
          round(report.taxAndSurcharge / 10000),
          round(Math.abs(report.financeExpense) / 10000)
        ],
        backgroundColor: ["#1E88E5", "#00B8D9", "#22C55E", "#F59E0B", "#EF4444"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  }));

  chartInstances.push(new Chart(document.getElementById("debtChart"), {
    type: "doughnut",
    data: {
      labels: ["负债", "所有者权益"],
      datasets: [{
        data: [round(report.liabilityTotal / 10000), round(report.equity / 10000)],
        circumference: 180,
        rotation: 270,
        backgroundColor: ["#F59E0B", "#E2E8F0"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}万元` } }
      }
    }
  }));

  chartInstances.push(new Chart(document.getElementById("cashChart"), {
    type: "bar",
    data: {
      labels: ["销售收款", "采购付款", "职工薪酬", "税费支付"],
      datasets: [
        { label: "现金流入", data: [round(report.salesCashIn / 10000), 0, 0, 0], backgroundColor: "#22C55E" },
        { label: "现金流出", data: [0, round(report.purchaseCashOut / 10000), round(report.employeeCashOut / 10000), round(report.taxCashOut / 10000)], backgroundColor: "#EF4444" }
      ]
    },
    options: chartOptions(grid)
  }));

  chartInstances.push(new Chart(document.getElementById("riskChart"), {
    type: "radar",
    data: {
      labels: ["附件完整性", "发票合规", "科目匹配", "金额一致", "权限控制", "报表平衡"],
      datasets: [{
        label: "风险评分",
        data: [85, 92, 88, 94, 90, round(100 - Math.min(40, Math.abs(indicators.netMargin)))],
        borderColor: "#1E88E5",
        backgroundColor: "rgba(30, 136, 229, 0.2)",
        pointBackgroundColor: "#00B8D9"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          grid: { color: grid },
          angleLines: { color: grid },
          pointLabels: { color: text }
        }
      }
    }
  }));

  chartsReady = true;
}

function initFallbackCharts() {
  const unified = calculateUnifiedData();
  const report = unified.report;
  drawLineChart("revenueChart", [198, 216, 238, 251, 269, Math.round(report.revenue / 10000)], ["7月", "8月", "9月", "10月", "11月", "12月"]);
  drawPieChart("costChart", [report.cost, report.adminExpense, report.sellingExpense, report.taxAndSurcharge, Math.abs(report.financeExpense)].map((value) => round(value / 10000)), ["#1E88E5", "#00B8D9", "#22C55E", "#F59E0B", "#EF4444"]);
  drawGaugeChart("debtChart", unified.indicators.debtRatio);
  drawBarChart("cashChart", [report.salesCashIn, report.purchaseCashOut, report.employeeCashOut, report.taxCashOut].map((value) => round(value / 10000)));
  drawRadarChart("riskChart", [85, 92, 88, 94, 90, round(100 - Math.min(40, Math.abs(unified.indicators.netMargin)))]);
  chartsReady = true;
}

function prepareCanvas(id) {
  const canvas = document.getElementById(id);
  const rect = canvas.parentElement.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width - 40) * ratio;
  canvas.height = 240 * ratio;
  canvas.style.height = "240px";
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = gridColor();
  ctx.fillStyle = chartTextColor();
  ctx.font = '12px "Microsoft YaHei", Arial';
  return { ctx, width: canvas.width / ratio, height: canvas.height / ratio };
}

function drawLineChart(id, data, labels) {
  const { ctx, width, height } = prepareCanvas(id);
  const pad = 34;
  const max = Math.max(...data) * 1.12;
  ctx.strokeStyle = gridColor();
  for (let i = 0; i < 4; i++) {
    const y = pad + i * ((height - pad * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#1E88E5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = pad + index * ((width - pad * 2) / (data.length - 1));
    const y = height - pad - (value / max) * (height - pad * 2);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = chartTextColor();
  labels.forEach((label, index) => {
    const x = pad + index * ((width - pad * 2) / (labels.length - 1));
    ctx.fillText(label, x - 10, height - 10);
  });
}

function drawPieChart(id, data, colors) {
  const { ctx, width, height } = prepareCanvas(id);
  const total = data.reduce((sum, item) => sum + item, 0);
  let start = -Math.PI / 2;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 74;
  data.forEach((value, index) => {
    const end = start + (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    start = end;
  });
  ctx.fillStyle = chartTextColor();
  ctx.fillText("成本费用结构", cx - 42, cy + radius + 28);
}

function drawGaugeChart(id, value) {
  const { ctx, width, height } = prepareCanvas(id);
  const cx = width / 2;
  const cy = height - 34;
  const radius = 82;
  ctx.lineWidth = 20;
  ctx.strokeStyle = gridColor();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, Math.PI + (value / 100) * Math.PI);
  ctx.stroke();
  ctx.fillStyle = chartTextColor();
  ctx.font = '700 28px "Microsoft YaHei", Arial';
  ctx.fillText(`${value}%`, cx - 28, cy - 18);
  ctx.font = '12px "Microsoft YaHei", Arial';
  ctx.fillText("资产负债率", cx - 34, cy + 18);
}

function drawBarChart(id, data) {
  const { ctx, width, height } = prepareCanvas(id);
  const labels = ["销售收款", "采购付款", "职工薪酬", "税费支付"];
  const max = Math.max(...data) * 1.12;
  const pad = 36;
  const barWidth = (width - pad * 2) / data.length * 0.48;
  data.forEach((value, index) => {
    const x = pad + index * ((width - pad * 2) / data.length) + 18;
    const barHeight = (value / max) * (height - pad * 2);
    ctx.fillStyle = index === 0 ? "#22C55E" : "#EF4444";
    ctx.fillRect(x, height - pad - barHeight, barWidth, barHeight);
    ctx.fillStyle = chartTextColor();
    ctx.fillText(labels[index], x - 8, height - 10);
  });
}

function drawRadarChart(id, data) {
  const { ctx, width, height } = prepareCanvas(id);
  const labels = ["附件", "发票", "科目", "金额", "权限", "平衡"];
  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = 82;
  const points = data.map((value, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / data.length);
    const r = radius * (value / 100);
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, angle };
  });
  ctx.strokeStyle = gridColor();
  for (let level = 1; level <= 4; level++) {
    ctx.beginPath();
    labels.forEach((_, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / labels.length);
      const r = radius * level / 4;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.beginPath();
  points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = "rgba(30, 136, 229, 0.22)";
  ctx.strokeStyle = "#1E88E5";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = chartTextColor();
  labels.forEach((label, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / labels.length);
    ctx.fillText(label, cx + Math.cos(angle) * (radius + 18) - 12, cy + Math.sin(angle) * (radius + 18) + 4);
  });
}

function chartOptions(grid) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { grid: { color: grid } },
      y: { grid: { color: grid }, beginAtZero: true }
    }
  };
}
