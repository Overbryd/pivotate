function enable_canvas() {
  chrome.tabs.executeScript(null, { file: "canvasdraw.js" });
  chrome.tabs.insertCSS(null, { code: "canvas {border: 5px rgba(255, 0, 0, 0.5) solid; position: fixed; top: 0; left: 0}" });
}
