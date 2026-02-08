/**
 * Grade-based Question Generator
 * ONE entry point: generateQuestion(grade) → buildMathExpression(config)
 */

const GRADE_STORAGE_KEY = "number-path-runner-grade";
const OPERATION_STORAGE_KEY = "number-path-runner-operation";
const AVAILABLE_OPERATIONS = ["mixed", "add", "sub", "mul", "div", "fraction"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperandRange(max, ops, type) {
  if (type === "mul" || type === "div") {
    if (ops >= 4) return max >= 5000 ? 50 : max >= 1000 ? 40 : 30;
    if (ops >= 3) return max >= 5000 ? 40 : max >= 1000 ? 30 : 25;
    if (ops >= 2) return max >= 5000 ? 30 : max >= 1000 ? 24 : 20;
    return 12;
  }
  if (ops >= 4) return max >= 5000 ? 2000 : max >= 1000 ? 1200 : 700;
  if (ops >= 3) return max >= 5000 ? 1500 : max >= 1000 ? 900 : 500;
  if (ops >= 2) return max >= 5000 ? 900 : max >= 1000 ? 600 : 350;
  return max >= 500 ? 200 : 120;
}

function normalizeAnswer(value, allowDecimal) {
  const rounded = allowDecimal ? Math.round(value * 10) / 10 : Math.round(value);
  return Number.isFinite(rounded) ? rounded : value;
}

function buildGroupedExpression(parts, op, groupSize = 2) {
  const groups = [];
  for (let i = 0; i < parts.length; i += groupSize) {
    const slice = parts.slice(i, i + groupSize);
    groups.push(slice.length > 1 ? `(${slice.join(` ${op} `)})` : `${slice[0]}`);
  }
  return groups.join(` ${op} `);
}

export function getGrade() {
  try {
    const stored = localStorage.getItem(GRADE_STORAGE_KEY);
    const g = stored != null ? parseInt(stored, 10) : 5;
    return g >= 3 && g <= 7 ? g : 5;
  } catch {
    return 5;
  }
}

export function setGrade(grade) {
  try {
    localStorage.setItem(GRADE_STORAGE_KEY, String(grade));
  } catch {
    /* ignore */
  }
}

export function getOperation() {
  try {
    const stored = localStorage.getItem(OPERATION_STORAGE_KEY);
    return AVAILABLE_OPERATIONS.includes(stored) ? stored : "mixed";
  } catch {
    return "mixed";
  }
}

export function setOperation(operation) {
  try {
    localStorage.setItem(OPERATION_STORAGE_KEY, operation);
  } catch {
    /* ignore */
  }
}

function getDifficultyConfig(grade) {
  switch (grade) {
    case 3:
      return { max: 100, ops: 1, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 4:
      return { max: 500, ops: 2, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 5:
      return { max: 1000, ops: 3, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 6:
      return { max: 1000, ops: 3, allowNegative: true, allowDecimal: true, allowExponent: false, allowFractions: false };
    case 7:
      return { max: 5000, ops: 4, allowNegative: true, allowDecimal: true, allowExponent: true, allowFractions: true };
    default:
      return getDifficultyConfig(5);
  }
}

function randomExponent() {
  const base = randomInt(2, 12);
  const exp = randomInt(2, 3);
  return `${base}^${exp}`;
}

function randomFraction(maxDenom = 10) {
  const n = randomInt(1, Math.max(3, Math.floor(maxDenom * 0.8)));
  const d = randomInt(2, maxDenom);
  return `${n}/${d}`;
}

function buildMathExpression(config, operation) {
  const { max, ops, allowNegative, allowDecimal, allowExponent, allowFractions } = config;
  const cap = Math.min(max, ops >= 4 ? 500 : ops >= 3 ? 200 : ops >= 2 ? 100 : 50);
  const opCount = Math.max(1, ops);

  if (operation === "fraction") {
    const denomMax =
      ops >= 4 ? 20 : ops >= 3 ? 16 : ops >= 2 ? 12 : 10;
    const multiplierMax =
      ops >= 4 ? 25 : ops >= 3 ? 18 : ops >= 2 ? 12 : 10;
    const templates = [
      () => {
        const f1 = randomFraction(denomMax);
        const f2 = randomFraction(denomMax);
        const [n1, d1] = f1.split("/").map(Number);
        const [n2, d2] = f2.split("/").map(Number);
        const mult = d1 * d2;
        const sum = (n1 * d2 + n2 * d1) / mult;
        const v = sum * mult;
        if (v < 2) return null;
        return { q: `(${f1} + ${f2}) × ${mult}`, v: normalizeAnswer(v, true) };
      },
      () => {
        const f1 = randomFraction(denomMax);
        const f2 = randomFraction(denomMax);
        const [n1, d1] = f1.split("/").map(Number);
        const [n2, d2] = f2.split("/").map(Number);
        const mult = d1 * d2;
        const diff = (n1 * d2 - n2 * d1) / mult;
        const v = diff * mult;
        if (v < 2) return null;
        return { q: `(${f1} − ${f2}) × ${mult}`, v: normalizeAnswer(v, true) };
      },
      () => {
        const f = randomFraction(denomMax);
        const [n, d] = f.split("/").map(Number);
        const mult = randomInt(2, multiplierMax);
        return { q: `${f} × ${mult}`, v: normalizeAnswer((n * mult) / d, true) };
      },
      () => {
        const f = randomFraction(denomMax);
        const [n, d] = f.split("/").map(Number);
        const add = randomInt(5, multiplierMax);
        return { q: `${f} + ${add}`, v: normalizeAnswer(n / d + add, true) };
      },
      () => {
        const f1 = randomFraction(denomMax);
        const f2 = randomFraction(denomMax);
        const add = randomInt(5, multiplierMax);
        const [n1, d1] = f1.split("/").map(Number);
        const [n2, d2] = f2.split("/").map(Number);
        const mult = d1 * d2;
        const sum = (n1 * d2 + n2 * d1) / mult;
        const v = sum * mult + add;
        if (v < 2) return null;
        return { q: `(${f1} + ${f2}) × ${mult} + ${add}`, v: normalizeAnswer(v, true) };
      },
      () => {
        const f = randomFraction(denomMax);
        const mult = randomInt(2, multiplierMax);
        const sub = randomInt(2, multiplierMax);
        const [n, d] = f.split("/").map(Number);
        const v = (n * mult) / d - sub;
        if (v < 2) return null;
        return { q: `(${f} × ${mult}) − ${sub}`, v: normalizeAnswer(v, true) };
      },
    ];
    for (let i = 0; i < 15; i++) {
      const fn = templates[randomInt(0, templates.length - 1)];
      const r = fn();
      if (r && r.v >= 2 && r.v <= 500) {
        return { question: r.q, answer: normalizeAnswer(r.v, true) };
      }
    }
  }

  if (operation === "mixed") {
    // fall through to the original mixed-ops generator
  }

  if (operation === "add") {
    const count = Math.max(2, opCount);
    const high = Math.min(cap, getOperandRange(max, ops, "add"));
    const parts = Array.from({ length: count }, () => randomInt(1, high));
    const v = parts.reduce((sum, value) => sum + value, 0);
    const expr =
      count >= 4
        ? buildGroupedExpression(parts, "+", 2)
        : count >= 3
          ? buildGroupedExpression(parts, "+", 2)
          : parts.join(" + ");
    return { question: expr, answer: normalizeAnswer(v, allowDecimal) };
  }

  if (operation === "sub") {
    const count = Math.max(2, opCount);
    const high = Math.min(cap, getOperandRange(max, ops, "sub"));
    const parts = Array.from({ length: count }, () => randomInt(1, high));
    const v = parts.slice(1).reduce((sum, value) => sum - value, parts[0]);
    const expr =
      count >= 4
        ? `(${parts[0]} − ${parts[1]}) − (${parts[2]} − ${parts[3]})`
        : count >= 3
          ? `(${parts[0]} − ${parts[1]}) − ${parts[2]}`
          : parts.join(" − ");
    return { question: expr, answer: normalizeAnswer(v, allowDecimal) };
  }

  if (operation === "mul") {
    const count = Math.max(2, opCount);
    const high = getOperandRange(max, ops, "mul");
    const parts = Array.from({ length: count }, () => randomInt(2, high));
    const v = parts.reduce((prod, value) => prod * value, 1);
    const sign = Math.random() < 0.5 ? "+" : "−";
    const addA = randomInt(1, getOperandRange(max, ops, "add"));
    const addB = randomInt(1, getOperandRange(max, ops, "add"));
    const addValue = sign === "+" ? addA + addB : addA - addB;
    const withAdd =
      count >= 4
        ? `(${addA} ${sign} ${addB}) × ${parts[0]} × ${parts[1]}`
        : `(${addA} ${sign} ${addB}) × ${parts[0]}`;
    const expr =
      count >= 4
        ? withAdd
        : count >= 3
          ? withAdd
          : parts.join(" × ");
    const finalValue =
      count >= 4 ? addValue * parts[0] * parts[1] : addValue * parts[0];
    return { question: expr, answer: normalizeAnswer(finalValue, allowDecimal) };
  }

  if (operation === "div") {
    const count = Math.max(2, opCount);
    const high = getOperandRange(max, ops, "div");
    const divisor = randomInt(2, high);
    const q = randomInt(2, Math.floor(Math.min(cap, max) / divisor));
    const a = q * divisor;
    const rest = Array.from({ length: count - 1 }, () => randomInt(2, high));
    const expr = [a, divisor, ...rest].join(" / ");
    const v = rest.reduce((acc, value) => acc / value, a / divisor);
    const sign = Math.random() < 0.5 ? "+" : "−";
    const addA = randomInt(1, getOperandRange(max, ops, "add"));
    const addB = randomInt(1, getOperandRange(max, ops, "add"));
    const addValue = sign === "+" ? addA + addB : addA - addB;
    const baseDiv = a / divisor;
    const withAdd =
      count >= 4
        ? `(${addA} ${sign} ${addB}) / ${divisor} / ${rest[0]}`
        : `(${addA} ${sign} ${addB}) / ${divisor}`;
    const grouped =
      count >= 4
        ? withAdd
        : count >= 3
          ? withAdd
          : expr;
    const finalValue =
      count >= 4 ? addValue / divisor / rest[0] : addValue / divisor;
    return { question: grouped, answer: normalizeAnswer(finalValue, true) };
  }

  if (ops === 1) {
    const opList = ["+", "−", "×"];
    const op = opList[randomInt(0, 2)];
    const a = randomInt(1, cap);
    let b;
    if (op === "−") b = randomInt(0, a - 1);
    else if (op === "×") b = randomInt(1, 12);
    else b = randomInt(1, cap - a);
    const v = op === "+" ? a + b : op === "−" ? a - b : a * b;
    return { question: `${a} ${op} ${b}`, answer: normalizeAnswer(v, allowDecimal) };
  }

  if (ops === 2) {
    if (Math.random() < 0.5) {
      const d = randomInt(2, 12);
      const q = randomInt(1, Math.floor(cap / d));
      const a = q * d;
      const b = randomInt(1, 50);
      return {
        question: `(${a} / ${d}) + ${b}`,
        answer: normalizeAnswer(q + b, allowDecimal),
      };
    }
    const a = randomInt(1, 30);
    const b = randomInt(2, 10);
    const c = randomInt(1, 50);
    return { question: `${a} + ${b} × ${c}`, answer: normalizeAnswer(a + b * c, allowDecimal) };
  }

  if (ops === 3) {
    if (allowNegative && Math.random() < 0.4) {
      const a = randomInt(1, 30);
      const b = randomInt(2, 12);
      const c = randomInt(1, 20);
      const v = -a + b * c;
      return { question: `-${a} + ${b} × ${c}`, answer: normalizeAnswer(v, allowDecimal) };
    }
    if (allowDecimal && Math.random() < 0.4) {
      const w = randomInt(1, 15);
      const t = randomInt(1, 9);
      const b = randomInt(2, 6);
      const c = randomInt(1, 10);
      const v = w + t / 10 + b * c;
      return { question: `${w}.${t} + ${b} × ${c}`, answer: normalizeAnswer(v, true) };
    }
    if (Math.random() < 0.5) {
      const a = randomInt(50, cap);
      const b = randomInt(5, 30);
      const c = randomInt(2, 10);
      const d = randomInt(10, 60);
      const v = a - b * c + d;
      return { question: `${a} − ${b} × ${c} + ${d}`, answer: normalizeAnswer(v, allowDecimal) };
    }
    const a = randomInt(50, 150);
    const b = randomInt(2, 12);
    const c = randomInt(1, 50);
    const d = randomInt(2, 8);
    const v = Math.floor(a / b) + c * d;
    return { question: `(${a} / ${b}) + ${c} × ${d}`, answer: normalizeAnswer(v, allowDecimal) };
  }

  if (ops === 4 && allowExponent && allowFractions) {
    const templates = [
      () => {
        const f1 = randomFraction();
        const f2 = randomFraction();
        const [n1, d1] = f1.split("/").map(Number);
        const [n2, d2] = f2.split("/").map(Number);
        const mult = d1 * d2;
        const sum = (n1 * d2 + n2 * d1) / mult;
        const v = sum * mult;
        if (v < 2) return null;
        return { q: `(${f1} + ${f2}) × ${mult}`, v: normalizeAnswer(v, true) };
      },
      () => {
        const e1 = randomExponent();
        const e2 = randomExponent();
        const [b1, exp1] = e1.split("^").map(Number);
        const [b2, exp2] = e2.split("^").map(Number);
        const m = randomInt(2, 8);
        const d = randomInt(2, 6);
        const v = Math.pow(b1, exp1) + (Math.pow(b2, exp2) * m) / d;
        return { q: `${e1} + ${e2} × ${m} / ${d}`, v: normalizeAnswer(v, true) };
      },
      () => {
        const b = randomInt(2, 5);
        const sq = b * b;
        const sub = randomInt(1, sq - 1);
        const denom = sq - sub;
        const quo = randomInt(2, 12);
        const num = denom * quo;
        const add = randomInt(1, 15);
        return {
          q: `${num} / (${b}^2 − ${sub}) + ${add}`,
          v: normalizeAnswer(quo + add, true),
        };
      },
      () => {
        const e1 = randomExponent();
        const e2 = randomExponent();
        const [b1, exp1] = e1.split("^").map(Number);
        const [b2, exp2] = e2.split("^").map(Number);
        const add = randomInt(1, 25);
        return {
          q: `${e1} + ${e2} + ${add}`,
          v: normalizeAnswer(Math.pow(b1, exp1) + Math.pow(b2, exp2) + add, true),
        };
      },
    ];
    for (let i = 0; i < 15; i++) {
      const fn = templates[randomInt(0, templates.length - 1)];
      const r = fn();
      if (r && r.v >= 2 && r.v <= 500) {
        return { question: r.q, answer: normalizeAnswer(r.v, true) };
      }
    }
  }

  const a = randomInt(50, cap);
  const b = randomInt(5, 30);
  const c = randomInt(2, 10);
  const d = randomInt(10, 60);
  const v = a - b * c + d;
  return { question: `${a} − ${b} × ${c} + ${d}`, answer: normalizeAnswer(v, allowDecimal) };
}

export function generateQuestion(grade = getGrade()) {
  const config = getDifficultyConfig(grade);
  const operation = getOperation();
  const result = buildMathExpression(config, operation);
  const answer = result.answer;
  if (answer < 2 || answer > 999) return generateQuestion(grade);
  return { question: result.question, answer };
}

export function generateQuestions(count, grade = getGrade(), operation = getOperation()) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const config = getDifficultyConfig(grade);
    const result = buildMathExpression(config, operation);
    const answer = result.answer;
    if (answer < 2 || answer > 999) {
      i -= 1;
      continue;
    }
    out.push({ question: result.question, answer });
  }
  return out;
}
