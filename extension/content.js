(function () {
  const HISTORY_KEY = "sinhala_converter_history";
  const HISTORY_LIMIT = 50;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(items) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (_) {
      // ignore
    }
  }

  function pushHistory(entry) {
    const items = loadHistory();
    items.push(entry);
    const trimmed = items.slice(-HISTORY_LIMIT);
    saveHistory(trimmed);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (_) {
        ok = false;
      }
      document.body.removeChild(textarea);
      return ok;
    }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.zIndex = "2147483647";
    toast.style.right = "16px";
    toast.style.bottom = "16px";
    toast.style.background = "#111";
    toast.style.color = "#fff";
    toast.style.padding = "10px 12px";
    toast.style.borderRadius = "8px";
    toast.style.font = "12px/1.4 sans-serif";
    toast.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function ensureModal() {
    let modal = document.getElementById("sinhala-converter-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "sinhala-converter-modal";
    modal.innerHTML = `
      <div class="sc-backdrop"></div>
      <div class="sc-panel" role="dialog" aria-modal="true" aria-label="Sinhala Converter">
        <div class="sc-header">
          <div class="sc-title">Sinhala Converter</div>
          <button class="sc-close" aria-label="Close">×</button>
        </div>
        <div class="sc-body">
          <label class="sc-label" for="sc-input">Input (Singlish)</label>
          <textarea id="sc-input" class="sc-textarea" rows="4"></textarea>

          <div class="sc-output-row">
            <label class="sc-label" for="sc-output">Unicode Output</label>
            <button class="sc-copy" aria-label="Copy Unicode" title="Copy">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
              </svg>
            </button>
          </div>
          <textarea id="sc-output" class="sc-textarea sc-output" rows="4" readonly></textarea>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #sinhala-converter-modal { position: fixed; inset: 0; z-index: 2147483647; font-family: Arial, sans-serif; color-scheme: dark; }
      #sinhala-converter-modal .sc-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
      #sinhala-converter-modal .sc-panel { position: relative; max-width: 640px; margin: 8vh auto; background: #111318; border-radius: 14px; box-shadow: 0 24px 70px rgba(0,0,0,0.55); padding: 16px; border: 1px solid rgba(255,255,255,0.06); }
      #sinhala-converter-modal .sc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      #sinhala-converter-modal .sc-title { font-size: 16px; font-weight: 700; color: #f1f5f9; }
      #sinhala-converter-modal .sc-close { border: 1px solid rgba(255,255,255,0.1); background: #1a1f2a; color: #e2e8f0; font-size: 18px; cursor: pointer; line-height: 1; padding: 4px 8px; border-radius: 8px; }
      #sinhala-converter-modal .sc-body { display: flex; flex-direction: column; gap: 10px; }
      #sinhala-converter-modal .sc-label { font-size: 12px; font-weight: 600; color: #cbd5f5; }
      #sinhala-converter-modal .sc-textarea { width: 100%; border: 1px solid #2a3344; border-radius: 8px; padding: 8px; font-size: 14px; resize: vertical; background: #0b0f16; color: #e2e8f0; }
      #sinhala-converter-modal .sc-output { background: #0f141d; }
      #sinhala-converter-modal .sc-output-row { display: flex; align-items: center; justify-content: space-between; }
      #sinhala-converter-modal .sc-copy { border: 1px solid #2a3344; background: #141a24; border-radius: 8px; padding: 6px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
      #sinhala-converter-modal .sc-copy svg { width: 16px; height: 16px; fill: #cbd5f5; }
      #sinhala-converter-modal .sc-copy:hover { background: #1b2331; }
      #sinhala-converter-modal .sc-close:hover { background: #22293a; }
      @media (max-width: 680px) {
        #sinhala-converter-modal .sc-panel { margin: 6vh 12px; }
      }
    `;

    modal.appendChild(style);
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".sc-close");
    const backdrop = modal.querySelector(".sc-backdrop");
    const close = () => modal.remove();
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);

    return modal;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type !== "convert-selection" && msg?.type !== "open-converter-modal") return;

    const convert = window.__sinhalaConverter?.convertSinglishToUnicode;
    if (typeof convert !== "function") {
      showToast("Converter not available");
      return;
    }

    const source = msg.selectionText || "";
    const modal = ensureModal();
    const input = modal.querySelector("#sc-input");
    const output = modal.querySelector("#sc-output");
    const copyBtn = modal.querySelector(".sc-copy");

    const history = loadHistory();
    const initialText = source || (history.length ? history[history.length - 1].source : "");

    input.value = initialText;
    output.value = convert(initialText);
    input.focus();

    input.oninput = () => {
      output.value = convert(input.value);
    };

    copyBtn.onclick = () => {
      copyToClipboard(output.value).then((ok) => {
        showToast(ok ? "Unicode copied" : "Copy failed");
      });
    };

    if (source) {
      pushHistory({
        source,
        converted: convert(source),
        ts: Date.now()
      });
    }
  });
})();
