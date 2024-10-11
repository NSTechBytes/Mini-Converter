document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      // Toggle dark mode
      const isDarkMode = document.body.classList.toggle('dark-mode');
      saveDarkModeSetting(isDarkMode);

      // Update icons based on dark mode state
      updateIconVisibility(isDarkMode);
    });

    // Load dark mode setting when the page is loaded
    loadDarkModeSetting();
  }

  // Convert button click event
  document.getElementById("convert-btn").addEventListener("click", function () {
    const inputColor = document.getElementById("color-input").value;
    const format = document.getElementById("format-select").value;
    let convertedColor;

    try {
      const color = chroma(inputColor);
      document.getElementById("color-display").style.backgroundColor = color.hex();
      
      switch (format) {
        case "hex":
          convertedColor = color.hex();
          break;
        case "rgb":
          convertedColor = color.rgb().join(', ');
          break;
        case "hsl":
          convertedColor = color.hsl().join(', ');
          break;
        case "hsv":
          convertedColor = color.hsv().join(', ');
          break;
        case "hwb":
          convertedColor = color.hwb().join(', ');
          break;
        case "lab":
          convertedColor = color.lab().join(', ');
          break;
        case "decimal":
          const rgb = color.rgb();
          convertedColor = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
          break;
        default:
          convertedColor = "Invalid format";
      }

      document.getElementById("converted-value").textContent = convertedColor;
      addToHistory(inputColor, convertedColor);
      saveHistory(inputColor, convertedColor);

    } catch (error) {
      document.getElementById("converted-value").textContent = "Invalid color input!";
      document.getElementById("color-display").style.backgroundColor = "#ffffff";
    }
  });

  // Copy button click event
  document.getElementById("copy-btn").addEventListener("click", function () {
    const resultText = document.getElementById("converted-value").textContent;
    navigator.clipboard.writeText(resultText)
      .then(() => {
        showCopyPopup();
      })
      .catch(() => {
        alert("Failed to copy!");
      });
  });

  // Clear history button click event
  document.getElementById("clear-history-btn").addEventListener("click", function () {
    clearHistory();
  });

  // Load history on page load
  loadHistory();
});

function updateIconVisibility(isDarkMode) {
  const sunIcon = document.querySelector('#dark-mode-toggle .fa-sun');
  const moonIcon = document.querySelector('#dark-mode-toggle .fa-moon');

  if (sunIcon && moonIcon) {
    sunIcon.style.display = isDarkMode ? 'none' : 'inline';
    moonIcon.style.display = isDarkMode ? 'inline' : 'none';
  }
}

function saveDarkModeSetting(isDarkMode) {
  chrome.storage.local.set({ darkMode: isDarkMode });
}

function loadDarkModeSetting() {
  chrome.storage.local.get({ darkMode: false }, function (result) {
    const isDarkMode = result.darkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Update icon visibility based on the saved setting
    updateIconVisibility(isDarkMode);
  });
}

function showCopyPopup() {
  const popup = document.getElementById('copy-popup');
  if (popup) {
    popup.classList.remove('hidden');
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hidden');
    }, 2000);
  }
}

function addToHistory(inputColor, convertedColor) {
  const historyList = document.getElementById("history-list");
  const historyItem = document.createElement("li");
  
  const colorBox = document.createElement("span");
  colorBox.classList.add("color-box");
  colorBox.style.backgroundColor = chroma(inputColor).hex();
  
  const colorText = document.createElement("span");
  colorText.textContent = `${inputColor} → ${convertedColor}`;
  
  const copyIcon = document.createElement("i");
  copyIcon.classList.add("fas", "fa-copy", "copy-icon");
  copyIcon.title = "Copy";

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
  deleteIcon.title = "Delete";

  copyIcon.addEventListener("click", function () {
    navigator.clipboard.writeText(convertedColor)
      .then(() => {
        showCopyPopup();
      })
      .catch(() => {
        alert("Failed to copy!");
      });
  });

  deleteIcon.addEventListener("click", function () {
    historyItem.remove();
    removeFromHistory(inputColor, convertedColor);
  });

  historyItem.appendChild(colorBox);
  historyItem.appendChild(colorText);
  historyItem.appendChild(copyIcon);
  historyItem.appendChild(deleteIcon);
  historyList.appendChild(historyItem);
}

function saveHistory(inputColor, convertedColor) {
  chrome.storage.local.get({ history: [] }, function (result) {
    let history = result.history;
    history.push({ input: inputColor, output: convertedColor });
    chrome.storage.local.set({ history: history });
  });
}

function loadHistory() {
  chrome.storage.local.get({ history: [] }, function (result) {
    const history = result.history;
    history.forEach(entry => addToHistory(entry.input, entry.output));
  });
}

function removeFromHistory(inputColor, convertedColor) {
  chrome.storage.local.get({ history: [] }, function (result) {
    let history = result.history;
    history = history.filter(entry => entry.input !== inputColor || entry.output !== convertedColor);
    chrome.storage.local.set({ history: history });
  });
}

function clearHistory() {
  chrome.storage.local.set({ history: [] }, function () {
    document.getElementById("history-list").innerHTML = '';
  });
}
