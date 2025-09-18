"use client";

import { useEffect, useState, useRef } from "react";
import { getMqttService, MqttMessage, ConnectionStatus } from "@/src/lib/mqtt-client";
import { config } from "@/src/lib/config";

interface MqttPanelProps {
  onStatusChange: (status: ConnectionStatus) => void;
}

export default function MqttPanel({ onStatusChange }: MqttPanelProps) {
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqttService = getMqttService();

    const unsubscribeMessage = mqttService.onMessage((message) => {
      setMessages((prev) => [...prev.slice(-19), message]); // Keep last 20 messages
      scrollToBottom();
    });

    const unsubscribeStatus = mqttService.onStatusChange((status) => {
      onStatusChange(status);
      if (status === "connected") {
        showToastMessage("Connected to MQTT broker!");
      } else if (status === "disconnected") {
        showToastMessage("Disconnected from MQTT broker");
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [onStatusChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsPublishing(true);
    const mqttService = getMqttService();

    try {
      mqttService.publish(config.mqtt.topic, inputMessage);
      showToastMessage("Message published successfully!");
      setInputMessage("");
    } catch (error) {
      console.error("Failed to publish message:", error);
      showToastMessage("Failed to publish message");
    } finally {
      setIsPublishing(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body flex flex-col h-full">
        <h2 className="card-title text-2xl mb-4">MQTT Integration Panel</h2>

        {/* Publish Form */}
        <form onSubmit={handlePublish} className="form-control w-full">
          <label className="label">
            <span className="label-text text-lg">Topic: {config.mqtt.topic}</span>
          </label>
          <div className="join w-full">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter message to publish..."
              className="input input-bordered input-lg join-item flex-1 text-lg"
              disabled={isPublishing}
            />
            <button
              type="submit"
              className="btn btn-primary btn-lg join-item px-8 text-lg"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>

        {/* Messages Display */}
        <div className="divider text-lg">Received Messages</div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-lg text-base-content/70">
            Showing last {messages.length} message(s)
          </span>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="btn btn-ghost btn-sm"
            >
              Clear
            </button>
          )}
        </div>

        <div className="bg-base-200 rounded-lg p-4 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-base-content/50 py-8">
              <p className="text-xl">No messages received yet.</p>
              <p className="text-lg mt-2">Waiting for messages on:</p>
              <p className="text-lg font-mono mt-1">{config.mqtt.topic}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-base-100 p-3 rounded-lg border border-base-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm text-base-content/60">
                        {msg.timestamp.toLocaleTimeString()} - {msg.topic}
                      </div>
                      <div className="font-mono text-lg mt-1">{msg.message}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Connection Info */}
        <div className="text-sm text-base-content/60 mt-auto pt-2">
          Broker: {config.mqtt.broker}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}