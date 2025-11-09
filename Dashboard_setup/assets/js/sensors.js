function loadData(user) {
  const path = "users/" + user;

  db.ref(path + "/sensors").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) updateSensorDisplay(data);
  });

  db.ref(path + "/control/relay1").on("value", (snap) => {
    const el = document.getElementById("relay1");
    if (el) el.checked = snap.val();
    updateRelayAnimation("relay1", snap.val());
  });

  db.ref(path + "/control/relay2").on("value", (snap) => {
    const el = document.getElementById("relay2");
    if (el) el.checked = snap.val();
    updateRelayAnimation("relay2", snap.val());
  });
}

function updateSensorDisplay(data) {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ✅ Safe update helpers
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const setStyle = (id, style, value) => {
    const el = document.getElementById(id);
    if (el && el.style) el.style[style] = value;
  };

  const toggleClass = (id, cls, condition) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle(cls, condition);
  };

  // Moisture
  setStyle("moistureFill", "width", data.moisture + "%");
  setText("moistureText", `${data.moisture}%`);
  setText("moistureTime", timeString);
  updateStatusIndicator("moistureStatus", data.moisture, [30, 60], ["#ff5722", "#ffc107", "#4CAF50"]);

  // Temperature
  setText("temp", `${data.temperature} °C`);
  setText("tempTime", timeString);
  updateStatusIndicator("tempStatus", data.temperature, [20, 30], ["#29b6f6", "#66bb6a", "#ff7043"]);

  // Humidity
  setText("hum", `${data.humidity} %`);
  setText("humTime", timeString);
  updateStatusIndicator("humStatus", data.humidity, [40, 70], ["#ff7043", "#66bb6a", "#29b6f6"]);

  // LDR
  setText("ldr", data.ldr);
  setText("ldrTime", timeString);
  updateStatusIndicator("ldrStatus", data.ldr, [300, 700], ["#ff7043", "#ffc107", "#66bb6a"]);

  // Rain
  setText("rain", data.rain ? "Yes" : "No");
  setText("rainTime", timeString);
  setStyle("rainStatus", "backgroundColor", data.rain ? "#2196F3" : "#9E9E9E");

  // Animation Effects
  toggleClass("moistureCard", "moisture-wave", data.moisture < 30);
  toggleClass("tempCard", "heat-wave", data.temperature > 35);
  toggleClass("humidityCard", "humidity-fog", data.humidity > 70);
  toggleClass("sunEffect", "sun-glow", data.ldr > 700);

  // Rain Drop Effect
  const rainCard = document.getElementById("rainCard");
  if (rainCard) {
    rainCard.classList.remove("rainy");
    rainCard.querySelectorAll(".rain-drop").forEach((el) => el.remove());

    if (data.rain) {
      rainCard.classList.add("rainy");
      for (let i = 0; i < 30; i++) {
        const drop = document.createElement("div");
        drop.classList.add("rain-drop");
        drop.style.left = Math.random() * 100 + "%";
        drop.style.animationDelay = Math.random() * 1 + "s";
        rainCard.appendChild(drop);
      }
    }
  }
}

function updateStatusIndicator(id, value, thresholds, colors) {
  const indicator = document.getElementById(id);
  if (!indicator) return;

  if (value < thresholds[0]) {
    indicator.style.backgroundColor = colors[0];
  } else if (value < thresholds[1]) {
    indicator.style.backgroundColor = colors[1];
  } else {
    indicator.style.backgroundColor = colors[2];
  }
}

function toggleRelay(relay) {
  const user = currentUser || document.getElementById("username").value;
  const isChecked = document.getElementById(relay).checked;
  db.ref("users/" + user + "/control/" + relay).set(isChecked);
}

function updateRelayAnimation(relay, state) {
  // This is just a placeholder to avoid the crash
  console.log(`Relay ${relay} is now ${state ? "ON" : "OFF"}`);
}
