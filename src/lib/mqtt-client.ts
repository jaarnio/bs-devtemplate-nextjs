import mqtt, { MqttClient } from "mqtt";
import { config } from "./config";

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export interface MqttMessage {
  topic: string;
  message: string;
  timestamp: Date;
}

class MqttService {
  private client: MqttClient | null = null;
  private status: ConnectionStatus = "disconnected";
  private messageCallbacks: Set<(message: MqttMessage) => void> = new Set();
  private statusCallbacks: Set<(status: ConnectionStatus) => void> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.connect();
    }
  }

  connect() {
    if (this.client) {
      return;
    }

    this.setStatus("connecting");

    try {
      this.client = mqtt.connect(config.mqtt.broker, {
        clientId: config.mqtt.clientId,
        clean: true,
        reconnectPeriod: 5000,
      });

      this.client.on("connect", () => {
        console.log("MQTT Connected to broker:", config.mqtt.broker);
        this.setStatus("connected");
        this.subscribe(config.mqtt.topic);
      });

      this.client.on("message", (topic: string, payload: Buffer) => {
        const message: MqttMessage = {
          topic,
          message: payload.toString(),
          timestamp: new Date(),
        };
        console.log("MQTT Received message:", message);
        this.messageCallbacks.forEach((callback) => callback(message));
      });

      this.client.on("error", (error) => {
        console.error("MQTT Error:", error);
        this.setStatus("disconnected");
      });

      this.client.on("disconnect", () => {
        console.log("MQTT Disconnected");
        this.setStatus("disconnected");
      });

      this.client.on("offline", () => {
        console.log("MQTT Offline");
        this.setStatus("disconnected");
      });
    } catch (error) {
      console.error("MQTT Connection failed:", error);
      this.setStatus("disconnected");
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(() => {
      console.log("Attempting to reconnect to MQTT broker...");
      this.connect();
    }, 5000);
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.statusCallbacks.forEach((callback) => callback(status));
  }

  subscribe(topic: string) {
    if (this.client && this.status === "connected") {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error("MQTT Subscribe error:", err);
        } else {
          console.log("MQTT Subscribed to topic:", topic);
        }
      });
    }
  }

  publish(topic: string, message: string) {
    if (this.client && this.status === "connected") {
      this.client.publish(topic, message, (err) => {
        if (err) {
          console.error("MQTT Publish error:", err);
        } else {
          console.log("MQTT Published message to topic:", topic, message);
        }
      });
    } else {
      console.warn("MQTT Client not connected, cannot publish message");
    }
  }

  onMessage(callback: (message: MqttMessage) => void) {
    this.messageCallbacks.add(callback);
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  onStatusChange(callback: (status: ConnectionStatus) => void) {
    this.statusCallbacks.add(callback);
    callback(this.status); // Call immediately with current status
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.setStatus("disconnected");
  }
}

// Singleton instance
let mqttService: MqttService | null = null;

export function getMqttService(): MqttService {
  if (!mqttService) {
    mqttService = new MqttService();
  }
  return mqttService;
}