let sensorChart = null;

function loadChart(user) {
  // showLoading(true);  ❌ remove or comment this

  const path = "users/" + user + "/history";

  db.ref(path)
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();

      if (!data || Object.keys(data).length === 0) {
        // showChartMessage("No data available"); ❌ remove
        return;
      }

      const range = parseInt(document.getElementById("rangeSelect").value || "6");
      const allData = Object.values(data).slice(-range);

      if (allData.length === 0) {
        // showChartMessage("No data for selected range"); ❌ remove
        return;
      }

      const times = [], temps = [], moisture = [], humidity = [];
      allData.forEach((point) => {
        times.push(point.time);
        temps.push(point.temperature || point.temp);
        moisture.push(point.moisture);
        humidity.push(point.humidity);
      });

      renderChart(times, temps, moisture, humidity);
    })
    .catch((error) => {
      console.error("Chart error:", error);
      // showChartMessage("Failed to load data"); ❌ remove
    });
  // .finally(() => showLoading(false)); ❌ remove this too
}


function renderChart(times, temps, moisture, humidity) {
  if (sensorChart) {
    sensorChart.destroy();
  }

  const ctx = document.getElementById("sensorChart").getContext("2d");

  sensorChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "#ff7043",
          backgroundColor: "rgba(255, 112, 67, 0.2)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#ff7043",
          fill: true,
          tension: 0.3
        },
        {
          label: "Soil Moisture (%)",
          data: moisture,
          borderColor: "#66bb6a",
          backgroundColor: "rgba(102, 187, 106, 0.2)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#66bb6a",
          fill: true,
          tension: 0.3
        },
        {
          label: "Humidity (%)",
          data: humidity,
          borderColor: "#29b6f6",
          backgroundColor: "rgba(41, 182, 246, 0.2)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#29b6f6",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 20
          }
        },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
         ticks: {
  callback: function (value) {
    return value + ""; // Just display the value
  },
  color: "#444" // Optional: consistent tick color
}

        }
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false
      }
    }
  });
}

function downloadChartPNG() {
  const canvas = document.getElementById("sensorChart");
  if (!canvas) return alert("Chart not loaded yet!");

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "farm_sensors.png";
  link.click();
}

function downloadChartPDF() {
  const canvas = document.getElementById("sensorChart");
  if (!canvas) return alert("Chart not loaded yet!");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("landscape");
  pdf.addImage(canvas, "PNG", 15, 15, 260, 120);
  pdf.save("farm_sensors.pdf");
}

function downloadChart() {
  const canvas = document.getElementById("sensorChart");
  if (!canvas) return alert("Chart not loaded yet!");

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `farm_data_${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function showChartMessage(message) {
  const canvas = document.getElementById("sensorChart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px 'Quicksand', sans-serif";
  ctx.fillStyle = "#666";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}
window.loadChart = loadChart;
window.downloadChart = downloadChart;
