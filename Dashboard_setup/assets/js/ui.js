let lastHeartbeatTime = 0;
const STATUS_TIMEOUT = 5000; // 5 seconds

function setupHeartbeatListener(user) {
  const statusRef = db.ref(`users/${user}/status`);

  // Clear old listeners
  statusRef.off();

  // 1. Listen for heartbeat changes
  statusRef.child("heartbeat").on("value", (snap) => {
    if (snap.exists()) {
      lastHeartbeatTime = Date.now();
      updateConnectionStatus();
    }
  });

  // 2. Listen for Firebase connection
  firebase.database().ref(".info/connected").on("value", (snap) => {
    updateConnectionStatus(snap.val() === true);
  });

  // 3. Periodically check ESP32 connection
  setInterval(updateConnectionStatus, 1000);
}

function updateConnectionStatus(firebaseConnected = true) {
  const dot = document.getElementById("esp-status-dot");
  const text = document.getElementById("esp-status-text");
  const lastSeen = document.getElementById("esp-lastseen");

  const now = Date.now();
  const isOnline = (now - lastHeartbeatTime) < STATUS_TIMEOUT;

  if (!firebaseConnected) {
    dot.style.background = "#ff9800"; // Orange
    text.textContent = "ESP32: Server Disconnected";
    text.setAttribute("data-status", "disconnected");
    dot.classList.remove("online-pulse");
  } else if (isOnline) {
    dot.style.background = "#4CAF50"; // Green
    text.textContent = "ESP32: Online";
    text.setAttribute("data-status", "online");
    dot.classList.add("online-pulse");

    // Update last seen
    db.ref(`users/${currentUser}/status/lastseen`)
      .once("value")
      .then((snap) => {
        if (snap.exists()) lastSeen.textContent = snap.val();
      });
  } else {
    dot.style.background = "#f44336"; // Red
    text.textContent = "ESP32: Offline";
    text.setAttribute("data-status", "offline");
    dot.classList.remove("online-pulse");
  }
}
