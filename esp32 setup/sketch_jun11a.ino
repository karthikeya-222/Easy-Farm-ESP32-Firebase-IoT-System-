#include <WiFi.h>
#include <FirebaseESP32.h>

// Replace with your network credentials
#define WIFI_SSID "SAMSUNG M12"
#define WIFI_PASSWORD "12345678"

// Replace with your Firebase project credentials
#define DATABASE_URL "smart-farming-ef27a-default-rtdb.asia-southeast1.firebasedatabase.app"

#define API_KEY "dummy_key"  // Not used with open rules

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");

  // Configure Firebase
  config.database_url = DATABASE_URL;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Update status in database
  if (Firebase.setBool(fbdo, "/status/online", true)) {
    Serial.println("✅ ESP32 online status set to TRUE");
  } else {
    Serial.println("❌ Failed to write online status");
    Serial.println(fbdo.errorReason());
  }
}

void loop() {
  // Nothing for now – we’ll add sensors next
}
