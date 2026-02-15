const shortcutEl = document.getElementById("shortcut");
const openShortcuts = document.getElementById("open-shortcuts");

function formatShortcut(command) {
  if (!command || !command.shortcut) return "Not set";
  return command.shortcut;
}

chrome.commands.getAll((commands) => {
  const openCmd = commands.find((c) => c.name === "open-converter");
  shortcutEl.textContent = formatShortcut(openCmd);
});

openShortcuts.addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});
