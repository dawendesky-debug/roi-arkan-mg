const commands = [
  // AI MENU
  { name: "ai", category: "AI" },
  { name: "bot", category: "AI" },
  { name: "gpt", category: "AI" },
  { name: "gpt3", category: "AI" },
  { name: "gpt35turbo", category: "AI" },
  { name: "gpt4", category: "AI" },
  { name: "gpt4turbo", category: "AI" },
  { name: "gpt4o", category: "AI" },
  { name: "gpt4omini", category: "AI" },

  // DOWNLOAD
  { name: "capcut", category: "Download" },
  { name: "apk", category: "Download" },
  { name: "fb", category: "Download" },
  { name: "igdl", category: "Download" },
  { name: "igdl2", category: "Download" },
  { name: "igdl3", category: "Download" },
  { name: "mediafire", category: "Download" },
  { name: "dlnpm", category: "Download" },
  { name: "megadl", category: "Download" },
  { name: "ttmp3", category: "Download" },
  { name: "igmp3", category: "Download" },
  { name: "tiktok", category: "Download" },
  { name: "tiktok2", category: "Download" },
  { name: "tiktok3", category: "Download" },
  { name: "ytpost", category: "Download" },
  { name: "download", category: "Download" },

  // SEARCH / MEDIA
  { name: "tsticker", category: "Media" },
  { name: "tiktoksearch", category: "Search" },
  { name: "surah", category: "Search" },
  { name: "tts", category: "Media" },
  { name: "gitclone", category: "Tools" },
  { name: "play", category: "Media" },
  { name: "video", category: "Media" },
  { name: "song", category: "Media" },
  { name: "drama", category: "Media" },
  { name: "cartoon", category: "Media" },
  { name: "movie", category: "Media" },

  // GROUP / AUTO
  { name: "statuslike", category: "Auto" },
  { name: "botdp", category: "Bot" },
  { name: "welcome", category: "Group" },
  { name: "goodbye", category: "Group" },
  { name: "setwelcome", category: "Group" },
  { name: "setgoodbye", category: "Group" },
  { name: "autoread", category: "Auto" },
  { name: "antilink", category: "Group" },
  { name: "antistatus", category: "Auto" },
  { name: "antidelete", category: "Group" },
  { name: "recording", category: "Auto" },
  { name: "statusview", category: "Auto" },
  { name: "autoreact", category: "Auto" },
  { name: "anticall", category: "Group" },
  { name: "anticallmsg", category: "Group" },
  { name: "adminaction", category: "Group" },
  { name: "autotyping", category: "Auto" },
  { name: "online", category: "Bot" },

  // BOT SETTINGS
  { name: "mode", category: "Settings" },
  { name: "prefix", category: "Settings" },
  { name: "botname", category: "Settings" },
  { name: "ownername", category: "Settings" },
  { name: "ownerNumber", category: "Settings" },
  { name: "description", category: "Settings" },
  { name: "stickername", category: "Settings" },
  { name: "delpath", category: "Settings" },
  { name: "reactemojis", category: "Settings" },
  { name: "owneremojis", category: "Settings" },
  { name: "mentionreply", category: "Settings" },

  // OWNER
  { name: "vv3", category: "Owner" },
  { name: "vv", category: "Owner" },
  { name: "vv2", category: "Owner" },
  { name: "delete", category: "Owner" },
  { name: "forward", category: "Owner" },
  { name: "leave", category: "Owner" },
  { name: "hidetag", category: "Owner" },
  { name: "ik", category: "Owner" },
  { name: "block", category: "Owner" },
  { name: "unblock", category: "Owner" },
  { name: "pair", category: "Owner" },
  { name: "follow", category: "Owner" },
  { name: "follow2", category: "Owner" },
  { name: "unfollow", category: "Owner" },
  { name: "unfollow2", category: "Owner" },
  { name: "status", category: "Owner" },
  { name: "status2", category: "Owner" },
  { name: "fullpp", category: "Owner" },

  // SEARCH
  { name: "define", category: "Search" },
  { name: "google", category: "Search" },
  { name: "image", category: "Search" },
  { name: "weather", category: "Search" },
  { name: "news", category: "Search" }
];


// ================================
// ELEMENTS
// ================================

const commandCount = document.getElementById("commandCount");
const categoryCount = document.getElementById("categoryCount");
const prefixDisplay = document.getElementById("prefixDisplay");
const modeDisplay = document.getElementById("modeDisplay");

const commandList = document.getElementById("commandList");
const preview = document.getElementById("preview");
const search = document.getElementById("search");


// ================================
// DASHBOARD STATS
// ================================

const categories = [
  ...new Set(commands.map(command => command.category))
];

commandCount.textContent = commands.length;
categoryCount.textContent = categories.length;


// ================================
// COMMAND PREVIEW
// ================================

function renderPreview() {

  preview.innerHTML = "";

  commands.slice(0, 12).forEach(command => {

    const item = document.createElement("div");

    item.className = "command";

    item.innerHTML = `
      <b>.</b>${command.name}
    `;

    preview.appendChild(item);

  });

}

renderPreview();


// ================================
// COMMAND LIST
// ================================

function renderCommands(list = commands) {

  commandList.innerHTML = "";

  if (list.length === 0) {

    commandList.innerHTML = `
      <div class="panel">
        <h3>Pa jwenn kòmand lan</h3>
        <p class="muted">
          Eseye yon lòt non oswa kategori.
        </p>
      </div>
    `;

    return;
  }


  const grouped = {};

  list.forEach(command => {

    if (!grouped[command.category]) {
      grouped[command.category] = [];
    }

    grouped[command.category].push(command);

  });


  Object.keys(grouped).forEach(category => {

    const section = document.createElement("div");

    section.className = "panel";

    section.innerHTML = `
      <h3>⚡ ${category}</h3>
      <div class="command-grid"></div>
    `;

    const grid = section.querySelector(".command-grid");

    grouped[category].forEach(command => {

      const item = document.createElement("div");

      item.className = "command";

      item.innerHTML = `
        <b>.</b>${command.name}
      `;

      grid.appendChild(item);

    });

    commandList.appendChild(section);

  });

}

renderCommands();


// ================================
// SEARCH COMMANDS
// ================================

if (search) {

  search.addEventListener("input", () => {

    const query = search.value
      .toLowerCase()
      .trim();

    const filtered = commands.filter(command =>
      command.name.toLowerCase().includes(query) ||
      command.category.toLowerCase().includes(query)
    );

    renderCommands(filtered);

  });

}


// ================================
// NAVIGATION
// ================================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav");

function showPage(pageName) {

  pages.forEach(page => {
    page.classList.add("hidden");
  });

  const selected = document.getElementById(pageName);

  if (selected) {
    selected.classList.remove("hidden");
  }

  navButtons.forEach(button => {

    button.classList.remove("active");

    if (button.dataset.page === pageName) {
      button.classList.add("active");
    }

  });

}


navButtons.forEach(button => {

  button.addEventListener("click", () => {

    showPage(button.dataset.page);

  });

});


// ================================
// CONNECT BUTTON
// ================================

document.querySelectorAll("[data-open]").forEach(button => {

  button.addEventListener("click", () => {

    showPage(button.dataset.open);

  });

});


// ================================
// SETTINGS
// ================================

const botName = document.getElementById("botName");
const ownerName = document.getElementById("ownerName");
const prefixInput = document.getElementById("prefixInput");
const modeInput = document.getElementById("modeInput");
const saveSettings = document.getElementById("saveSettings");
const saved = document.getElementById("saved");


if (saveSettings) {

  saveSettings.addEventListener("click", () => {

    const prefix = prefixInput.value || ".";

    prefixDisplay.textContent = prefix;

    modeDisplay.textContent =
      modeInput.value.toUpperCase();

    localStorage.setItem(
      "roiArkanBotName",
      botName.value
    );

    localStorage.setItem(
      "roiArkanOwner",
      ownerName.value
    );

    localStorage.setItem(
      "roiArkanPrefix",
      prefix
    );

    localStorage.setItem(
      "roiArkanMode",
      modeInput.value
    );


    saved.textContent =
      "✓ Settings saved successfully.";

    setTimeout(() => {
      saved.textContent = "";
    }, 3000);

  });

}


// ================================
// LOAD SETTINGS
// ================================

const savedBotName =
  localStorage.getItem("roiArkanBotName");

const savedOwner =
  localStorage.getItem("roiArkanOwner");

const savedPrefix =
  localStorage.getItem("roiArkanPrefix");

const savedMode =
  localStorage.getItem("roiArkanMode");


if (savedBotName && botName) {
  botName.value = savedBotName;
}

if (savedOwner && ownerName) {
  ownerName.value = savedOwner;
}

if (savedPrefix) {

  prefixDisplay.textContent = savedPrefix;

  if (prefixInput) {
    prefixInput.value = savedPrefix;
  }

}

if (savedMode) {

  modeDisplay.textContent =
    savedMode.toUpperCase();

  if (modeInput) {
    modeInput.value = savedMode;
  }

}


// ================================
// START
// ================================

showPage("dashboard");

console.log(
  "ROI ARKAN-MG dashboard loaded successfully."
);
