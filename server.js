const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

const defaultState = {
  settings: {
    income: 8000,
    startTime: "09:00",
    endTime: "17:00",
    target: 5000,
    mode: "double",
    customDays: 22
  },
  goals: [
    { name: "奶茶徽章", price: 15, icon: "🥤", bg: "#fff4d8" },
    { name: "午饭补给", price: 30, icon: "🍱", bg: "#eaf6ff" },
    { name: "打车券", price: 50, icon: "🚕", bg: "#ffe6ef" },
    { name: "会员卡", price: 68, icon: "🎬", bg: "#e9fff6" },
    { name: "游戏补给", price: 198, icon: "🎮", bg: "#eef0ff" },
    { name: "漂亮衣服", price: 300, icon: "👕", bg: "#fff4d8" },
    { name: "房租堡垒", price: 3000, icon: "🏠", bg: "#eaf6ff" },
    { name: "旅行岛屿", price: 5000, icon: "🏝️", bg: "#ffe6ef" }
  ],
  updatedAt: null
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendText(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function normalizeTime(value, fallback) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value)) ? String(value) : fallback;
}

function normalizeGoal(goal) {
  const name = String(goal?.name || "").trim().slice(0, 40);
  const price = Math.max(1, Number(goal?.price) || 1);
  const icon = String(goal?.icon || "⭐").slice(0, 8);
  const bg = /^#[0-9a-f]{6}$/i.test(String(goal?.bg)) ? String(goal.bg) : "#fff4d8";
  return name ? { name, price, icon, bg } : null;
}

function normalizeState(input) {
  const settings = input?.settings || {};
  const mode = ["double", "bigSmall", "single", "custom"].includes(settings.mode)
    ? settings.mode
    : defaultState.settings.mode;
  const goals = Array.isArray(input?.goals)
    ? input.goals.map(normalizeGoal).filter(Boolean).slice(0, 40)
    : defaultState.goals;

  return {
    settings: {
      income: Math.max(0, Number(settings.income) || defaultState.settings.income),
      startTime: normalizeTime(settings.startTime, defaultState.settings.startTime),
      endTime: normalizeTime(settings.endTime, defaultState.settings.endTime),
      target: Math.max(1, Number(settings.target) || defaultState.settings.target),
      mode,
      customDays: Math.min(31, Math.max(1, Number(settings.customDays) || defaultState.settings.customDays))
    },
    goals: goals.length ? goals : defaultState.goals,
    updatedAt: new Date().toISOString()
  };
}

async function readState() {
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    return defaultState;
  }
}

async function writeState(state) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized = normalizeState(state);
  await fs.writeFile(STATE_FILE, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(ROOT, requestPath));

  if (!filePath.startsWith(ROOT) || filePath.startsWith(DATA_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  } catch (error) {
    sendText(res, 404, "Not found");
  }
}

async function handleRequest(req, res) {
  try {
    if (req.url === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.url === "/api/state" && req.method === "GET") {
      sendJson(res, 200, await readState());
      return;
    }

    if (req.url === "/api/state" && req.method === "PUT") {
      const raw = await readBody(req);
      const state = await writeState(JSON.parse(raw || "{}"));
      sendJson(res, 200, state);
      return;
    }

    if (req.url.startsWith("/api/")) {
      sendJson(res, 404, { error: "Unknown API endpoint" });
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendText(res, 405, "Method not allowed");
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: "Server error", detail: error.message });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Salary Second Arcade is running at http://localhost:${PORT}`);
});
