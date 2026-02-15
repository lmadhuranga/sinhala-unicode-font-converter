chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-sinhala",
    title: "Convert to Sinhala (Unicode)",
    contexts: ["selection"]
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;
    chrome.tabs.sendMessage(
      tab.id,
      { type: "open-converter-modal" },
      () => {
        void chrome.runtime.lastError;
      }
    );
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-converter") return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;
    chrome.tabs.sendMessage(
      tab.id,
      { type: "open-converter-modal" },
      () => {
        void chrome.runtime.lastError;
      }
    );
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "convert-sinhala" || !tab?.id) return;

  chrome.tabs.sendMessage(
    tab.id,
    {
      type: "convert-selection",
      selectionText: info.selectionText || ""
    },
    () => {
      // Ignore errors when content script is not available on the page.
      void chrome.runtime.lastError;
    }
  );
});
