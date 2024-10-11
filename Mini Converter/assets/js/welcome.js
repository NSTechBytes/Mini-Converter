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
  
    document.getElementById("get-started-btn").addEventListener("click", () => {
      // Redirect to the main extension page
      chrome.tabs.create({ url: chrome.extension.getURL("popup.html") });
    });
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
  