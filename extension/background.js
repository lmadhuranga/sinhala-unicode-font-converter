chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-sinhala",
    title: "Convert to Sinhala (Unicode)",
    contexts: ["selection"]
  });
});

function sendOpenModal(tabId, callback) {
  chrome.tabs.sendMessage(tabId, { type: "open-converter-modal" }, () => {
    callback(chrome.runtime.lastError || null);
  });
}

function sendConvertSelection(tabId, selectionText, callback) {
  chrome.tabs.sendMessage(
    tabId,
    {
      type: "convert-selection",
      selectionText
    },
    () => {
      callback(chrome.runtime.lastError || null);
    }
  );
}

function injectConverterAndOpen(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["converter.js", "content.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        // Restricted pages (chrome://, extensions, store) cannot be scripted.
        return;
      }

      chrome.tabs.sendMessage(tabId, { type: "open-converter-modal" }, () => {
        void chrome.runtime.lastError;
      });
    }
  );
}

function openConverterInActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;

    sendOpenModal(tab.id, (error) => {
      if (!error) return;

      const message = String(error.message || "");
      if (message.includes("Receiving end does not exist")) {
        injectConverterAndOpen(tab.id);
      }
    });
  });
}

chrome.action.onClicked.addListener(() => {
  openConverterInActiveTab();
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-converter") return;
  openConverterInActiveTab();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "convert-sinhala" || !tab?.id) return;

  const selectionText = info.selectionText || "";
  sendConvertSelection(tab.id, selectionText, (error) => {
    if (!error) return;

    const message = String(error.message || "");
    if (!message.includes("Receiving end does not exist")) return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["converter.js", "content.js"]
      },
      () => {
        if (chrome.runtime.lastError) {
          // Restricted pages (chrome://, extensions, store) cannot be scripted.
          return;
        }

        sendConvertSelection(tab.id, selectionText, () => {
          void chrome.runtime.lastError;
        });
      }
    );
  });
});
