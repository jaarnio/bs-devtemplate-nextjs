import mqtt, { MqttClient } from "mqtt";
import { config } from "./config";

let serverMqttClient: MqttClient | null = null;
let connectionStatus = "disconnected";

export function getServerMqttStatus() {
  return {
    connected: connectionStatus === "connected",
    status: connectionStatus,
    broker: config.mqtt.broker,
    topic: config.mqtt.topic,
    clientId: config.mqtt.clientId,
  };
}

export function initServerMqttClient() {
  if (serverMqttClient) {
    return serverMqttClient;
  }

  try {
    connectionStatus = "connecting";
    serverMqttClient = mqtt.connect(config.mqtt.broker, {
      clientId: `server-${config.mqtt.clientId}`,
      clean: true,
      reconnectPeriod: 5000,
    });

    serverMqttClient.on("connect", () => {
      console.log("[Server] MQTT Connected");
      connectionStatus = "connected";
    });

    serverMqttClient.on("error", (error) => {
      console.error("[Server] MQTT Error:", error);
      connectionStatus = "error";
    });

    serverMqttClient.on("disconnect", () => {
      console.log("[Server] MQTT Disconnected");
      connectionStatus = "disconnected";
    });

    return serverMqttClient;
  } catch (error) {
    console.error("[Server] Failed to initialize MQTT client:", error);
    connectionStatus = "error";
    return null;
  }
}