import express from "express";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const SESSIONS_DIR = path.join(process.cwd(), "sessions");

const sessions = new Map();
const pairingLocks = new Map();

app.use(express.json());
app.use(express.static(process.cwd()));

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function validPhone(phone) {
  return /^\d{8,15}$/.test(phone);
}

function getText(message) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    ""
  ).trim();
}

function menuText() {
  return `╭━━━〔 🤖 ROI ARKAN-MG 〕━━━╮

┃ 📋 MENU PRINCIPAL
┃
┃ 1️⃣ .menu
┃ 2️⃣ .ping
┃ 3️⃣ .help
┃
┃ ⚡ Bot la aktif!

╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}

async function startSession(phone) {
  await fs.mkdir(SESSIONS_DIR, { recursive: true });

  const authDir = path.join(SESSIONS_DIR, phone);

  const { state, saveCreds } =
    await useMultiFileAuthState(authDir);

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" })
  });

  const session = {
    phone,
    sock,
    state,
    connected: false,
    pairingCode: null
  };

  sessions.set(phone, session);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      session.connected = true;
      session.pairingCode = null;

      console.log(`✅ WhatsApp konekte: ${phone}`);
    }

    if (connection === "close") {
      session.connected = false;

      const code =
        lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log(`🔄 Rekoneksyon pou ${phone}...`);

        sessions.delete(phone);

        setTimeout(() => {
          startSession(phone).catch(console.error);
        }, 2000);
      } else {
        console.log(`🚪 WhatsApp dekonekte: ${phone}`);
        sessions.delete(phone);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;

      if (!jid || jid === "status@broadcast") continue;

      const text = getText(msg.message).toLowerCase();

      try {
        if (
          text === ".menu" ||
          text === "/menu" ||
          text === "menu"
        ) {
          await sock.sendMessage(jid, {
            text: menuText()
          });
        }

        if (
          text === ".ping" ||
          text === "/ping"
        ) {
          await sock.sendMessage(jid, {
            text: "🏓 Pong!\n\n🤖 ROI ARKAN-MG aktif."
          });
        }

        if (
          text === ".help" ||
          text === "/help"
        ) {
          await sock.sendMessage(jid, {
            text:
              "🤖 KÒMAND DISPONIB:\n\n" +
              "📋 .menu\n" +
              "🏓 .ping\n" +
              "❓ .help"
          });
        }
      } catch (error) {
        console.error("❌ Erè mesaj:", error);
      }
    }
  });

  return session;
}

async function getSession(phone) {
  let session = sessions.get(phone);

  if (session) {
    return session;
  }

  return await startSession(phone);
}

app.post("/api/pair", async (req, res) => {
  const phone = cleanPhone(req.body?.phone);

  if (!validPhone(phone)) {
    return res.status(400).json({
      ok: false,
      error:
        "Mete nimewo a ak kòd peyi a, san +, espas oswa tirè."
    });
  }

  if (pairingLocks.has(phone)) {
    return res.status(409).json({
      ok: false,
      error:
        "Gen yon koneksyon ki deja ap prepare. Tann kèk segond."
    });
  }

  pairingLocks.set(phone, true);

  try {
    const session = await getSession(phone);

    if (
      session.connected ||
      session.state.creds.registered
    ) {
      return res.json({
        ok: true,
        connected: true
      });
    }

    await new Promise(resolve =>
      setTimeout(resolve, 1000)
    );

    const code =
      await session.sock.requestPairingCode(phone);

    session.pairingCode = code;

    console.log(
      `🔐 Pairing Code pou ${phone}: ${code}`
    );

    return res.json({
      ok: true,
      connected: false,
      code
    });

  } catch (error) {

    console.error("❌ Pairing error:", error);

    return res.status(500).json({
      ok: false,
      error:
        "WhatsApp pa t kapab kreye kòd la. Eseye ankò."
    });

  } finally {
    pairingLocks.delete(phone);
  }
});

app.get("/api/status", (req, res) => {
  const phone = cleanPhone(req.query.phone);

  if (!validPhone(phone)) {
    return res.status(400).json({
      ok: false,
      error: "Nimewo a pa valab."
    });
  }

  const session = sessions.get(phone);

  res.json({
    ok: true,
    connected: Boolean(session?.connected)
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    bot: "ROI ARKAN-MG"
  });
});

async function boot() {
  await fs.mkdir(SESSIONS_DIR, {
    recursive: true
  });

  app.listen(PORT, () => {
    console.log(
      `🚀 ROI ARKAN-MG ap kouri sou port ${PORT}`
    );
  });
}

boot().catch(error => {
  console.error("❌ Server error:", error);
  process.exit(1);
});
