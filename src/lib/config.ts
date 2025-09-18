export const config = {
  mqtt: {
    broker: process.env.NEXT_PUBLIC_MQTT_BROKER || "wss://test.mosquitto.org:8081",
    topic: process.env.NEXT_PUBLIC_MQTT_TOPIC || "hello-world-reference/test",
    clientId: `hello-world-client-${Math.random().toString(16).substr(2, 8)}`,
  },
  api: {
    port: process.env.PORT || 3000,
  },
};