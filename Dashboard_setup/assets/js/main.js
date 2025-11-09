let currentUser = null;
window.addEventListener("DOMContentLoaded", () => {
  // Auto-login if saved
  const savedUser = localStorage.getItem("smartfarm_user");
  if (savedUser) {
    handleSuccessfulLogin(savedUser);
  }

  // Event: Login button
  document.querySelector("#login button").addEventListener("click", login);

  // Event: Enter key to focus or submit
  document.getElementById("username").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("password").focus();
    }
  });

  document.getElementById("password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      login();
    }
  });

  // Event: Password visibility toggle
  document.getElementById("togglePassword").addEventListener("click", function () {
    const pwd = document.getElementById("password");
    const eye = this;

    if (pwd.type === "password") {
      pwd.type = "text";
      eye.innerHTML = `<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>`;
    } else {
      pwd.type = "password";
      eye.innerHTML = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`;
    }
  });

  // Event: Change chart range
  const rangeSelector = document.getElementById("rangeSelect");
  if (rangeSelector) {
    rangeSelector.addEventListener("change", () => {
      if (currentUser) loadChart(currentUser);
    });
  }

  // Event: Refresh chart
  const refreshBtn = document.querySelector("button[onclick='refreshChart()']");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      if (currentUser) loadChart(currentUser);
    });
  }

  // Event: Export chart
  const exportBtn = document.querySelector("button[onclick='downloadChart()']");
  if (exportBtn) {
    exportBtn.addEventListener("click", downloadChart);
  }
});
function handleSuccessfulLogin(user) {
  currentUser = user;
  localStorage.setItem("smartfarm_user", user);

  document.getElementById("login").style.display = "none";
  document.getElementById("dashboardHeader").style.display = "flex";
  document.getElementById("dashboardContent").style.display = "block";

  setupHeartbeatListener(user);
  loadData(user);
  loadChart(user);
}
window.handleSuccessfulLogin = handleSuccessfulLogin;
